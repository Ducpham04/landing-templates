# PRD — LeadHub: Landing page + quản lý khách hàng tiềm năng

> Vai trò: Product Owner / BA · Phiên bản 1.0 (MVP)

## 1. Bối cảnh

Repo đã có 3 landing page cao cấp (Bất động sản, Nội thất, Giáo dục). Form trên landing hiện chỉ gửi tới Formspree hoặc Google Sheet. Khách hàng của dịch vụ freelance (chủ đầu tư, studio nội thất, trung tâm giáo dục) thường gặp các vấn đề sau:

- Lead nằm rải rác ở email và Google Sheet, không biết ai đã gọi ai.
- Không đo được landing nào hiệu quả, nguồn quảng cáo nào ra khách.
- Lead bị chậm chăm sóc, nên tỉ lệ chốt thấp.

**LeadHub** là backend và trang quản trị nhận lead trực tiếp từ các landing page. Lead được phân cho nhân viên tư vấn, có theo dõi trạng thái và ghi chú chăm sóc. Bán kèm landing page thành một gói trọn: **"Landing page + CRM mini"**.

## 2. Mục tiêu

| Mục tiêu | Chỉ số đo (sau MVP) |
| --- | --- |
| Không mất lead | 100% submit hợp lệ từ landing được lưu, kể cả khi nhân viên offline |
| Chăm sóc nhanh | Thời gian từ lúc có lead tới khi chuyển `CONTACTED` hiển thị được trên dashboard |
| Đo hiệu quả | Thống kê lead theo landing, theo trạng thái, theo ngày, theo nguồn UTM |
| Bàn giao nhanh | Freelancer dựng xong 1 khách mới (landing + site key + tài khoản sale) trong dưới 1 giờ |

## 3. Persona

| Persona | Mô tả | Nhu cầu chính |
| --- | --- | --- |
| **Chị Lan – Chủ doanh nghiệp / Quản trị (ADMIN)** | 38 tuổi, chủ studio nội thất, dùng điện thoại nhiều, ít thời gian | Xem nhanh hôm nay có bao nhiêu lead, nhân viên xử lý tới đâu; tạo tài khoản cho sale; quản lý landing |
| **Minh – Nhân viên tư vấn (SALES)** | 26 tuổi, gọi điện cả ngày, thao tác trên điện thoại | Thấy ngay lead mới, bấm gọi, ghi chú, đổi trạng thái trong 2–3 chạm |
| **Khách truy cập landing (Public)** | Người quan tâm sản phẩm | Điền form nhanh, nhận phản hồi rõ ràng |
| **Freelancer (người bán dịch vụ)** | Người triển khai | Cấu hình site key cho landing, deploy bằng 1 lệnh |

## 4. User stories và tiêu chí chấp nhận

### Epic A — Thu lead từ landing (Public)

**A1.** Là khách truy cập, tôi muốn gửi form đăng ký để được tư vấn.
- AC1: `POST /api/public/leads` với `siteKey` hợp lệ, `name` và `phone` hợp lệ (SĐT Việt Nam) → trả về 201, lead lưu trạng thái `NEW`.
- AC2: Thiếu tên hoặc SĐT sai định dạng → 400 kèm thông báo lỗi tiếng Việt theo từng trường.
- AC3: `siteKey` không tồn tại hoặc site bị tắt → 404 hoặc 403, không lưu.
- AC4: Trường phụ (email, lời nhắn, loại căn, ngân sách, khoá học, …) được lưu vào `extra` và hiển thị ở chi tiết lead.
- AC5: Lưu `pageUrl`, `utm_source`, `utm_medium`, `utm_campaign` nếu có.
- AC6: Chống spam: trường honeypot `website` có giá trị thì trả 201 giả nhưng không lưu; quá 10 request/phút/IP → 429.

**A2.** Là freelancer, tôi muốn landing gửi lead về LeadHub chỉ bằng việc đổi cấu hình.
- AC: Đặt `VITE_LEAD_ENDPOINT` (hoặc `form.endpoint`) = `https://api…/api/public/leads?siteKey=…` thì form hoạt động, không phải sửa code.

### Epic B — Xác thực và phân quyền

