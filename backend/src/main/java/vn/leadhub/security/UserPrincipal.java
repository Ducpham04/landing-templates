package vn.leadhub.security;

import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import vn.leadhub.user.Role;

/** Người dùng đã xác thực (lấy từ JWT, không truy vấn DB mỗi request). */
public record UserPrincipal(Long id, String email, Role role) {
  public Collection<? extends GrantedAuthority> authorities() {
    return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
  }

  public boolean isAdmin() {
    return role == Role.ADMIN;
  }
}
