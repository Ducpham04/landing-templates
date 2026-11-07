package vn.leadhub.lead;

import jakarta.persistence.criteria.Predicate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import vn.leadhub.common.Validators;
import vn.leadhub.lead.LeadDtos.LeadFilter;
import vn.leadhub.security.UserPrincipal;

/** Xây truy vấn lọc lead bằng Criteria API (tham số bind, không nối chuỗi SQL). */
public final class LeadSpecifications {
  public static final ZoneId VN = ZoneId.of("Asia/Ho_Chi_Minh");

  private LeadSpecifications() {}

  /** Phạm vi dữ liệu: ADMIN thấy tất cả; SALES thấy lead của mình + lead chưa giao. */
  public static Specification<Lead> visibleTo(UserPrincipal user) {
    return (root, query, cb) -> {
      if (user.isAdmin()) return cb.conjunction();
      var assignee = root.join("assignee", jakarta.persistence.criteria.JoinType.LEFT);
      return cb.or(cb.isNull(root.get("assignee")), cb.equal(assignee.get("id"), user.id()));
    };
  }

  public static Specification<Lead> matches(LeadFilter f) {
    return (root, query, cb) -> {
      List<Predicate> ps = new ArrayList<>();
      if (f == null) return cb.conjunction();
      if (f.status() != null) ps.add(cb.equal(root.get("status"), f.status()));
      if (f.siteId() != null) ps.add(cb.equal(root.get("site").get("id"), f.siteId()));
      if (Boolean.TRUE.equals(f.unassigned())) ps.add(cb.isNull(root.get("assignee")));
      else if (f.assigneeId() != null) ps.add(cb.equal(root.get("assignee").get("id"), f.assigneeId()));
      if (f.from() != null) ps.add(cb.greaterThanOrEqualTo(root.get("createdAt"), f.from().atStartOfDay(VN).toInstant()));
      if (f.to() != null) ps.add(cb.lessThan(root.get("createdAt"), f.to().plusDays(1).atStartOfDay(VN).toInstant()));
      if (f.q() != null && !f.q().isBlank()) {
        String raw = f.q().trim();
        String like = "%" + Validators.escapeLike(raw.toLowerCase()) + "%";
        List<Predicate> any = new ArrayList<>();
        any.add(cb.like(cb.lower(root.get("fullName")), like, '\\'));
        any.add(cb.like(cb.lower(root.get("email")), like, '\\'));
        String digits = raw.replaceAll("\\D", "");
        if (digits.length() >= 3) {
          if (digits.startsWith("84") && digits.length() > 9) digits = "0" + digits.substring(2);
          any.add(cb.like(root.get("phone"), "%" + digits + "%"));
        }
        ps.add(cb.or(any.toArray(Predicate[]::new)));
      }
      return cb.and(ps.toArray(Predicate[]::new));
    };
  }
}
