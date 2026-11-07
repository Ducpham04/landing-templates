package vn.leadhub.unit;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.StringWriter;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import vn.leadhub.lead.Lead;
import vn.leadhub.lead.LeadCsvWriter;
import vn.leadhub.lead.LeadStatus;
import vn.leadhub.site.Site;

class LeadCsvWriterTest {
  @Test
  void writesBomHeaderAndEscapesInjection() throws Exception {
    Lead l = Lead.builder().id(1L).site(Site.builder().name("Nova").build()).fullName("=HYPERLINK(\"x\")")
        .phone("0912345678").message("Xin chào, \"bảng giá\"\nnhé").extra(Map.of("course", "IELTS"))
        .status(LeadStatus.WON).createdAt(Instant.parse("2026-11-05T03:00:00Z")).build();
    StringWriter w = new StringWriter();
    LeadCsvWriter.write(List.of(l), w);
    String csv = w.toString();
    assertThat(csv).startsWith("﻿ID,Thời gian,Họ tên");
    assertThat(csv).contains("05/11/2026 10:00"); // giờ Việt Nam
    assertThat(csv).contains("\"'=HYPERLINK(\"\"x\"\")\""); // tiền tố ' chống formula injection
    assertThat(csv).contains("\"Xin chào, \"\"bảng giá\"\"\nnhé\"");
    assertThat(csv).contains("Đã chốt").contains("course: IELTS");
  }
}
