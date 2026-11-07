package vn.leadhub.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import vn.leadhub.common.ApiError;
import vn.leadhub.security.JwtAuthenticationFilter;
import vn.leadhub.security.RateLimitFilter;

@Configuration
@EnableMethodSecurity
@EnableScheduling
@RequiredArgsConstructor
public class SecurityConfig {
  private final JwtAuthenticationFilter jwtFilter;
  private final RateLimitFilter rateLimitFilter;
  private final AppProperties props;
  private final ObjectMapper json;

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(c -> c.disable()) // API stateless dùng Bearer token, không dùng cookie → không cần CSRF
        .cors(c -> c.configurationSource(corsSource()))
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .headers(h -> h.frameOptions(f -> f.deny()).contentTypeOptions(c -> {}))
        .authorizeHttpRequests(
            a ->
                a.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/public/leads").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/refresh", "/api/auth/logout").permitAll()
                    .requestMatchers("/actuator/health/**", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                    .requestMatchers("/api/users/assignees").authenticated()
                    .requestMatchers("/api/users/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/sites").authenticated()
                    .requestMatchers("/api/sites/**").hasRole("ADMIN")
                    .requestMatchers("/api/leads/export").hasRole("ADMIN")
                    .requestMatchers("/api/**").authenticated()
                    .anyRequest().denyAll())
        .exceptionHandling(
            e ->
                e.authenticationEntryPoint(
                        (req, res, ex) -> write(res, 401, ApiError.of(401, "UNAUTHORIZED", "Vui lòng đăng nhập")))
                    .accessDeniedHandler(
                        (req, res, ex) ->
                            write(res, 403, ApiError.of(403, "FORBIDDEN", "Bạn không có quyền thực hiện thao tác này"))))
        .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  private void write(HttpServletResponse res, int status, ApiError body) throws java.io.IOException {
    res.setStatus(status);
    res.setContentType(MediaType.APPLICATION_JSON_VALUE);
    res.setCharacterEncoding("UTF-8");
    json.writeValue(res.getWriter(), body);
  }

  @Bean
  CorsConfigurationSource corsSource() {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

    CorsConfiguration pub = new CorsConfiguration();
    pub.setAllowedOriginPatterns(clean(props.cors().publicOrigins(), List.of("*")));
    pub.setAllowedMethods(List.of("POST", "OPTIONS"));
    pub.setAllowedHeaders(List.of("Content-Type", "Accept"));
    pub.setAllowCredentials(false);
    pub.setMaxAge(3600L);
    source.registerCorsConfiguration("/api/public/**", pub);

    List<String> adminOrigins = clean(props.cors().adminOrigins(), List.of());
    if (!adminOrigins.isEmpty()) {
      CorsConfiguration admin = new CorsConfiguration();
      admin.setAllowedOrigins(adminOrigins);
      admin.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
      admin.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
      admin.setExposedHeaders(List.of("Content-Disposition"));
      admin.setMaxAge(3600L);
      source.registerCorsConfiguration("/api/**", admin);
    }
    return source;
  }

  private static List<String> clean(List<String> in, List<String> fallback) {
    if (in == null) return fallback;
    List<String> out = in.stream().map(String::trim).filter(s -> !s.isEmpty()).toList();
    return out.isEmpty() ? fallback : out;
  }

  /** Các filter là @Component: tắt đăng ký servlet tự động, chỉ chạy trong Security chain. */
  @Bean
  FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration(JwtAuthenticationFilter f) {
    FilterRegistrationBean<JwtAuthenticationFilter> r = new FilterRegistrationBean<>(f);
    r.setEnabled(false);
    return r;
  }

  @Bean
  FilterRegistrationBean<RateLimitFilter> rateLimitFilterRegistration(RateLimitFilter f) {
    FilterRegistrationBean<RateLimitFilter> r = new FilterRegistrationBean<>(f);
    r.setEnabled(false);
    return r;
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(10);
  }
}
