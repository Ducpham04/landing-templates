package vn.leadhub.it;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

class AuthIntegrationTest extends IntegrationTestBase {
  private String loginJson(String email, String pw) {
    return "{\"email\":\"" + email + "\",\"password\":\"" + pw + "\"}";
  }

  @Test
  void loginSuccessReturnsTokensAndUser() throws Exception {
    mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(loginJson("ADMIN@leadhub.vn", "Admin@123")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken").isNotEmpty())
        .andExpect(jsonPath("$.refreshToken").isNotEmpty())
        .andExpect(jsonPath("$.user.role", is("ADMIN")))
        .andExpect(jsonPath("$.user.passwordHash").doesNotExist());
  }

  @Test
  void wrongPasswordAndUnknownEmailGiveSameGeneric401() throws Exception {
    mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(loginJson("admin@leadhub.vn", "sai")))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message", is("Email hoặc mật khẩu không đúng")));
    mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(loginJson("khongco@leadhub.vn", "x")))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message", is("Email hoặc mật khẩu không đúng")));
  }

  @Test
  void lockedAccountIsForbidden() throws Exception {
    mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(loginJson("hoang.pham@leadhub.vn", "Sales@123")))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.error", is("ACCOUNT_LOCKED")));
  }

  @Test
  void refreshRotatesTokenAndOldOneCannotBeReused() throws Exception {
    var res = read(mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(loginJson("admin@leadhub.vn", "Admin@123")))
        .andReturn().getResponse().getContentAsString());
    String rt = res.get("refreshToken").asText();
    String body = "{\"refreshToken\":\"" + rt + "\"}";
    mvc.perform(post("/api/auth/refresh").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isOk());
    mvc.perform(post("/api/auth/refresh").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isUnauthorized());
  }

  @Test
  void logoutRevokesRefreshToken() throws Exception {
    var res = read(mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(loginJson("admin@leadhub.vn", "Admin@123")))
        .andReturn().getResponse().getContentAsString());
    String body = "{\"refreshToken\":\"" + res.get("refreshToken").asText() + "\"}";
    mvc.perform(post("/api/auth/logout").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isNoContent());
    mvc.perform(post("/api/auth/refresh").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isUnauthorized());
  }

  @Test
  void protectedEndpointsRequireValidToken() throws Exception {
    mvc.perform(get("/api/leads")).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.error", is("UNAUTHORIZED")));
    mvc.perform(get("/api/leads").header("Authorization", "Bearer abc.def.ghi")).andExpect(status().isUnauthorized());
    mvc.perform(get("/api/auth/me").header("Authorization", sales())).andExpect(status().isOk()).andExpect(jsonPath("$.role", is("SALES")));
  }

  @Test
  void loginIsRateLimited() throws Exception {
    for (int i = 0; i < 10; i++) {
      mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(loginJson("x@x.vn", "x")));
    }
    mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(loginJson("x@x.vn", "x")))
        .andExpect(status().isTooManyRequests());
  }

  @Test
  void salesCannotManageUsersOrSites() throws Exception {
    String s = sales();
    mvc.perform(get("/api/users").header("Authorization", s)).andExpect(status().isForbidden());
    mvc.perform(post("/api/sites").header("Authorization", s).contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"X\"}"))
        .andExpect(status().isForbidden());
    mvc.perform(get("/api/leads/export").header("Authorization", s)).andExpect(status().isForbidden());
    // SALES đọc được danh sách landing nhưng không thấy siteKey
    mvc.perform(get("/api/sites").header("Authorization", s)).andExpect(status().isOk()).andExpect(jsonPath("$[0].siteKey").doesNotExist());
  }
}
