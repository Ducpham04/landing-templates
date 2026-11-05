package vn.leadhub.lead;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.leadhub.lead.LeadDtos.*;

@Mapper
public interface LeadMapper {
  @Mapping(target = "siteId", source = "site.id")
  @Mapping(target = "siteName", source = "site.name")
  @Mapping(target = "assigneeId", source = "assignee.id")
  @Mapping(target = "assigneeName", source = "assignee.fullName")
  LeadSummaryDto toSummary(Lead lead);

  @Mapping(target = "siteId", source = "site.id")
  @Mapping(target = "siteName", source = "site.name")
  @Mapping(target = "assigneeId", source = "assignee.id")
  @Mapping(target = "assigneeName", source = "assignee.fullName")
  LeadDetailDto toDetail(Lead lead);

  @Mapping(target = "authorId", source = "author.id")
  @Mapping(target = "authorName", source = "author.fullName")
  NoteDto toNote(LeadNote note);

  @Mapping(target = "actorId", source = "actor.id")
  @Mapping(target = "actorName", source = "actor.fullName")
  ActivityDto toActivity(LeadActivity activity);
}
