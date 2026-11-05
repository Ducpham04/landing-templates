package vn.leadhub.site;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.leadhub.security.CurrentUser;
import vn.leadhub.site.SiteDtos.*;

@Tag(name = "Sites")
@RestController
@RequestMapping("/api/sites")
@RequiredArgsConstructor
public class SiteController {
  private final SiteService service;

  /** ADMIN thấy đầy đủ kể cả siteKey; SALES chỉ dùng để lọc theo landing. */
  @GetMapping
  public List<SiteDto> list() {
    return service.list(CurrentUser.get().isAdmin());
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('ADMIN')")
  public SiteDto create(@Valid @RequestBody CreateSiteRequest req) {
    return service.create(req);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public SiteDto update(@PathVariable Long id, @Valid @RequestBody UpdateSiteRequest req) {
    return service.update(id, req);
  }

  @PostMapping("/{id}/regenerate-key")
  @PreAuthorize("hasRole('ADMIN')")
  public SiteDto regenerate(@PathVariable Long id) {
    return service.regenerateKey(id);
  }
}
