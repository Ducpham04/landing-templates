package vn.leadhub.user;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.leadhub.common.AppException;
import vn.leadhub.user.UserDtos.*;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository users;
  private final UserMapper mapper;
  private final PasswordEncoder passwordEncoder;

  @Transactional(readOnly = true)
  public List<UserDto> list() {
    return users.findAllByOrderByCreatedAtAsc().stream().map(mapper::toDto).toList();
  }

  @Transactional(readOnly = true)
  public List<AssigneeDto> assignees() {
    return users.findByActiveTrueOrderByFullNameAsc().stream().map(mapper::toAssignee).toList();
  }

  @Transactional
  public UserDto create(CreateUserRequest req) {
    String email = req.email().trim().toLowerCase();
    if (users.existsByEmailIgnoreCase(email)) {
      throw AppException.conflict("EMAIL_EXISTS", "Email này đã được sử dụng");
    }
    User u =
        User.builder()
            .email(email)
            .fullName(req.fullName().trim())
            .role(req.role())
            .passwordHash(passwordEncoder.encode(req.password()))
            .active(true)
            .build();
    return mapper.toDto(users.save(u));
  }

  @Transactional
  public UserDto update(Long id, UpdateUserRequest req, Long currentUserId) {
    User u = users.findById(id).orElseThrow(() -> AppException.notFound("người dùng"));
    if (u.getId().equals(currentUserId) && (!req.active() || req.role() != u.getRole())) {
      throw AppException.badRequest("SELF_UPDATE_FORBIDDEN", "Không thể tự khoá hoặc đổi vai trò của chính mình");
    }
    u.setFullName(req.fullName().trim());
    u.setRole(req.role());
    u.setActive(req.active());
    return mapper.toDto(u);
  }
}
