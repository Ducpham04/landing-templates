package vn.leadhub.config;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vn.leadhub.lead.*;
import vn.leadhub.site.Site;
import vn.leadhub.site.SiteRepository;
import vn.leadhub.user.Role;
import vn.leadhub.user.User;
import vn.leadhub.user.UserRepository;

/**
 * Dữ liệu demo tiếng Việt. Chỉ chạy khi APP_SEED_DEMO=true và DB chưa có người dùng.
 * Site key cố định để 3 landing demo gửi lead được ngay.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DemoDataSeeder implements ApplicationRunner {
  public static final String KEY_REAL_ESTATE = "site_aurelia_demo_2026";
  public static final String KEY_INTERIOR = "site_atelier_demo_2026";
  public static final String KEY_EDUCATION = "site_nova_demo_2026";

  private final AppProperties props;
  private final UserRepository users;
  private final SiteRepository sites;
  private final LeadRepository leads;
  private final LeadNoteRepository notes;
  private final LeadActivityRepository activities;
  private final PasswordEncoder encoder;
  private final JdbcTemplate jdbc;

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    if (!props.seed().demo() || users.count() > 0) return;
    log.info("Seeding demo data...");
    Random rnd = new Random(2026);

    User admin = users.save(user("admin@leadhub.vn", "Admin@123", "Nguyễn Thị Lan", Role.ADMIN, true));
    User minh = users.save(user("minh.tran@leadhub.vn", "Sales@123", "Trần Quang Minh", Role.SALES, true));
    User thu = users.save(user("thu.le@leadhub.vn", "Sales@123", "Lê Hoài Thu", Role.SALES, true));
    users.save(user("hoang.pham@leadhub.vn", "Sales@123", "Phạm Văn Hoàng", Role.SALES, false));
    List<User> sales = List.of(minh, thu);

    Site re = sites.save(Site.builder().name("The Aurelia Residences").domain("aurelia-demo.example.com").siteKey(KEY_REAL_ESTATE).active(true).build());
    Site in = sites.save(Site.builder().name("Atelier Mộc").domain("atelier-moc-demo.example.com").siteKey(KEY_INTERIOR).active(true).build());
    Site ed = sites.save(Site.builder().name("Nova Academy").domain("nova-academy-demo.example.com").siteKey(KEY_EDUCATION).active(true).build());

    String[] ho = {"Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương"};
    String[] dem = {"Văn", "Thị", "Minh", "Thu", "Quốc", "Ngọc", "Hoài", "Đức", "Thanh", "Gia", "Bảo", "Khánh"};
    String[] ten = {"An", "Bình", "Châu", "Dũng", "Giang", "Hà", "Hải", "Hạnh", "Hiếu", "Hùng", "Khoa", "Linh", "Long", "Mai", "Nam", "Nga", "Phúc", "Quân", "Sơn", "Tâm", "Thảo", "Trang", "Tuấn", "Vy", "Yến"};
    String[] prefixes = {"090", "091", "093", "094", "097", "098", "086", "088", "070", "077", "081", "083", "035", "036", "039"};
    String[] utm = {"facebook", "google", "zalo", "tiktok", null};

    Object[][] siteCfg = {
      {re, new String[] {"Căn 2 phòng ngủ", "Căn 3 phòng ngủ", "Duplex", "Penthouse"}, "interest",
          new String[] {"Cho tôi xin bảng giá và tiến độ thanh toán.", "Tôi muốn đi xem nhà mẫu cuối tuần.", "Căn góc tầng cao còn không?", ""}},
      {in, new String[] {"Căn hộ", "Nhà phố", "Biệt thự"}, "type",
          new String[] {"Căn hộ 90m² cần thiết kế phong cách Japandi.", "Nhà phố 4 tầng, muốn báo giá trọn gói.", "Cải tạo phòng khách và bếp.", ""}},
      {ed, new String[] {"Kids English", "Teen Communication", "IELTS Intensive", "Business English"}, "course",
          new String[] {"Con tôi 8 tuổi, muốn học thử cuối tuần.", "Mục tiêu IELTS 6.5 trong 6 tháng.", "Lớp buổi tối cho người đi làm.", ""}},
    };
    String[] noteSamples = {
      "Đã gọi, khách hẹn gọi lại sau 17h.", "Khách quan tâm, đã gửi tài liệu qua Zalo.", "Không nghe máy lần 1.",
      "Đặt lịch gặp tư vấn thứ Bảy 9h.", "Khách đang so sánh với bên khác, cần ưu đãi.", "Đã chốt, chuyển kế toán làm hợp đồng."
    };

    Instant now = Instant.now();
    for (int i = 0; i < 64; i++) {
      Object[] cfg = siteCfg[i % 3];
      Site site = (Site) cfg[0];
      String[] options = (String[]) cfg[1];
      String[] msgs = (String[]) cfg[3];
      String name = ho[rnd.nextInt(ho.length)] + " " + dem[rnd.nextInt(dem.length)] + " " + ten[rnd.nextInt(ten.length)];
      String phone = prefixes[rnd.nextInt(prefixes.length)] + String.format("%07d", rnd.nextInt(10_000_000));
      Instant created = now.minus(rnd.nextInt(14 * 24 * 60), ChronoUnit.MINUTES);
      int age = (int) ChronoUnit.HOURS.between(created, now);

      LeadStatus status;
      int r = rnd.nextInt(100);
      if (age < 12) status = r < 75 ? LeadStatus.NEW : LeadStatus.CONTACTED;
      else status = r < 15 ? LeadStatus.NEW : r < 45 ? LeadStatus.CONTACTED : r < 65 ? LeadStatus.QUALIFIED : r < 82 ? LeadStatus.WON : LeadStatus.LOST;
      User assignee = status == LeadStatus.NEW && rnd.nextBoolean() ? null : sales.get(rnd.nextInt(sales.size()));
      String source = utm[rnd.nextInt(utm.length)];

      Map<String, String> extra = new LinkedHashMap<>();
      extra.put((String) cfg[2], options[rnd.nextInt(options.length)]);
      Lead lead = leads.save(Lead.builder()
          .site(site).fullName(name).phone(phone)
          .email(rnd.nextInt(3) == 0 ? null : slug(name) + rnd.nextInt(99) + "@gmail.com")
          .message(emptyToNull(msgs[rnd.nextInt(msgs.length)]))
          .extra(extra).status(status).assignee(assignee)
          .pageUrl("https://" + site.getDomain() + "/" + (source == null ? "" : "?utm_source=" + source + "&utm_medium=cpc"))
          .utmSource(source).utmMedium(source == null ? null : "cpc").ipAddress("127.0.0.1")
          .build());
      activities.save(LeadActivity.builder().lead(lead).type(ActivityType.CREATED).toValue(site.getName()).build());
      if (assignee != null) {
        activities.save(LeadActivity.builder().lead(lead).actor(admin).type(ActivityType.ASSIGNED).toValue(assignee.getFullName()).build());
      }
      if (status != LeadStatus.NEW && assignee != null) {
        activities.save(LeadActivity.builder().lead(lead).actor(assignee).type(ActivityType.STATUS_CHANGED).fromValue("NEW").toValue(status.name()).build());
        notes.save(LeadNote.builder().lead(lead).author(assignee).content(noteSamples[rnd.nextInt(noteSamples.length)]).build());
      }
      // Đặt lại thời gian tạo để dữ liệu rải đều 14 ngày (bỏ qua @CreationTimestamp)
      jdbc.update("update leads set created_at = ?, updated_at = ? where id = ?", java.sql.Timestamp.from(created), java.sql.Timestamp.from(created), lead.getId());
      jdbc.update("update lead_activities set created_at = ? where lead_id = ?", java.sql.Timestamp.from(created), lead.getId());
      jdbc.update("update lead_notes set created_at = ? where lead_id = ?", java.sql.Timestamp.from(created.plus(2, ChronoUnit.HOURS)), lead.getId());
    }
    log.info("Demo data seeded: 4 users, 3 sites, 64 leads");
  }

  private User user(String email, String pw, String name, Role role, boolean active) {
    return User.builder().email(email).passwordHash(encoder.encode(pw)).fullName(name).role(role).active(active).build();
  }

  private static String slug(String name) {
    String n = java.text.Normalizer.normalize(name, java.text.Normalizer.Form.NFD).replaceAll("\\p{M}", "").replace("đ", "d").replace("Đ", "D");
    return n.toLowerCase().replaceAll("[^a-z]", "");
  }

  private static String emptyToNull(String s) {
    return s == null || s.isEmpty() ? null : s;
  }
}