**B1.** Là ADMIN/SALES, tôi muốn đăng nhập bằng email + mật khẩu.
- AC1: Đúng → nhận access token (15 phút) và refresh token (7 ngày).
- AC2: Sai → 401 với thông báo chung "Email hoặc mật khẩu không đúng".
- AC3: Tài khoản bị khoá → 403.
- AC4: Access token hết hạn → frontend tự gọi refresh, người dùng không bị đá ra.
- AC5: Đăng xuất → refresh token bị thu hồi, không dùng lại được.

**B2.** Là hệ thống, tôi chỉ cho mỗi vai trò làm đúng việc của mình.
- AC: SALES không truy cập được `/api/users` và `/api/sites` (403). SALES chỉ thấy lead được giao cho mình hoặc lead chưa giao.

### Epic C — Quản lý lead

**C1.** Là SALES, tôi muốn xem danh sách lead mới nhất để gọi ngay.
- AC1: Danh sách phân trang (20/trang), mới nhất trước.
- AC2: Lọc theo trạng thái, landing, người phụ trách, khoảng ngày; tìm theo tên, SĐT, email.
- AC3: Trên mobile, mỗi lead là một dòng có nút gọi (`tel:`) và nút Zalo.

**C2.** Là SALES, tôi muốn đổi trạng thái lead (Mới → Đã liên hệ → Tiềm năng → Chốt / Thất bại).
- AC: Đổi thành công thì ghi lịch sử hoạt động (ai, lúc nào, từ trạng thái nào sang trạng thái nào).

**C3.** Là SALES, tôi muốn ghi chú cuộc gọi.
- AC: Ghi chú 1–2000 ký tự, hiển thị theo thời gian, có tên người viết.

**C4.** Là SALES, tôi muốn nhận một lead chưa có người phụ trách.
- AC: Bấm "Nhận xử lý" thì lead được giao cho mình. SALES không giao lead cho người khác được.

**C5.** Là ADMIN, tôi muốn giao lead cho nhân viên bất kỳ.
- AC: Chọn người phụ trách trong danh sách SALES đang hoạt động; thao tác được ghi lịch sử.

**C6.** Là ADMIN, tôi muốn xuất danh sách lead ra CSV (mở được bằng Excel, đúng tiếng Việt).
- AC: File CSV UTF-8 có BOM, theo bộ lọc hiện tại.

### Epic D — Dashboard

**D1.** Là ADMIN/SALES, tôi muốn xem tổng quan.
- AC: Có tổng lead, lead mới hôm nay, tỉ lệ chốt, số lead theo trạng thái, theo landing và theo ngày (14 ngày gần nhất). SALES chỉ thấy số liệu trong phạm vi của mình.

### Epic E — Quản trị

**E1.** Là ADMIN, tôi muốn quản lý landing (site).
- AC: Tạo, sửa (tên, domain, bật/tắt) và xem `siteKey`; có thể tạo lại key.

**E2.** Là ADMIN, tôi muốn quản lý tài khoản nhân viên.
- AC: Tạo tài khoản (họ tên, email, vai trò, mật khẩu tạm từ 8 ký tự), sửa vai trò, khoá/mở khoá. Không tự khoá chính mình.

## 5. Phạm vi

### MVP (bản này)
- API public nhận lead, có honeypot, rate limit và validation.
- Đăng nhập JWT (access + refresh), 2 vai trò ADMIN và SALES.
- Danh sách, lọc, chi tiết lead; đổi trạng thái; giao hoặc nhận lead; ghi chú; lịch sử hoạt động.
- Dashboard thống kê.
- Quản lý site và user (ADMIN).
- Xuất CSV.
- Tích hợp 3 landing có sẵn.
- Docker compose một lệnh chạy toàn bộ; seed data tiếng Việt; CI.

### Sau MVP
- Thông báo lead mới qua Zalo OA, Telegram, email.
- Tự động chia lead xoay vòng (round-robin) cho sale.
- Nhắc lịch gọi lại (follow-up) và SLA cảnh báo lead quá hạn.
- Đa doanh nghiệp (multi-tenant) trên một hệ thống.
- Quên mật khẩu qua email, 2FA.
- Webhook ra ngoài (Google Sheet, CRM khác), Facebook Lead Ads.
- Báo cáo nâng cao: hiệu quả theo chiến dịch, theo nhân viên.
- Ứng dụng di động / PWA push notification.
