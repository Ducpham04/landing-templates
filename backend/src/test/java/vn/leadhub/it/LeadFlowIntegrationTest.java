package vn.leadhub.it;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import vn.leadhub.config.DemoDataSeeder;

/** Luồng chính: landing gửi lead → admin thấy → sales nhận, xử lý, ghi chú → lịch sử. */
class LeadFlowIntegrationTest extends IntegrationTestBase {

  private long submitLead(String name, String phone) throws Exception {
    mvc.perform(post("/api/public/leads").param("siteKey", DemoDataSeeder.KEY_EDUCATION)
            .header("Origin", "https://nova.example.com")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"" + name + "\",\"phone\":\"" + phone + "\",\"email\":\"hv@gmail.com\",\"course\":\"IELTS Intensive\","
                + "\"page\":\"https://nova.example.com/?utm_source=zalo&utm_campaign=khai-giang\"}"))
        .andExpect(status().isCreated())
        .andExpect(header().string("Access-Control-Allow-Origin", "https://nova.example.com"))
        .andExpect(jsonPath("$.success", is(true)));
    var page = read(mvc.perform(get("/api/leads").param("q", phone).header("Authorization", admin()))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
    assertThat(page.get("totalElements").asLong()).isEqualTo(1);
    return page.get("content").get(0).get("id").asLong();
  }

  @Test
  void fullLeadLifecycle() throws Exception {
    long id = submitLead("Phạm Thu Trang", "0987 111 222");
    String s = sales();

    mvc.perform(get("/api/leads/{id}", id).header("Authorization", s))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status", is("NEW")))
        .andExpect(jsonPath("$.phone", is("0987111222")))
        .andExpect(jsonPath("$.extra.course", is("IELTS Intensive")))
        .andExpect(jsonPath("$.utmSource", is("zalo")))
        .andExpect(jsonPath("$.utmCampaign", is("khai-giang")))
        .andExpect(jsonPath("$.assigneeId").doesNotExist());

    mvc.perform(post("/api/leads/{id}/claim", id).header("Authorization", s))
        .andExpect(status().isOk()).andExpect(jsonPath("$.assigneeName", is("Trần Quang Minh")));

    mvc.perform(patch("/api/leads/{id}", id).header("Authorization", s).contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"CONTACTED\"}"))
        .andExpect(status().isOk()).andExpect(jsonPath("$.status", is("CONTACTED")));

    mvc.perform(post("/api/leads/{id}/notes", id).header("Authorization", s).contentType(MediaType.APPLICATION_JSON)
            .content("{\"content\":\"Đã gọi, hẹn test trình độ thứ Bảy\"}"))
        .andExpect(status().isCreated()).andExpect(jsonPath("$.authorName", is("Trần Quang Minh")));

