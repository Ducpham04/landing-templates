package vn.leadhub.dashboard;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.leadhub.lead.LeadRepository;
import vn.leadhub.lead.LeadSpecifications;
import vn.leadhub.lead.LeadStatus;
import vn.leadhub.security.CurrentUser;
import vn.leadhub.security.UserPrincipal;

@Tag(name = "Dashboard")
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
  static final int DAYS = 14;
  private final LeadRepository leads;

  public record SiteCount(Long siteId, String siteName, long count) {}

  public record DayCount(LocalDate date, long count) {}

  public record Stats(
      long total,
      long newToday,
      long inProgress,
      long won,
      double conversionRate,
      Map<LeadStatus, Long> byStatus,
      List<SiteCount> bySite,
      List<DayCount> daily) {}

  @GetMapping("/stats")
  @Transactional(readOnly = true)
  public Stats stats() {
    UserPrincipal me = CurrentUser.get();
    Long scope = me.isAdmin() ? null : me.id();

    Map<LeadStatus, Long> byStatus = new EnumMap<>(LeadStatus.class);
    for (LeadStatus s : LeadStatus.values()) byStatus.put(s, 0L);
    for (Object[] r : leads.countByStatus(scope)) byStatus.put((LeadStatus) r[0], (Long) r[1]);
    long total = byStatus.values().stream().mapToLong(Long::longValue).sum();
    long won = byStatus.get(LeadStatus.WON);
    long inProgress = byStatus.get(LeadStatus.CONTACTED) + byStatus.get(LeadStatus.QUALIFIED);

    List<SiteCount> bySite =
        leads.countBySite(scope).stream().map(r -> new SiteCount((Long) r[0], (String) r[1], (Long) r[2])).toList();

    LocalDate today = LocalDate.now(LeadSpecifications.VN);
    LocalDate start = today.minusDays(DAYS - 1L);
    Instant from = start.atStartOfDay(LeadSpecifications.VN).toInstant();
    Map<LocalDate, Long> perDay = new TreeMap<>();
    for (int i = 0; i < DAYS; i++) perDay.put(start.plusDays(i), 0L);
    for (Instant t : leads.createdTimesSince(from, scope)) {
      perDay.merge(t.atZone(LeadSpecifications.VN).toLocalDate(), 1L, Long::sum);
    }
    List<DayCount> daily = perDay.entrySet().stream().map(e -> new DayCount(e.getKey(), e.getValue())).toList();
    long newToday = perDay.getOrDefault(today, 0L);
    double rate = total == 0 ? 0 : Math.round(won * 1000.0 / total) / 10.0;

    return new Stats(total, newToday, inProgress, won, rate, byStatus, bySite, daily);
  }
}
