package vn.leadhub.common;

import java.time.Instant;
import java.util.Map;

/** Định dạng lỗi thống nhất cho mọi API. */
public record ApiError(int status, String error, String message, Map<String, String> fieldErrors, Instant timestamp) {
  public static ApiError of(int status, String error, String message) {
    return new ApiError(status, error, message, null, Instant.now());
  }
}
