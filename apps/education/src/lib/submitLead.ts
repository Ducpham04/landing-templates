/**
 * Gửi form đăng ký. Đặt `form.endpoint` trong config:
 *  - Formspree:            https://formspree.io/f/xxxxxx
 *  - Google Apps Script:   https://script.google.com/macros/s/.../exec  (ghi vào Google Sheet)
 *  - Webhook bất kỳ (Make, Zapier, n8n, API riêng) nhận JSON
 * Để trống endpoint → chế độ demo (giả lập gửi thành công, không gửi đi đâu).
 */
export async function submitLead(endpoint: string, data: Record<string, string>): Promise<void> {
  const payload = { ...data, page: location.href, submittedAt: new Date().toISOString() };
  if (!endpoint) {
    await new Promise((r) => setTimeout(r, 900));
    console.info("[demo] Lead (chưa cấu hình form.endpoint):", payload);
    return;
  }
  const isAppsScript = endpoint.includes("script.google.com");
  const res = await fetch(endpoint, {
    method: "POST",
    mode: isAppsScript ? "no-cors" : "cors",
    headers: isAppsScript
      ? { "Content-Type": "text/plain;charset=utf-8" }
      : { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!isAppsScript && !res.ok) throw new Error(`HTTP ${res.status}`);
}

export const isValidPhone = (v: string) => /^(\+?84|0)(3|5|7|8|9)\d{8}$/.test(v.replace(/[\s.-]/g, ""));
export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
