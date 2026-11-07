package vn.leadhub.site;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SiteRepository extends JpaRepository<Site, Long> {
  Optional<Site> findBySiteKey(String siteKey);

  List<Site> findAllByOrderByNameAsc();

  @Query("select count(l) from Lead l where l.site.id = :siteId")
  long countLeads(Long siteId);

  /** Số lead theo site: [siteId, count] */
  @Query("select l.site.id, count(l) from Lead l group by l.site.id")
  List<Object[]> countLeadsBySite();
}
