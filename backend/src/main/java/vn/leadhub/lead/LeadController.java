package vn.leadhub.lead;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.leadhub.common.PageResponse;
import vn.leadhub.lead.LeadDtos.*;
import vn.leadhub.security.CurrentUser;

@Tag(name = "Leads")
@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {
  private static final Set<String> SORTABLE = Set.of("createdAt", "updatedAt", "fullName", "status");
  private final LeadService service;

  @GetMapping
  public PageResponse<LeadSummaryDto> search(
      @ParameterObject @Valid LeadFilterParams p,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @RequestParam(defaultValue = "createdAt,desc") String sort) {
    return service.search(p.toFilter(), pageable(page, size, sort), CurrentUser.get());
  }

  @GetMapping("/export")
  @PreAuthorize("hasRole('ADMIN')")
  public void export(@ParameterObject @Valid LeadFilterParams p, HttpServletResponse res) throws IOException {
    var rows = service.exportRows(p.toFilter(), CurrentUser.get());
    res.setContentType("text/csv; charset=UTF-8");
    res.setHeader("Content-Disposition", "attachment; filename=\"leads-" + LocalDate.now(LeadSpecifications.VN) + ".csv\"");
    LeadCsvWriter.write(rows, new OutputStreamWriter(res.getOutputStream(), StandardCharsets.UTF_8));
  }

  @GetMapping("/{id}")
  public LeadDetailDto get(@PathVariable Long id) {
    return service.get(id, CurrentUser.get());
  }

  @PatchMapping("/{id}")
  public LeadDetailDto update(@PathVariable Long id, @RequestBody UpdateLeadRequest req) {
    return service.update(id, req, CurrentUser.get());
  }

  @PostMapping("/{id}/claim")
  public LeadDetailDto claim(@PathVariable Long id) {
    return service.claim(id, CurrentUser.get());
  }

  @GetMapping("/{id}/notes")
  public List<NoteDto> notes(@PathVariable Long id) {
    return service.listNotes(id, CurrentUser.get());
  }

  @PostMapping("/{id}/notes")
  @ResponseStatus(HttpStatus.CREATED)
  public NoteDto addNote(@PathVariable Long id, @Valid @RequestBody CreateNoteRequest req) {
    return service.addNote(id, req.content(), CurrentUser.get());
  }

  @GetMapping("/{id}/activities")
  public List<ActivityDto> activities(@PathVariable Long id) {
    return service.listActivities(id, CurrentUser.get());
  }

  private static Pageable pageable(int page, int size, String sort) {
    String[] parts = sort.split(",");
    String field = SORTABLE.contains(parts[0]) ? parts[0] : "createdAt";
    Sort.Direction dir = parts.length > 1 && parts[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
    return PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100), Sort.by(dir, field).and(Sort.by(dir, "id")));
  }

  /** Tham số query của bộ lọc. */
  public record LeadFilterParams(
      LeadStatus status,
      Long siteId,
      Long assigneeId,
      Boolean unassigned,
      @jakarta.validation.constraints.Size(max = 100) String q,
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
    LeadFilter toFilter() {
      return new LeadFilter(status, siteId, assigneeId, unassigned, q, from, to);
    }
  }
}
