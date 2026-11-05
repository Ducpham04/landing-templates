package vn.leadhub.security;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/** Giới hạn tần suất kiểu cửa sổ trượt, lưu trong bộ nhớ (đủ cho 1 instance). */
@Component
public class RateLimiter {
  private final Map<String, Deque<Long>> hits = new ConcurrentHashMap<>();

  public boolean tryAcquire(String key, int limit, long windowMillis) {
    long now = System.currentTimeMillis();
    Deque<Long> q = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
    synchronized (q) {
      while (!q.isEmpty() && now - q.peekFirst() >= windowMillis) q.pollFirst();
      if (q.size() >= limit) return false;
      q.addLast(now);
      return true;
    }
  }

  /** Dọn các key không còn hoạt động để tránh rò rỉ bộ nhớ. */
  @Scheduled(fixedDelay = 300_000)
  public void cleanup() {
    long now = System.currentTimeMillis();
    hits.entrySet().removeIf(e -> {
      synchronized (e.getValue()) {
        Long last = e.getValue().peekLast();
        return last == null || now - last > 600_000;
      }
    });
  }

  public void reset() {
    hits.clear();
  }
}
