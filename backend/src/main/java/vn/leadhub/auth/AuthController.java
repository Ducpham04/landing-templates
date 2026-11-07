package vn.leadhub.auth;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import vn.leadhub.auth.AuthDtos.*;
import vn.leadhub.common.AppException;
import vn.leadhub.security.CurrentUser;
import vn.leadhub.user.UserDtos.UserDto;
import vn.leadhub.user.UserMapper;
import vn.leadhub.user.UserRepository;

@Tag(name = "Auth")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final AuthService authService;
  private final UserRepository users;
  private final UserMapper mapper;

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest req) {
    return authService.login(req.email(), req.password());
  }

  @PostMapping("/refresh")
  public AuthResponse refresh(@Valid @RequestBody RefreshRequest req) {
    return authService.refresh(req.refreshToken());
  }

  @PostMapping("/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(@Valid @RequestBody RefreshRequest req) {
    authService.logout(req.refreshToken());
  }

  @GetMapping("/me")
  @Transactional(readOnly = true)
  public UserDto me() {
    return users.findById(CurrentUser.get().id()).map(mapper::toDto).orElseThrow(() -> AppException.notFound("người dùng"));
  }
}
