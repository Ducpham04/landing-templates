package vn.leadhub.unit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import vn.leadhub.common.AppException;
import vn.leadhub.lead.*;
import vn.leadhub.lead.LeadDtos.UpdateLeadRequest;
import vn.leadhub.security.UserPrincipal;
import vn.leadhub.site.Site;
import vn.leadhub.user.Role;
import vn.leadhub.user.User;
import vn.leadhub.user.UserRepository;

@ExtendWith(MockitoExtension.class)
class LeadServiceTest {
  @Mock LeadRepository leads;
  @Mock LeadNoteRepository notes;
  @Mock LeadActivityRepository activities;
  @Mock UserRepository users;
  @Spy LeadMapper mapper = new LeadMapperImpl();
  @InjectMocks LeadService service;

  private final UserPrincipal sales = new UserPrincipal(2L, "s@x.vn", Role.SALES);
  private final UserPrincipal admin = new UserPrincipal(1L, "a@x.vn", Role.ADMIN);
  private final User salesUser = User.builder().id(2L).fullName("Minh").role(Role.SALES).active(true).build();

  @SuppressWarnings("unchecked")
  private Lead stubLead(User assignee) {
    Lead lead = Lead.builder().id(10L).site(Site.builder().id(1L).name("S").build()).fullName("K").phone("0912345678")
        .status(LeadStatus.NEW).assignee(assignee).build();
    when(leads.findAll(any(Specification.class))).thenReturn(List.of(lead));
    return lead;
  }

  @Test
  void salesCannotAssignToOthers() {
    stubLead(null);
    assertThatThrownBy(() -> service.update(10L, new UpdateLeadRequest(null, 3L, null), sales))
        .isInstanceOfSatisfying(AppException.class, e -> assertThat(e.getStatus()).isEqualTo(HttpStatus.FORBIDDEN));
  }

  @Test
  void salesChangingStatusOfUnassignedLeadAutoClaimsIt() {
    Lead lead = stubLead(null);
    when(users.getReferenceById(2L)).thenReturn(salesUser);
    when(users.findById(2L)).thenReturn(java.util.Optional.of(salesUser));
    var dto = service.update(10L, new UpdateLeadRequest(LeadStatus.CONTACTED, null, null), sales);
    assertThat(dto.status()).isEqualTo(LeadStatus.CONTACTED);
    assertThat(lead.getAssignee()).isEqualTo(salesUser);
    verify(activities, times(2)).save(any(LeadActivity.class)); // ASSIGNED + STATUS_CHANGED
  }

  @Test
  void claimFailsWhenAssignedToSomeoneElse() {
    stubLead(User.builder().id(9L).fullName("Khác").build());
    assertThatThrownBy(() -> service.claim(10L, sales))
        .isInstanceOfSatisfying(AppException.class, e -> assertThat(e.getStatus()).isEqualTo(HttpStatus.CONFLICT));
  }

  @Test
  void adminCannotAssignInactiveUser() {
    stubLead(null);
    when(users.getReferenceById(1L)).thenReturn(User.builder().id(1L).build());
    when(users.findById(5L)).thenReturn(java.util.Optional.of(User.builder().id(5L).active(false).build()));
    assertThatThrownBy(() -> service.update(10L, new UpdateLeadRequest(null, 5L, null), admin))
        .isInstanceOfSatisfying(AppException.class, e -> assertThat(e.getCode()).isEqualTo("INVALID_ASSIGNEE"));
  }

  @Test
  @SuppressWarnings("unchecked")
  void leadOutsideScopeIsNotFound() {
    when(leads.findAll(any(Specification.class))).thenReturn(List.of());
    assertThatThrownBy(() -> service.get(99L, sales))
        .isInstanceOfSatisfying(AppException.class, e -> assertThat(e.getStatus()).isEqualTo(HttpStatus.NOT_FOUND));
  }
}
