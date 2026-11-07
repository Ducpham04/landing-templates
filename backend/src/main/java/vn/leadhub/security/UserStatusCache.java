package vn.leadhub.security;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vn.leadhub.user.UserRepository;

/**
 * Kiểm tra tài khoản còn hoạt động cho mỗi request có JWT, cache 30 giây để không truy vấn DB liên tục.
 * Khi quản trị khoá/đổi vai trò, gọi {@link #evict} để có hiệu lực ngay.
 */
@Component
@RequiredArgsConstructor
public class UserStatusCache {
  static final long TTL_MILLIS = 30_000;
  private final UserRepository users;
  private final Map<Long, Entry> cache = new ConcurrentHashMap<>();

  private record Entry(boolean active, String role, long at) {}

  /** true nếu user tồn tại, đang hoạt động và vai trò khớp với vai trò trong token. */
  public boolean isValid(UserPrincipal p) {
    long now = System.currentTimeMillis();
    Entry e = cache.get(p.id());
    if (e == null || now - e.at() > TTL_MILLIS) {
      e = users.findById(p.id())
          .map(u -> new Entry(u.isActive(), u.getRole().name(), now))
          .orElse(new Entry(false, "", now));
      cache.put(p.id(), e);
    }
    return e.active() && e.role().equals(p.role().name());
  }

  public void evict(Long userId) {
    cache.remove(userId);
  }
}
