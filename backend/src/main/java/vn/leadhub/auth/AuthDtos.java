package vn.leadhub.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import vn.leadhub.user.UserDtos.UserDto;

public final class AuthDtos {
  private AuthDtos() {}

  public record LoginRequest(
      @NotBlank(message = "Vui lòng nhập email") @Size(max = 190) String email,
      @NotBlank(message = "Vui lòng nhập mật khẩu") @Size(max = 72) String password) {}

  public record RefreshRequest(@NotBlank(message = "Thiếu refresh token") @Size(max = 200) String refreshToken) {}

  public record AuthResponse(String accessToken, String refreshToken, long expiresIn, UserDto user) {}
}
