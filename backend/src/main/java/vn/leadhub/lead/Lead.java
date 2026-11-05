package vn.leadhub.lead;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;
import vn.leadhub.site.Site;
import vn.leadhub.user.User;

@Entity
@Table(name = "leads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "site_id")
  private Site site;

  @Column(name = "full_name", nullable = false, length = 120)
  private String fullName;

  @Column(nullable = false, length = 20)
  private String phone;

  @Column(length = 190)
  private String email;

  @Column(columnDefinition = "TEXT")
  private String message;

  /** Các trường bổ sung khác nhau giữa các landing (loại căn, ngân sách, khoá học...). */
  @Builder.Default
  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "json")
  private Map<String, String> extra = new LinkedHashMap<>();

  @Builder.Default
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private LeadStatus status = LeadStatus.NEW;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "assignee_id")
  private User assignee;

  @Column(name = "page_url", length = 500)
  private String pageUrl;

  @Column(name = "utm_source", length = 100)
  private String utmSource;

  @Column(name = "utm_medium", length = 100)
  private String utmMedium;

  @Column(name = "utm_campaign", length = 150)
  private String utmCampaign;

  @Column(name = "ip_address", length = 45)
  private String ipAddress;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;
}
