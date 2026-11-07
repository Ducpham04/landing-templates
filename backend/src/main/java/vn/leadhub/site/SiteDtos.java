package vn.leadhub.site;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public final class SiteDtos {
  private SiteDtos() {}

  private static final String DOMAIN_REGEX = "^$|^[a-zA-Z0-9.-]{1,190}$";

  /** siteKey chỉ trả về cho ADMIN (null với SALES). */
  public record SiteDto(Long id, String name, String domain, String siteKey, boolean active, long leadCount, Instant createdAt) {}

  public record CreateSiteRequest(
      @NotBlank(message = "Vui lòng nhập tên landing") @Size(max = 120, message = "Tên tối đa 120 ký tự") String name,
      @Pattern(regexp = DOMAIN_REGEX, message = "Domain chỉ gồm chữ, số, dấu chấm, gạch ngang (vd: du-an-abc.vn)") String domain) {}

  public record UpdateSiteRequest(
      @NotBlank(message = "Vui lòng nhập tên landing") @Size(max = 120, message = "Tên tối đa 120 ký tự") String name,
      @Pattern(regexp = DOMAIN_REGEX, message = "Domain chỉ gồm chữ, số, dấu chấm, gạch ngang (vd: du-an-abc.vn)") String domain,
      @NotNull Boolean active) {}
}
