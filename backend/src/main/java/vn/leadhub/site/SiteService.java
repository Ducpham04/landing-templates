package vn.leadhub.site;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.leadhub.common.AppException;
import vn.leadhub.site.SiteDtos.*;

@Service
@RequiredArgsConstructor
public class SiteService {
  private static final SecureRandom RANDOM = new SecureRandom();
  private static final char[] ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789".toCharArray();
  private final SiteRepository sites;

  @Transactional(readOnly = true)
  public List<SiteDto> list(boolean includeKey) {
    Map<Long, Long> counts = new HashMap<>();
    for (Object[] row : sites.countLeadsBySite()) counts.put((Long) row[0], (Long) row[1]);
    return sites.findAllByOrderByNameAsc().stream()
        .map(s -> toDto(s, counts.getOrDefault(s.getId(), 0L), includeKey))
        .toList();
  }

  @Transactional
  public SiteDto create(CreateSiteRequest req) {
    Site s = Site.builder().name(req.name().trim()).domain(blankToNull(req.domain())).siteKey(newKey()).active(true).build();
    return toDto(sites.save(s), 0, true);
  }

  @Transactional
  public SiteDto update(Long id, UpdateSiteRequest req) {
    Site s = find(id);
    s.setName(req.name().trim());
    s.setDomain(blankToNull(req.domain()));
    s.setActive(req.active());
    return toDto(s, 0, true);
  }

  @Transactional
  public SiteDto regenerateKey(Long id) {
    Site s = find(id);
    s.setSiteKey(newKey());
    return toDto(s, 0, true);
  }

  private Site find(Long id) {
    return sites.findById(id).orElseThrow(() -> AppException.notFound("landing"));
  }

  static String newKey() {
    StringBuilder sb = new StringBuilder("site_");
    for (int i = 0; i < 24; i++) sb.append(ALPHABET[RANDOM.nextInt(ALPHABET.length)]);
    return sb.toString();
  }

  private static String blankToNull(String v) {
    return v == null || v.isBlank() ? null : v.trim().toLowerCase();
  }

  private static SiteDto toDto(Site s, long count, boolean includeKey) {
    return new SiteDto(s.getId(), s.getName(), s.getDomain(), includeKey ? s.getSiteKey() : null, s.isActive(), count, s.getCreatedAt());
  }
}
