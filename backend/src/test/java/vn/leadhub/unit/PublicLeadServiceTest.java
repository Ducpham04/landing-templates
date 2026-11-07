package vn.leadhub.unit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import vn.leadhub.common.AppException;
import vn.leadhub.lead.*;
import vn.leadhub.site.Site;
import vn.leadhub.site.SiteRepository;

@ExtendWith(MockitoExtension.class)
class PublicLeadServiceTest {
  @Mock SiteRepository sites;
  @Mock LeadRepository leads;
  @Mock LeadActivityRepository activities;
  @InjectMocks PublicLeadService service;

  private final Site site = Site.builder().id(1L).name("Nova").siteKey("site_ok").active(true).build();

  @BeforeEach
  void setUp() {
    lenient().when(sites.findBySiteKey("site_ok")).thenReturn(Optional.of(site));
  }

  @Test
  void savesValidLeadWithExtraAndUtmFromPage() {
    Map<String, Object> body = new HashMap<>();
    body.put("name", "  Nguyễn Văn A ");
    body.put("phone", "+84 912 345 678");
    body.put("email", "A@Mail.VN");
    body.put("course", "IELTS");
    body.put("budget", 300);
    body.put("page", "https://nova.vn/?utm_source=facebook&utm_campaign=t12");

    assertThat(service.submit("site_ok", body, "1.2.3.4")).isEqualTo(PublicLeadService.Result.CREATED);

    ArgumentCaptor<Lead> c = ArgumentCaptor.forClass(Lead.class);
    verify(leads).save(c.capture());
    Lead l = c.getValue();
    assertThat(l.getFullName()).isEqualTo("Nguyễn Văn A");
    assertThat(l.getPhone()).isEqualTo("0912345678");
    assertThat(l.getEmail()).isEqualTo("a@mail.vn");
    assertThat(l.getExtra()).containsEntry("course", "IELTS").containsEntry("budget", "300").doesNotContainKey("page");
    assertThat(l.getUtmSource()).isEqualTo("facebook");
    assertThat(l.getUtmCampaign()).isEqualTo("t12");
    assertThat(l.getStatus()).isEqualTo(LeadStatus.NEW);
    verify(activities).save(any(LeadActivity.class));
  }

  @Test
  void honeypotIsSilentlyIgnored() {
    var r = service.submit("site_ok", Map.of("name", "Bot", "phone", "0912345678", "website", "http://spam"), "1.1.1.1");
    assertThat(r).isEqualTo(PublicLeadService.Result.IGNORED_SPAM);
    verifyNoInteractions(leads);
  }

  @Test
  void returnsFieldErrorsInVietnamese() {
    assertThatThrownBy(() -> service.submit("site_ok", Map.of("phone", "123", "email", "x"), "ip"))
        .isInstanceOfSatisfying(AppException.class, e -> {
          assertThat(e.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
          assertThat(e.getFieldErrors()).containsKeys("name", "phone", "email");
          assertThat(e.getFieldErrors().get("name")).isEqualTo("Vui lòng nhập họ tên");
        });
    verifyNoInteractions(leads);
  }

  @Test
  void unknownOrInactiveSiteIsRejected() {
    when(sites.findBySiteKey("nope")).thenReturn(Optional.empty());
    assertThatThrownBy(() -> service.submit("nope", Map.of(), "ip"))
        .isInstanceOfSatisfying(AppException.class, e -> assertThat(e.getStatus()).isEqualTo(HttpStatus.NOT_FOUND));

    site.setActive(false);
    assertThatThrownBy(() -> service.submit("site_ok", Map.of("name", "A", "phone", "0912345678"), "ip"))
        .isInstanceOfSatisfying(AppException.class, e -> assertThat(e.getStatus()).isEqualTo(HttpStatus.FORBIDDEN));
  }

  @Test
  void limitsExtraFieldsAndTruncatesLongValues() {
    Map<String, Object> body = new HashMap<>(Map.of("name", "A", "phone", "0912345678", "note", "x".repeat(900)));
    service.submit("site_ok", body, "ip");
    ArgumentCaptor<Lead> c = ArgumentCaptor.forClass(Lead.class);
    verify(leads).save(c.capture());
    assertThat(c.getValue().getExtra().get("note")).hasSize(500);

    Map<String, Object> many = new HashMap<>(Map.of("name", "A", "phone", "0912345678"));
    for (int i = 0; i < 25; i++) many.put("f" + i, "v");
    assertThatThrownBy(() -> service.submit("site_ok", many, "ip")).isInstanceOf(AppException.class);
  }
}
