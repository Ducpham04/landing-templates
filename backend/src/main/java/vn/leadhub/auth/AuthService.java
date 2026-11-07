package vn.leadhub.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.leadhub.auth.AuthDtos.AuthResponse;
import vn.leadhub.common.AppException;
import vn.leadhub.config.AppProperties;
import vn.leadhub.security.JwtService;
import vn.leadhub.user.User;
import vn.leadhub.user.UserMapper;
import vn.leadhub.user.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {
  private static final SecureRandom RANDOM = new SecureRandom();

  private final UserRepository users;
  private final RefreshTokenRepository tokens;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final UserMapper userMapper;
  private final AppProperties props;
  /** Hash giả để so sánh khi email không tồn tại — giữ thời gian phản hồi đồng đều (chống dò email). */
  private volatile String dummyHash;

  private String dummyHash() {
    if (dummyHash == null) dummyHash = passwordEncoder.encode("leadhub-dummy-password");
    return dummyHash;
  }

  @Transactional
  public AuthResponse login(String email, String password) {
    User user = users.findByEmailIgnoreCase(email.trim()).orElse(null);
    boolean ok = passwordEncoder.matches(password, user != null ? user.getPasswordHash() : dummyHash());
    if (user == null || !ok) {
      throw AppException.unauthorized("Email hoặc mật khẩu không đúng");
    }
    if (!user.isActive()) {
      throw new AppException(HttpStatus.FORBIDDEN, "ACCOUNT_LOCKED", "Tài khoản đã bị khoá, vui lòng liên hệ quản trị viên");
    }
    return issue(user);
  }

  @Transactional
  public AuthResponse refresh(String rawToken) {
    RefreshToken token =
        tokens.findByTokenHash(hash(rawToken)).orElseThrow(() -> AppException.unauthorized("Phiên đăng nhập không hợp lệ"));
    Instant now = Instant.now();
    if (!token.isUsable(now)) {
      throw AppException.unauthorized("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
    }
    User user = token.getUser();
    if (!user.isActive()) {
      throw new AppException(HttpStatus.FORBIDDEN, "ACCOUNT_LOCKED", "Tài khoản đã bị khoá");
    }
    token.setRevokedAt(now); // rotation: token cũ chỉ dùng được 1 lần
    return issue(user);
  }

  @Transactional
  public void logout(String rawToken) {
    tokens.findByTokenHash(hash(rawToken)).filter(t -> t.getRevokedAt() == null).ifPresent(t -> t.setRevokedAt(Instant.now()));
  }

  private AuthResponse issue(User user) {
    byte[] bytes = new byte[32];
    RANDOM.nextBytes(bytes);
    String raw = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    tokens.save(
        RefreshToken.builder()
            .user(user)
            .tokenHash(hash(raw))
            .expiresAt(Instant.now().plus(props.jwt().refreshTtl()))
            .build());
    return new AuthResponse(jwtService.createAccessToken(user), raw, jwtService.accessTtlSeconds(), userMapper.toDto(user));
  }

  static String hash(String raw) {
    try {
      MessageDigest md = MessageDigest.getInstance("SHA-256");
      return HexFormat.of().formatHex(md.digest(raw.getBytes(StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException(e);
    }
  }

  /** Dọn refresh token hết hạn/thu hồi quá 1 ngày, chạy mỗi giờ. */
  @Scheduled(fixedDelay = 3_600_000, initialDelay = 60_000)
  @Transactional
  public void purgeExpired() {
    tokens.deleteExpired(Instant.now().minus(1, ChronoUnit.DAYS));
  }
}
