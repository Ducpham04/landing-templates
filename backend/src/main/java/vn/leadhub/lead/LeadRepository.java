package vn.leadhub.lead;

import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface LeadRepository extends JpaRepository<Lead, Long>, JpaSpecificationExecutor<Lead> {
  /** Nạp kèm site + assignee trong 1 truy vấn để tránh N+1 ở danh sách. */
  @Override
  @EntityGraph(attributePaths = {"site", "assignee"})
  Page<Lead> findAll(Specification<Lead> spec, Pageable pageable);

  @Override
  @EntityGraph(attributePaths = {"site", "assignee"})
  List<Lead> findAll(Specification<Lead> spec);

  /** Thống kê theo trạng thái trong phạm vi: scopeUserId null = toàn hệ thống. */
  @Query(
      """
      select l.status, count(l) from Lead l
      where (:scopeUserId is null or l.assignee is null or l.assignee.id = :scopeUserId)
      group by l.status""")
  List<Object[]> countByStatus(Long scopeUserId);

  @Query(
      """
      select l.site.id, l.site.name, count(l) from Lead l
      where (:scopeUserId is null or l.assignee is null or l.assignee.id = :scopeUserId)
      group by l.site.id, l.site.name order by count(l) desc""")
  List<Object[]> countBySite(Long scopeUserId);

  @Query(
      """
      select l.createdAt from Lead l
      where l.createdAt >= :from
        and (:scopeUserId is null or l.assignee is null or l.assignee.id = :scopeUserId)""")
  List<Instant> createdTimesSince(Instant from, Long scopeUserId);
}
