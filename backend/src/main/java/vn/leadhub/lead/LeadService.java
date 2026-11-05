package vn.leadhub.lead;

import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.leadhub.common.AppException;
import vn.leadhub.common.PageResponse;
import vn.leadhub.lead.LeadDtos.*;
import vn.leadhub.security.UserPrincipal;
import vn.leadhub.user.User;
import vn.leadhub.user.UserRepository;

@Service
@RequiredArgsConstructor
public class LeadService {
  public static final int MAX_EXPORT = 10_000;

  private final LeadRepository leads;
  private final LeadNoteRepository notes;
  private final LeadActivityRepository activities;
  private final UserRepository users;
  private final LeadMapper mapper;

  @Transactional(readOnly = true)
  public PageResponse<LeadSummaryDto> search(LeadFilter filter, Pageable pageable, UserPrincipal me) {
    Page<Lead> page = leads.findAll(spec(filter, me), pageable);
    return PageResponse.of(page, mapper::toSummary);
  }

  @Transactional(readOnly = true)
  public List<Lead> exportRows(LeadFilter filter, UserPrincipal me) {
    return leads
        .findAll(spec(filter, me), PageRequest.of(0, MAX_EXPORT, Sort.by(Sort.Direction.DESC, "createdAt")))
        .getContent();
  }

  @Transactional(readOnly = true)
  public LeadDetailDto get(Long id, UserPrincipal me) {
    return mapper.toDetail(load(id, me));
  }

  @Transactional
  public LeadDetailDto update(Long id, UpdateLeadRequest req, UserPrincipal me) {
    Lead lead = load(id, me);
    User actor = users.getReferenceById(me.id());

    boolean changesAssignee = req.assigneeId() != null || Boolean.TRUE.equals(req.unassign());
    if (changesAssignee) {
      if (!me.isAdmin()) {
        throw AppException.forbidden("Chỉ quản trị viên được giao lead cho người khác. Hãy dùng \"Nhận xử lý\".");
      }
      User newAssignee = null;
      if (!Boolean.TRUE.equals(req.unassign())) {
        newAssignee =
            users.findById(req.assigneeId())
                .filter(User::isActive)
                .orElseThrow(() -> AppException.badRequest("INVALID_ASSIGNEE", "Người phụ trách không tồn tại hoặc đã bị khoá"));
      }
      assign(lead, newAssignee, actor);
    }

    if (req.status() != null && req.status() != lead.getStatus()) {
      // SALES phải nhận lead trước khi xử lý trạng thái
      if (!me.isAdmin() && lead.getAssignee() == null) {
        assign(lead, actor, actor);
      }
      log(lead, actor, ActivityType.STATUS_CHANGED, lead.getStatus().name(), req.status().name());
      lead.setStatus(req.status());
    }
    return mapper.toDetail(lead);
  }

  @Transactional
  public LeadDetailDto claim(Long id, UserPrincipal me) {
    Lead lead = load(id, me);
    if (lead.getAssignee() != null) {
      if (lead.getAssignee().getId().equals(me.id())) return mapper.toDetail(lead);
      throw AppException.conflict("ALREADY_ASSIGNED", "Lead đã có người phụ trách");
    }
    User actor = users.getReferenceById(me.id());
    assign(lead, actor, actor);
    return mapper.toDetail(lead);
  }

  @Transactional(readOnly = true)
  public List<NoteDto> listNotes(Long id, UserPrincipal me) {
    load(id, me);
    return notes.findByLeadIdOrderByCreatedAtDescIdDesc(id).stream().map(mapper::toNote).toList();
  }

  @Transactional
  public NoteDto addNote(Long id, String content, UserPrincipal me) {
    Lead lead = load(id, me);
    User author = users.findById(me.id()).orElseThrow(() -> AppException.unauthorized("Vui lòng đăng nhập"));
    LeadNote note = notes.save(LeadNote.builder().lead(lead).author(author).content(content.trim()).build());
    log(lead, author, ActivityType.NOTE_ADDED, null, null);
    lead.setUpdatedAt(note.getCreatedAt());
    return mapper.toNote(note);
  }

  @Transactional(readOnly = true)
  public List<ActivityDto> listActivities(Long id, UserPrincipal me) {
    load(id, me);
    return activities.findByLeadIdOrderByCreatedAtDescIdDesc(id).stream().map(mapper::toActivity).toList();
  }

  private void assign(Lead lead, User to, User actor) {
    User from = lead.getAssignee();
    Long fromId = from == null ? null : from.getId();
    Long toId = to == null ? null : to.getId();
    if (Objects.equals(fromId, toId)) return;
    lead.setAssignee(to);
    log(lead, actor, ActivityType.ASSIGNED, from == null ? null : from.getFullName(), to == null ? null : nameOf(to));
  }

  private String nameOf(User u) {
    // u có thể là proxy (getReferenceById) → nạp tên khi cần
    return users.findById(u.getId()).map(User::getFullName).orElse(null);
  }

  private void log(Lead lead, User actor, ActivityType type, String from, String to) {
    activities.save(LeadActivity.builder().lead(lead).actor(actor).type(type).fromValue(from).toValue(to).build());
  }

  /** Nạp lead trong phạm vi người dùng; ngoài phạm vi → 404 (không lộ sự tồn tại). */
  private Lead load(Long id, UserPrincipal me) {
    Specification<Lead> byId = (root, q, cb) -> cb.equal(root.get("id"), id);
    return leads.findAll(byId.and(LeadSpecifications.visibleTo(me))).stream()
        .findFirst()
        .orElseThrow(() -> AppException.notFound("lead"));
  }

  private static Specification<Lead> spec(LeadFilter filter, UserPrincipal me) {
    return LeadSpecifications.visibleTo(me).and(LeadSpecifications.matches(filter));
  }
}
