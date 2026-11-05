package vn.leadhub.lead;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;
import vn.leadhub.common.AppException;
import vn.leadhub.common.Validators;
import vn.leadhub.site.Site;
import vn.leadhub.site.SiteRepository;

/**
 * Nhận lead từ form landing. Body là JSON tự do: các trường chuẩn được tách ra, phần còn lại lưu vào
 * {@code extra}. Chống spam: honeypot "website", giới hạn số trường/độ dài, rate limit ở filter.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PublicLeadService {
  static final int MAX_EXTRA_KEYS = 20;
  static final int MAX_EXTRA_VALUE = 500;
  static final String HONEYPOT = "website";
  private static final Set<String> RESERVED =
      Set.of(
          "name", "fullName", "phone", "email", "message", "page", "pageUrl", "submittedAt", HONEYPOT,
          "utm_source", "utm_medium", "utm_campaign", "siteKey");

  private final SiteRepository sites;
  private final LeadRepository leads;
  private final LeadActivityRepository activities;

  public enum Result { CREATED, IGNORED_SPAM }

  @Transactional
  public Result submit(String siteKey, Map<String, Object> body, String ip) {
    if (siteKey == null || siteKey.isBlank() || siteKey.length() > 64) throw AppException.notFound("landing");
    Site site = sites.findBySiteKey(siteKey.trim()).orElseThrow(() -> AppException.notFound("landing"));
    if (!site.isActive()) {
      throw new AppException(HttpStatus.FORBIDDEN, "SITE_INACTIVE", "Landing này đang tạm ngừng nhận đăng ký");
    }
    Map<String, Object> b = body == null ? Map.of() : body;

    if (!str(b.get(HONEYPOT)).isBlank()) {
      log.info("Honeypot triggered for site {} from {}", site.getId(), ip);
      return Result.IGNORED_SPAM;
    }

    Map<String, String> errors = new LinkedHashMap<>();
    String name = str(b.containsKey("name") ? b.get("name") : b.get("fullName")).trim();
    if (name.isEmpty()) errors.put("name", "Vui lòng nhập họ tên");
    else if (name.length() > 120) errors.put("name", "Họ tên tối đa 120 ký tự");

    String rawPhone = str(b.get("phone"));
    String phone = Validators.normalizePhone(rawPhone);
    if (rawPhone.isBlank()) errors.put("phone", "Vui lòng nhập số điện thoại");
    else if (phone == null) errors.put("phone", "Số điện thoại không hợp lệ (VD: 0912 345 678)");

    String email = str(b.get("email")).trim();
    if (!email.isEmpty() && !Validators.isEmail(email)) errors.put("email", "Email không hợp lệ");

    String message = str(b.get("message")).trim();
    if (message.length() > 2000) errors.put("message", "Lời nhắn tối đa 2000 ký tự");

    Map<String, String> extra = new LinkedHashMap<>();
    for (var e : b.entrySet()) {
      if (RESERVED.contains(e.getKey()) || e.getValue() == null) continue;
      String v = str(e.getValue()).trim();
      if (v.isEmpty()) continue;
      if (extra.size() >= MAX_EXTRA_KEYS) {
        errors.put("extra", "Quá nhiều trường dữ liệu");
        break;
      }
      String key = e.getKey().length() > 50 ? e.getKey().substring(0, 50) : e.getKey();
      extra.put(key, v.length() > MAX_EXTRA_VALUE ? v.substring(0, MAX_EXTRA_VALUE) : v);
    }
    if (!errors.isEmpty()) throw AppException.validation(errors);

    String pageUrl = truncate(str(b.containsKey("page") ? b.get("page") : b.get("pageUrl")).trim(), 500);
    Map<String, String> utm = utmFrom(pageUrl);
    Lead lead =
        Lead.builder()
            .site(site)
            .fullName(name)
            .phone(phone)
            .email(email.isEmpty() ? null : email.toLowerCase())
            .message(message.isEmpty() ? null : message)
            .extra(extra)
            .status(LeadStatus.NEW)
            .pageUrl(pageUrl.isEmpty() ? null : pageUrl)
            .utmSource(truncate(firstNonBlank(str(b.get("utm_source")), utm.get("utm_source")), 100))
            .utmMedium(truncate(firstNonBlank(str(b.get("utm_medium")), utm.get("utm_medium")), 100))
            .utmCampaign(truncate(firstNonBlank(str(b.get("utm_campaign")), utm.get("utm_campaign")), 150))
            .ipAddress(truncate(ip, 45))
            .build();
    leads.save(lead);
    activities.save(LeadActivity.builder().lead(lead).type(ActivityType.CREATED).toValue(site.getName()).build());
    return Result.CREATED;
  }

  private static Map<String, String> utmFrom(String pageUrl) {
    Map<String, String> out = new LinkedHashMap<>();
    if (pageUrl == null || pageUrl.isEmpty()) return out;
    try {
      var params = UriComponentsBuilder.fromUri(URI.create(pageUrl)).build().getQueryParams();
      for (String k : new String[] {"utm_source", "utm_medium", "utm_campaign"}) {
        String v = params.getFirst(k);
        if (v != null) out.put(k, java.net.URLDecoder.decode(v, java.nio.charset.StandardCharsets.UTF_8));
      }
    } catch (IllegalArgumentException ignored) {
      // URL không hợp lệ → bỏ qua UTM
    }
    return out;
  }

  private static String str(Object o) {
    if (o == null) return "";
    if (o instanceof String s) return s;
    if (o instanceof Number || o instanceof Boolean) return String.valueOf(o);
    return String.valueOf(o);
  }

  private static String firstNonBlank(String a, String b) {
    if (a != null && !a.isBlank()) return a.trim();
    return b == null || b.isBlank() ? null : b.trim();
  }

  private static String truncate(String v, int max) {
    if (v == null) return null;
    return v.length() > max ? v.substring(0, max) : v;
  }
}
