package vn.leadhub.unit;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import vn.leadhub.security.RateLimiter;

class RateLimiterTest {
  @Test
  void allowsUpToLimitThenBlocksPerKey() {
    RateLimiter rl = new RateLimiter();
    for (int i = 0; i < 3; i++) assertThat(rl.tryAcquire("ip1", 3, 60_000)).isTrue();
    assertThat(rl.tryAcquire("ip1", 3, 60_000)).isFalse();
    assertThat(rl.tryAcquire("ip2", 3, 60_000)).isTrue();
  }

  @Test
  void windowSlides() throws Exception {
    RateLimiter rl = new RateLimiter();
    assertThat(rl.tryAcquire("k", 1, 50)).isTrue();
    assertThat(rl.tryAcquire("k", 1, 50)).isFalse();
    Thread.sleep(80);
    assertThat(rl.tryAcquire("k", 1, 50)).isTrue();
  }
}
