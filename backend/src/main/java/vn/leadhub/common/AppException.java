package vn.leadhub.common;

import java.util.Map;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/** Exception nghiệp vụ mang sẵn HTTP status, mã lỗi và thông báo tiếng Việt. */
@Getter
public class AppException extends RuntimeException {
  private final HttpStatus status;
  private final String code;
  private final transient Map<String, String> fieldErrors;

  public AppException(HttpStatus status, String code, String message) {
    this(status, code, message, null);
  }

  public AppException(HttpStatus status, String code, String message, Map<String, String> fieldErrors) {
    super(message);
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }

  public static AppException notFound(String what) {
    return new AppException(HttpStatus.NOT_FOUND, "NOT_FOUND", "Không tìm thấy " + what);
  }

  public static AppException forbidden(String message) {
    return new AppException(HttpStatus.FORBIDDEN, "FORBIDDEN", message);
  }

  public static AppException badRequest(String code, String message) {
    return new AppException(HttpStatus.BAD_REQUEST, code, message);
  }

  public static AppException conflict(String code, String message) {
    return new AppException(HttpStatus.CONFLICT, code, message);
  }

  public static AppException unauthorized(String message) {
    return new AppException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", message);
  }

  public static AppException validation(Map<String, String> fieldErrors) {
    return new AppException(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Dữ liệu không hợp lệ", fieldErrors);
  }
}
