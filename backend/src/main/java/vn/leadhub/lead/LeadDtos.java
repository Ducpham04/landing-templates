package vn.leadhub.lead;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;

public final class LeadDtos {
  private LeadDtos() {}

  public record LeadSummaryDto(
      Long id,
      String fullName,
      String phone,
      String email,
      LeadStatus status,
      Long siteId,
      String siteName,
      Long assigneeId,
      String assigneeName,
      String utmSource,
      Instant createdAt) {}

  public record LeadDetailDto(
      Long id,
      String fullName,
      String phone,
      String email,
      String message,
      Map<String, String> extra,
      LeadStatus status,
      Long siteId,
      String siteName,
      Long assigneeId,
      String assigneeName,
      String pageUrl,
      String utmSource,
      String utmMedium,
      String utmCampaign,
      Instant createdAt,
      Instant updatedAt) {}

  /** Bộ lọc danh sách lead (tất cả đều tuỳ chọn). Ngày tính theo giờ Việt Nam. */
  public record LeadFilter(
      LeadStatus status,
      Long siteId,
      Long assigneeId,
      Boolean unassigned,
      @Size(max = 100) String q,
      LocalDate from,
      LocalDate to) {}

  /** Cập nhật lead: các trường null = giữ nguyên. unassign=true để bỏ người phụ trách (ADMIN). */
  public record UpdateLeadRequest(LeadStatus status, Long assigneeId, Boolean unassign) {}

  public record CreateNoteRequest(
      @NotBlank(message = "Vui lòng nhập nội dung ghi chú") @Size(max = 2000, message = "Ghi chú tối đa 2000 ký tự")
          String content) {}

  public record NoteDto(Long id, String content, Long authorId, String authorName, Instant createdAt) {}

  public record ActivityDto(
      Long id, ActivityType type, String fromValue, String toValue, Long actorId, String actorName, Instant createdAt) {}

  public record PublicLeadResponse(boolean success, String message) {}
}
