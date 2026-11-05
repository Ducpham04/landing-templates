package vn.leadhub.config;

import java.time.Duration;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Jwt jwt, Cors cors, RateLimit rateLimit, Seed seed) {
  public record Jwt(String secret, Duration accessTtl, Duration refreshTtl) {}

  public record Cors(List<String> publicOrigins, List<String> adminOrigins) {}

  public record RateLimit(int publicLeadsPerMinute, int loginPerMinute) {}

  public record Seed(boolean demo) {}
}