    mvc.perform(get("/api/leads/{id}/notes", id).header("Authorization", s))
        .andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(1)));

    mvc.perform(get("/api/leads/{id}/activities", id).header("Authorization", s))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[*].type", containsInAnyOrder("CREATED", "ASSIGNED", "STATUS_CHANGED", "NOTE_ADDED")));

    // Lọc theo trạng thái + người phụ trách
    mvc.perform(get("/api/leads").param("status", "CONTACTED").param("q", "Thu Trang").header("Authorization", admin()))
        .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].id", is((int) id)));
  }

  @Test
  void salesCannotSeeLeadAssignedToSomeoneElse() throws Exception {
    long id = submitLead("Lê Văn Bảo", "0911 222 333");
    String other = login("thu.le@leadhub.vn", "Sales@123");
    mvc.perform(post("/api/leads/{id}/claim", id).header("Authorization", other)).andExpect(status().isOk());

    String s = sales();
    mvc.perform(get("/api/leads/{id}", id).header("Authorization", s)).andExpect(status().isNotFound());
    mvc.perform(patch("/api/leads/{id}", id).header("Authorization", s).contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"WON\"}"))
        .andExpect(status().isNotFound());
    mvc.perform(get("/api/leads").param("q", "0911222333").header("Authorization", s))
        .andExpect(status().isOk()).andExpect(jsonPath("$.totalElements", is(0)));
  }

  @Test
  void adminAssignsAndUnassigns() throws Exception {
    long id = submitLead("Hồ Minh Khang", "0933 444 555");
    String a = admin();
    var users = read(mvc.perform(get("/api/users/assignees").header("Authorization", a)).andReturn().getResponse().getContentAsString());
    long thuId = 0;
    for (var u : users) if (u.get("fullName").asText().equals("Lê Hoài Thu")) thuId = u.get("id").asLong();

    mvc.perform(patch("/api/leads/{id}", id).header("Authorization", a).contentType(MediaType.APPLICATION_JSON).content("{\"assigneeId\":" + thuId + "}"))
        .andExpect(status().isOk()).andExpect(jsonPath("$.assigneeName", is("Lê Hoài Thu")));
    mvc.perform(patch("/api/leads/{id}", id).header("Authorization", a).contentType(MediaType.APPLICATION_JSON).content("{\"unassign\":true}"))
        .andExpect(status().isOk()).andExpect(jsonPath("$.assigneeId").doesNotExist());
    mvc.perform(patch("/api/leads/{id}", id).header("Authorization", sales()).contentType(MediaType.APPLICATION_JSON).content("{\"assigneeId\":" + thuId + "}"))
        .andExpect(status().isForbidden());
  }

  @Test
  void publicEndpointValidatesAndProtects() throws Exception {
    mvc.perform(post("/api/public/leads").param("siteKey", DemoDataSeeder.KEY_EDUCATION).contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"\",\"phone\":\"12345\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.fieldErrors.name", is("Vui lòng nhập họ tên")))
        .andExpect(jsonPath("$.fieldErrors.phone", startsWith("Số điện thoại không hợp lệ")));

    mvc.perform(post("/api/public/leads").param("siteKey", "site_khong_ton_tai").contentType(MediaType.APPLICATION_JSON).content("{}"))
        .andExpect(status().isNotFound());

    // Honeypot: phản hồi thành công nhưng không lưu
    mvc.perform(post("/api/public/leads").param("siteKey", DemoDataSeeder.KEY_EDUCATION).contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"Spam Bot\",\"phone\":\"0912000111\",\"website\":\"http://spam\"}"))
        .andExpect(status().isCreated());
    mvc.perform(get("/api/leads").param("q", "0912000111").header("Authorization", admin()))
        .andExpect(jsonPath("$.totalElements", is(0)));

    // Payload quá lớn
    mvc.perform(post("/api/public/leads").param("siteKey", DemoDataSeeder.KEY_EDUCATION).contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"A\",\"phone\":\"0912000111\",\"message\":\"" + "x".repeat(20_000) + "\"}"))
        .andExpect(status().isPayloadTooLarge());

    // SQL injection trong tìm kiếm chỉ là chuỗi thường
    mvc.perform(get("/api/leads").param("q", "' OR 1=1 --").header("Authorization", admin()))
        .andExpect(status().isOk()).andExpect(jsonPath("$.totalElements", is(0)));
  }

  @Test
  void publicEndpointIsRateLimited() throws Exception {
    for (int i = 0; i < 10; i++) {
      mvc.perform(post("/api/public/leads").param("siteKey", "x").contentType(MediaType.APPLICATION_JSON).content("{}"));
    }
    mvc.perform(post("/api/public/leads").param("siteKey", "x").contentType(MediaType.APPLICATION_JSON).content("{}"))
        .andExpect(status().isTooManyRequests());
  }

  @Test
  void dashboardAndExport() throws Exception {
    String a = admin();
    mvc.perform(get("/api/dashboard/stats").header("Authorization", a))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.total", greaterThanOrEqualTo(64)))
        .andExpect(jsonPath("$.daily", hasSize(14)))
        .andExpect(jsonPath("$.bySite", hasSize(3)));
    var salesStats = read(mvc.perform(get("/api/dashboard/stats").header("Authorization", sales())).andReturn().getResponse().getContentAsString());
    var adminStats = read(mvc.perform(get("/api/dashboard/stats").header("Authorization", a)).andReturn().getResponse().getContentAsString());
    assertThat(salesStats.get("total").asLong()).isLessThan(adminStats.get("total").asLong());

    String csv = mvc.perform(get("/api/leads/export").param("status", "WON").header("Authorization", a))
        .andExpect(status().isOk())
        .andExpect(header().string("Content-Disposition", startsWith("attachment; filename=\"leads-")))
        .andReturn().getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8);
    assertThat(csv).startsWith("﻿ID,Thời gian,Họ tên");
    assertThat(csv.lines().skip(1)).allMatch(l -> l.contains("Đã chốt"));
  }

  @Test
  void adminManagesSitesAndUsers() throws Exception {
    String a = admin();
    var site = read(mvc.perform(post("/api/sites").header("Authorization", a).contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"Dự án Sunrise\",\"domain\":\"sunrise.vn\"}"))
        .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString());
    String key = site.get("siteKey").asText();
    assertThat(key).startsWith("site_").hasSize(29);

    var regen = read(mvc.perform(post("/api/sites/{id}/regenerate-key", site.get("id").asLong()).header("Authorization", a))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
    assertThat(regen.get("siteKey").asText()).isNotEqualTo(key);
    mvc.perform(post("/api/public/leads").param("siteKey", key).contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"A\",\"phone\":\"0912345678\"}"))
        .andExpect(status().isNotFound());

    // Sửa landing trả đúng số lead hiện có
    long novaId = read(mvc.perform(get("/api/sites").header("Authorization", a)).andReturn().getResponse().getContentAsString())
        .findValues("id").stream().map(n -> n.asLong()).filter(i -> i == 3L).findFirst().orElseThrow();
    mvc.perform(put("/api/sites/{id}", novaId).header("Authorization", a).contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"Nova Academy\",\"domain\":\"nova-academy-demo.example.com\",\"active\":true}"))
        .andExpect(status().isOk()).andExpect(jsonPath("$.leadCount", greaterThan(0)));

    mvc.perform(post("/api/sites").header("Authorization", a).contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"\",\"domain\":\"bad domain!\"}"))
        .andExpect(status().isBadRequest()).andExpect(jsonPath("$.fieldErrors.name").exists()).andExpect(jsonPath("$.fieldErrors.domain").exists());

    mvc.perform(post("/api/users").header("Authorization", a).contentType(MediaType.APPLICATION_JSON)
            .content("{\"fullName\":\"Vũ Thị Hoa\",\"email\":\"hoa.vu@leadhub.vn\",\"role\":\"SALES\",\"password\":\"Matkhau@1\"}"))
        .andExpect(status().isCreated()).andExpect(jsonPath("$.active", is(true)));
    mvc.perform(post("/api/users").header("Authorization", a).contentType(MediaType.APPLICATION_JSON)
            .content("{\"fullName\":\"Trùng\",\"email\":\"HOA.VU@leadhub.vn\",\"role\":\"SALES\",\"password\":\"Matkhau@1\"}"))
        .andExpect(status().isConflict()).andExpect(jsonPath("$.error", is("EMAIL_EXISTS")));
    login("hoa.vu@leadhub.vn", "Matkhau@1");

    // Không tự khoá chính mình
    var me = read(mvc.perform(get("/api/auth/me").header("Authorization", a)).andReturn().getResponse().getContentAsString());
    mvc.perform(put("/api/users/{id}", me.get("id").asLong()).header("Authorization", a).contentType(MediaType.APPLICATION_JSON)
            .content("{\"fullName\":\"Lan\",\"role\":\"ADMIN\",\"active\":false}"))
        .andExpect(status().isBadRequest());
  }
}
