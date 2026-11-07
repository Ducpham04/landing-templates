package vn.leadhub.lead;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.leadhub.lead.LeadDtos.PublicLeadResponse;

@Tag(name = "Public")
@RestController
@RequestMapping("/api/public/leads")
@RequiredArgsConstructor
public class PublicLeadController {
  private final PublicLeadService service;

  @Operation(summary = "Nhận lead từ form landing (body JSON tự do: name, phone, email, message, utm_*, page, ...)")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public PublicLeadResponse submit(
      @RequestParam String siteKey, @RequestBody(required = false) Map<String, Object> body, HttpServletRequest req) {
    service.submit(siteKey, body, req.getRemoteAddr());
    // Spam (honeypot) cũng nhận phản hồi thành công để bot không phát hiện
    return new PublicLeadResponse(true, "Đăng ký thành công");
  }
}
