package vn.leadhub.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;
import vn.leadhub.config.AppProperties;
import vn.leadhub.user.Role;
import vn.leadhub.user.User;

@Service
public class JwtService {
  private static final String ISSUER = "leadhub";
  private final SecretKey key;
  private final AppProperties.Jwt cfg;

  public JwtService(AppProperties props) {
    this.cfg = props.jwt();
    byte[] bytes = cfg.secret() == null ? new byte[0] : cfg.secret().getBytes(StandardCharsets.UTF_8);
    if (bytes.length < 32) {
      throw new IllegalStateException("JWT secret phải dài tối thiểu 32 byte (đặt biến môi trường JWT_SECRET)");
    }
    this.key = Keys.hmacShaKeyFor(bytes);
  }

  public String createAccessToken(User user) {
    Instant now = Instant.now();
    return Jwts.builder()
        .issuer(ISSUER)
        .subject(String.valueOf(user.getId()))
        .claim("email", user.getEmail())
        .claim("role", user.getRole().name())
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plus(cfg.accessTtl())))
        .signWith(key, Jwts.SIG.HS256)
        .compact();
  }

  public long accessTtlSeconds() {
    return cfg.accessTtl().toSeconds();
  }

  /** Trả về principal nếu token hợp lệ, còn hạn, đúng issuer; ngược lại empty. */
  public Optional<UserPrincipal> parse(String token) {
    try {
      Claims c = Jwts.parser().verifyWith(key).requireIssuer(ISSUER).build().parseSignedClaims(token).getPayload();
      return Optional.of(
          new UserPrincipal(Long.valueOf(c.getSubject()), c.get("email", String.class), Role.valueOf(c.get("role", String.class))));
    } catch (JwtException | IllegalArgumentException e) {
      return Optional.empty();
    }
  }
}
