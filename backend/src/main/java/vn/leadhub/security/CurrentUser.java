package vn.leadhub.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import vn.leadhub.common.AppException;

public final class CurrentUser {
  private CurrentUser() {}

  public static UserPrincipal get() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth != null && auth.getPrincipal() instanceof UserPrincipal p) return p;
    throw AppException.unauthorized("Vui lòng đăng nhập");
  }
}
