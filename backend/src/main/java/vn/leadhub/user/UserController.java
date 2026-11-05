package vn.leadhub.user;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.leadhub.security.CurrentUser;
import vn.leadhub.user.UserDtos.*;

@Tag(name = "Users")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
  private final UserService service;

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public List<UserDto> list() {
    return service.list();
  }

  @GetMapping("/assignees")
  public List<AssigneeDto> assignees() {
    return service.assignees();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('ADMIN')")
  public UserDto create(@Valid @RequestBody CreateUserRequest req) {
    return service.create(req);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public UserDto update(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest req) {
    return service.update(id, req, CurrentUser.get().id());
  }
}
