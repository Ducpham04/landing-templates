package vn.leadhub.common;

import java.util.regex.Pattern;

/** Các quy tắc kiểm tra dùng chung. */
public final class Validators {
  /** SĐT di động Việt Nam: 0 hoặc +84/84, đầu số 3/5/7/8/9, tổng 10 số. */
  public static final String VN_PHONE_REGEX = "^(\\+?84|0)(3|5|7|8|9)\\d{8}$";
  private static final Pattern VN_PHONE = Pattern.compile(VN_PHONE_REGEX);
  private static final Pattern EMAIL = Pattern.compile("^[^\\s@]{1,64}@[^\\s@]{1,185}\\.[^\\s@]{2,}$");

  private Validators() {}

  /** Bỏ khoảng trắng, dấu chấm, gạch; trả về dạng 0xxxxxxxxx. */
  public static String normalizePhone(String raw) {
    if (raw == null) return null;
    String p = raw.replaceAll("[\\s.\\-()]", "");
    if (!VN_PHONE.matcher(p).matches()) return null;
    if (p.startsWith("+84")) return "0" + p.substring(3);
    if (p.startsWith("84")) return "0" + p.substring(2);
    return p;
  }

  public static boolean isEmail(String v) {
    return v != null && v.length() <= 190 && EMAIL.matcher(v).matches();
  }

  /** Escape ký tự đại diện của LIKE để tìm kiếm an toàn. */
  public static String escapeLike(String q) {
    return q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
  }
}
