# TEST PLAN — LeadHub MVP

> Vai trò: QA Engineer · Phạm vi: backend API, admin SPA, tích hợp landing → API → admin

## 1. Chiến lược

| Tầng | Công cụ | Chạy ở đâu | Mục tiêu |
| --- | --- | --- | --- |
| Unit backend | JUnit 5 + Mockito + AssertJ | `cd backend && mvn test` | Quy tắc nghiệp vụ, validate, bảo mật thuần (không DB) |
| Integration backend | Spring Boot Test + MockMvc + **Testcontainers MySQL 8.4** | `mvn test` (cần Docker) | API thật trên DB thật: Flyway, phân quyền, phạm vi dữ liệu, chống spam |
| Unit frontend | Vitest + jsdom | `npm test -w apps/admin` | Format dữ liệu, Zod schema (thông báo lỗi tiếng Việt) |
| E2E | Playwright (desktop Chrome + Pixel 7) | `docker compose up -d` rồi `npx playwright test` trong `apps/admin` | Luồng chính end-to-end qua trình duyệt trên stack Docker thật |
| CI | GitHub Actions | `.github/workflows/ci.yml` | backend → frontend → e2e trên mỗi push/PR |

Dữ liệu test: seeder demo (`APP_SEED_DEMO=true`) tạo 4 tài khoản, 3 landing với site key cố định, 64 lead. Mỗi test e2e tạo SĐT riêng theo thời gian nên không phụ thuộc thứ tự chạy.

## 2. Ma trận user story ↔ test

| Story (PRD) | Tiêu chí | Test tự động |
| --- | --- | --- |
| **A1** Gửi form landing | 201 + lưu `NEW` | `PublicLeadServiceTest.savesValidLeadWithExtraAndUtmFromPage`, `LeadFlowIntegrationTest.fullLeadLifecycle`, e2e "khách gửi form landing…" |
| A1 | Lỗi theo từng trường, tiếng Việt | `PublicLeadServiceTest.returnsFieldErrorsInVietnamese`, `LeadFlowIntegrationTest.publicEndpointValidatesAndProtects` |
| A1 | siteKey sai / site tắt | `PublicLeadServiceTest.unknownOrInactiveSiteIsRejected`, integration (404) |
| A1 | `extra`, UTM, page URL | unit + integration (`extra.course`, `utmSource`, `utmCampaign`) |
| A1 | Honeypot, rate limit, body ≤ 16KB | `honeypotIsSilentlyIgnored`, `publicEndpointIsRateLimited`, `publicEndpointValidatesAndProtects` (413), `RateLimiterTest` |
| **A2** Landing chỉ đổi cấu hình | `VITE_LEAD_ENDPOINT` | e2e (landing build với endpoint qua docker compose) |
| **B1** Đăng nhập | Thành công / sai / khoá | `AuthIntegrationTest.loginSuccess…`, `wrongPasswordAndUnknownEmailGiveSameGeneric401`, `lockedAccountIsForbidden`, e2e "đăng nhập sai" |
| B1 | Refresh rotation, logout thu hồi | `refreshRotatesTokenAndOldOneCannotBeReused`, `logoutRevokesRefreshToken` |
| B1 | JWT giả / hết hạn / sai khoá | `JwtServiceTest` (5 ca), `protectedEndpointsRequireValidToken` |
| B1 | Khoá tài khoản → token cũ mất hiệu lực ngay | `lockingUserInvalidatesExistingAccessTokenImmediately` |
| **B2** Phân quyền | SALES không vào users/sites/export | `salesCannotManageUsersOrSites`, e2e "tư vấn viên không vào được trang quản trị nhân viên" |
| B2 | SALES chỉ thấy lead của mình + chưa giao | `salesCannotSeeLeadAssignedToSomeoneElse`, `LeadServiceTest.leadOutsideScopeIsNotFound` |
| **C1** Danh sách, lọc, tìm | Lọc trạng thái + q | `fullLeadLifecycle` (lọc), e2e (tìm theo SĐT), mobile e2e (nút gọi/Zalo, không tràn ngang) |
| **C2** Đổi trạng thái + lịch sử | | `fullLeadLifecycle`, `LeadServiceTest.salesChangingStatusOfUnassignedLeadAutoClaimsIt`, e2e |
| **C3** Ghi chú | | `fullLeadLifecycle`, e2e |
| **C4** SALES nhận lead | Nhận lead chưa giao; không giao cho người khác | `claimFailsWhenAssignedToSomeoneElse`, `salesCannotAssignToOthers`, e2e |
| **C5** ADMIN giao / bỏ giao | User bị khoá không được giao | `adminAssignsAndUnassigns`, `adminCannotAssignInactiveUser` |
| **C6** Xuất CSV | BOM, đúng bộ lọc, chống injection | `LeadCsvWriterTest`, `dashboardAndExport` |
| **D1** Dashboard | 14 ngày, theo site; SALES theo phạm vi | `dashboardAndExport` |
| **E1** Sites | Tạo, sửa, tạo lại key (key cũ ngừng chạy), validate domain, leadCount | `adminManagesSitesAndUsers` |
| **E2** Users | Tạo, trùng email 409, không tự khoá | `adminManagesSitesAndUsers` |
| Bảo mật cấu hình | Secret mặc định bị chặn ở production | `StartupSafetyCheckTest` |
| Bảo mật nhập liệu | SQL injection trong tìm kiếm, escape LIKE | `publicEndpointValidatesAndProtects`, `ValidatorsTest.escapesLikeWildcards` |
| Chuẩn hoá SĐT VN | +84 / 84 / dấu cách / dấu chấm | `ValidatorsTest` (12 ca) |
| Frontend | Format thời gian/SĐT, Zod schema | `format.test.ts` |

## 3. Kiểm thử thủ công (trước mỗi lần bàn giao cho khách)

1. Mở 3 landing trên điện thoại thật: form gửi được, nút Zalo/Messenger mở đúng ứng dụng.
2. Admin trên điện thoại: đăng nhập, gọi khách bằng nút Gọi, đổi trạng thái bằng một tay.
3. Mở file CSV xuất ra bằng Excel: tiếng Việt hiển thị đúng.
4. Đổi `JWT_SECRET`, tắt `APP_SEED_DEMO`, khởi động lại → đăng nhập bằng tài khoản thật.
5. Lighthouse mobile cho 3 landing ≥ 90 (README landing có số đo).

## 4. Tiêu chí đạt

- Toàn bộ test tự động pass trên CI.
- Không còn lỗi mức nghiêm trọng hoặc cao trong review bảo mật.
- `docker compose up -d --build` lên đủ 6 service ở trạng thái healthy.

## 5. Kết quả lần chạy gần nhất (07/11/2026)

| Bộ test | Kết quả |
| --- | --- |
| Backend unit + integration | **51/51 pass** |
| Frontend unit | **5/5 pass** |
| E2E Playwright trên docker compose (desktop + mobile) | **4/4 pass** |
| `docker compose up` | 6/6 service healthy (mysql, backend, admin, 3 landing) |
| GitHub Actions CI | backend ✅, frontend ✅, e2e trên docker compose ✅ |
