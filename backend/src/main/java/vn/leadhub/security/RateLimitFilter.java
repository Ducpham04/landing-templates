package vn.leadhub.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import vn.leadhub.common.ApiError;
import vn.leadhub.config.AppProperties;

/** Rate limit + giới hạn kích thước body cho các endpoint public dễ bị spam. */
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {
  static final int MAX_PUBLIC_BODY = 16 * 1024;
  private static final long MINUTE = 60_000;
  private final RateLimiter limiter;
  private final AppProperties props;
  private final ObjectMapper json;

  @Override
  protected boolean shouldNotFilter(HttpServletRequest req) {
    if (!"POST".equals(req.getMethod())) return true;
    String uri = req.getRequestURI();
    return !(uri.equals("/api/public/leads") || uri.equals("/api/auth/login"));
  }

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    boolean isLead = req.getRequestURI().equals("/api/public/leads");
    // Không có Content-Length (chunked) → không kiểm soát được kích thước → từ chối
    if (isLead && req.getContentLengthLong() < 0 && req.getHeader("Transfer-Encoding") != null) {
      write(res, 411, ApiError.of(411, "LENGTH_REQUIRED", "Thiếu Content-Length"));
      return;
    }
    if (isLead && req.getContentLengthLong() > MAX_PUBLIC_BODY) {
      write(res, 413, ApiError.of(413, "PAYLOAD_TOO_LARGE", "Dữ liệu gửi lên quá lớn"));
      return;
    }
    int limit = isLead ? props.rateLimit().publicLeadsPerMinute() : props.rateLimit().loginPerMinute();
    String key = (isLead ? "lead:" : "login:") + req.getRemoteAddr();
    if (!limiter.tryAcquire(key, limit, MINUTE)) {
      res.setHeader("Retry-After", "60");
      write(res, 429, ApiError.of(429, "TOO_MANY_REQUESTS", "Bạn thao tác quá nhanh, vui lòng thử lại sau 1 phút"));
      return;
    }
    chain.doFilter(req, res);
  }

  private void write(HttpServletResponse res, int status, ApiError body) throws IOException {
    res.setStatus(status);
    res.setContentType(MediaType.APPLICATION_JSON_VALUE);
    res.setCharacterEncoding("UTF-8");
    json.writeValue(res.getWriter(), body);
  }
}
