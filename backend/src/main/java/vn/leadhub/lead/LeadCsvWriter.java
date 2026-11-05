package vn.leadhub.lead;

import java.io.IOException;
import java.io.Writer;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** Xuất CSV UTF-8 (có BOM để Excel đọc đúng tiếng Việt), chống CSV/formula injection. */
public final class LeadCsvWriter {
  private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(LeadSpecifications.VN);

  private LeadCsvWriter() {}

  public static void write(List<Lead> rows, Writer w) throws IOException {
    w.write('﻿');
    line(w, "ID", "Thời gian", "Họ tên", "SĐT", "Email", "Landing", "Trạng thái", "Phụ trách", "Lời nhắn", "Thông tin thêm",
        "UTM source", "UTM medium", "UTM campaign", "Trang gửi");
    for (Lead l : rows) {
      line(w,
          String.valueOf(l.getId()),
          FMT.format(l.getCreatedAt()),
          l.getFullName(),
          l.getPhone(),
          l.getEmail(),
          l.getSite().getName(),
          l.getStatus().label(),
          l.getAssignee() == null ? "" : l.getAssignee().getFullName(),
          l.getMessage(),
          extra(l.getExtra()),
          l.getUtmSource(),
          l.getUtmMedium(),
          l.getUtmCampaign(),
          l.getPageUrl());
    }
    w.flush();
  }

  private static String extra(Map<String, String> m) {
    if (m == null || m.isEmpty()) return "";
    return m.entrySet().stream().map(e -> e.getKey() + ": " + e.getValue()).collect(Collectors.joining("; "));
  }

  private static void line(Writer w, String... cells) throws IOException {
    for (int i = 0; i < cells.length; i++) {
      if (i > 0) w.write(',');
      w.write(escape(cells[i]));
    }
    w.write("\r\n");
  }

  static String escape(String v) {
    if (v == null) return "";
    String s = v;
    if (!s.isEmpty() && "=+-@\t\r".indexOf(s.charAt(0)) >= 0) s = "'" + s; // chống formula injection
    if (s.contains(",") || s.contains("\"") || s.contains("\n") || s.contains("\r")) {
      s = "\"" + s.replace("\"", "\"\"") + "\"";
    }
    return s;
  }
}
