package vn.leadhub.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public final class UserDtos {
  private UserDtos() {}

  public record UserDto(Long id, String email, String fullName, Role role, boolean active, Instant createdAt) {}

  /** Thông tin rút gọn để chọn người phụ trách. */
  public record AssigneeDto(Long id, String fullName, Role role) {}

  public record CreateUserRequest(
      @NotBlank(message = "Vui lòng nhập họ tên") @Size(max = 120, message = "Họ tên tối đa 120 ký tự") String fullName,
      @NotBlank(message = "Vui lòng nhập email") @Email(message = "Email không hợp lệ") @Size(max = 190) String email,
      @NotNull(message = "Vui lòng chọn vai trò") Role role,
      @NotBlank(message = "Vui lòng nhập mật khẩu")
          @Size(min = 8, max = 72, message = "Mật khẩu từ 8 đến 72 ký tự")
          String password) {}

  public record UpdateUserRequest(
      @NotBlank(message = "Vui lòng nhập họ tên") @Size(max = 120, message = "Họ tên tối đa 120 ký tự") String fullName,
      @NotNull(message = "Vui lòng chọn vai trò") Role role,
      @NotNull Boolean active) {}
}
