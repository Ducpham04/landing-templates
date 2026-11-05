package vn.leadhub.unit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Duration;
import org.junit.jupiter.api.Test;
import vn.leadhub.config.AppProperties;
import vn.leadhub.security.JwtService;
import vn.leadhub.user.Role;
import vn.leadhub.user.User;

class JwtServiceTest {
  private static AppProperties props(String secret, Duration ttl) {
    return new AppProperties(new AppProperties.Jwt(secret, ttl, Duration.ofDays(7)), null, null, null);
  }

  private static final String SECRET = "test-secret-test-secret-test-secret-123456";
  private final User user = User.builder().id(42L).email("a@b.vn").role(Role.SALES).fullName("A").build();

  @Test
  void createsAndParsesToken() {
    JwtService jwt = new JwtService(props(SECRET, Duration.ofMinutes(15)));
    var p = jwt.parse(jwt.createAccessToken(user)).orElseThrow();
    assertThat(p.id()).isEqualTo(42L);
    assertThat(p.email()).isEqualTo("a@b.vn");
    assertThat(p.role()).isEqualTo(Role.SALES);
    assertThat(jwt.accessTtlSeconds()).isEqualTo(900);
  }

  @Test
  void rejectsTamperedToken() {
    JwtService jwt = new JwtService(props(SECRET, Duration.ofMinutes(15)));
    String token = jwt.createAccessToken(user);
    String tampered = token.substring(0, token.length() - 3) + (token.endsWith("aaa") ? "bbb" : "aaa");
    assertThat(jwt.parse(tampered)).isEmpty();
    assertThat(jwt.parse("not-a-token")).isEmpty();
  }

  @Test
  void rejectsTokenSignedWithOtherSecret() {
    String token = new JwtService(props(SECRET, Duration.ofMinutes(15))).createAccessToken(user);
    JwtService other = new JwtService(props("another-secret-another-secret-another-1234", Duration.ofMinutes(15)));
    assertThat(other.parse(token)).isEmpty();
  }

  @Test
  void rejectsExpiredToken() {
    JwtService jwt = new JwtService(props(SECRET, Duration.ofSeconds(-5)));
    assertThat(jwt.parse(jwt.createAccessToken(user))).isEmpty();
  }

  @Test
  void refusesShortSecret() {
    assertThatThrownBy(() -> new JwtService(props("short", Duration.ofMinutes(1))))
        .isInstanceOf(IllegalStateException.class);
  }
}
