package vn.leadhub.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Chặn khởi động production với JWT secret mặc định. "Production" = tắt dữ liệu demo
 * (APP_SEED_DEMO=false). Ở chế độ demo chỉ cảnh báo để `docker compose up` chạy ngay được.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StartupSafetyCheck {
  private final AppProperties props;

  @PostConstruct
  void check() {
    if (!isPlaceholder(props.jwt().secret())) return;
    if (props.seed() == null || !props.seed().demo()) {
      throw new IllegalStateException(
          "JWT_SECRET đang dùng giá trị mặc định. Đặt JWT_SECRET ngẫu nhiên (openssl rand -base64 48) trước khi chạy production.");
    }
    log.warn("JWT_SECRET đang dùng giá trị mặc định — chỉ chấp nhận cho môi trường demo.");
  }

  static boolean isPlaceholder(String secret) {
    if (secret == null) return true;
    String s = secret.toLowerCase();
    return s.contains("change-me") || s.startsWith("dev-only");
  }
}
