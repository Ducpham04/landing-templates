package vn.leadhub.lead;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadActivityRepository extends JpaRepository<LeadActivity, Long> {
  @EntityGraph(attributePaths = "actor")
  List<LeadActivity> findByLeadIdOrderByCreatedAtDescIdDesc(Long leadId);
}
