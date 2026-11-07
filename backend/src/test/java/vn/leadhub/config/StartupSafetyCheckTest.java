package vn.leadhub.config;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Duration;
import org.junit.jupiter.api.Test;

class StartupSafetyCheckTest {
  private static AppProperties props(String secret, boolean demo) {
    return new AppProperties(new AppProperties.Jwt(secret, Duration.ofMinutes(15), Duration.ofDays(7)), null, null, new AppProperties.Seed(demo));
  }

  @Test
  void refusesPlaceholderSecretInProduction() {
    assertThatThrownBy(() -> new StartupSafetyCheck(props("change-me-to-a-long-random-secret-at-least-32-chars", false)).check())
        .isInstanceOf(IllegalStateException.class);
    assertThatThrownBy(() -> new StartupSafetyCheck(props("dev-only-secret-change-me-please-0123456789abcdef", false)).check())
        .isInstanceOf(IllegalStateException.class);
  }

  @Test
  void allowsPlaceholderInDemoAndRealSecretInProduction() {
    assertThatCode(() -> new StartupSafetyCheck(props("change-me-to-a-long-random-secret-at-least-32-chars", true)).check()).doesNotThrowAnyException();
    assertThatCode(() -> new StartupSafetyCheck(props("Zq8x0mS1yQ4u7bV9cN2kR5tW3eH6jL1pA0dF8gY", false)).check()).doesNotThrowAnyException();
  }
}
