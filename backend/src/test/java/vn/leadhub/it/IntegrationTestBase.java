package vn.leadhub.it;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import vn.leadhub.security.RateLimiter;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** MySQL 8.4 thật qua Testcontainers, dùng chung cho mọi test (khởi động 1 lần). */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class IntegrationTestBase {
  @ServiceConnection
  static final MySQLContainer<?> MYSQL = new MySQLContainer<>("mysql:8.4")
      .withCommand("--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci");

  static {
    MYSQL.start();
  }

  @Autowired protected MockMvc mvc;
  @Autowired protected ObjectMapper json;
  @Autowired protected RateLimiter rateLimiter;

  @BeforeEach
  void resetRateLimit() {
    rateLimiter.reset();
  }

  protected String login(String email, String password) throws Exception {
    String body = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    return "Bearer " + json.readTree(body).get("accessToken").asText();
  }

  protected String admin() throws Exception {
    return login("admin@leadhub.vn", "Admin@123");
  }

  protected String sales() throws Exception {
    return login("minh.tran@leadhub.vn", "Sales@123");
  }

  protected JsonNode read(String s) throws Exception {
    return json.readTree(s);
  }
}
