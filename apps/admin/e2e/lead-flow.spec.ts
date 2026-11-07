import { expect, test, type Page } from "@playwright/test";

const LANDING_URL = process.env.LANDING_URL ?? "http://localhost:5103";
const API_URL = process.env.API_URL ?? "http://localhost:8080";
const SITE_KEY = process.env.SITE_KEY ?? "site_nova_demo_2026";

/** SĐT duy nhất cho mỗi lần chạy: 09 + 8 chữ số. */
const uniquePhone = () => `09${String(Date.now()).slice(-8)}`;
const spaced = (p: string) => `${p.slice(0, 4)} ${p.slice(4, 7)} ${p.slice(7)}`;

async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mật khẩu").fill(password);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Xin chào/ })).toBeVisible();
}

test("khách gửi form landing → tư vấn viên nhận, xử lý, ghi chú → admin thấy kết quả", async ({ page, browser }) => {
  const phone = uniquePhone();
  const name = `Khách E2E ${phone.slice(-4)}`;

  // 1. Khách điền form học thử trên landing Giáo dục
  await page.goto(LANDING_URL);
  const form = page.locator("#hoc-thu");
  await form.getByLabel(/Họ tên học viên/).fill(name);
  await form.getByLabel(/Số điện thoại/).fill(spaced(phone));
  await form.getByLabel("Email").fill("e2e@example.com");
  await form.getByLabel("Khoá học quan tâm").selectOption("IELTS Intensive");
  await form.getByRole("button", { name: "Đăng ký học thử ngay" }).click();
  await expect(form.getByText(/Đăng ký thành công/)).toBeVisible();

  // 2. Tư vấn viên đăng nhập, tìm lead mới
  const sales = await browser.newPage({ baseURL: test.info().project.use.baseURL });
  await login(sales, "minh.tran@leadhub.vn", "Sales@123");
  await sales.goto(`/leads?q=${phone}`);
  await sales.getByRole("link", { name }).first().click();
  await expect(sales.getByRole("heading", { name })).toBeVisible();
  await expect(sales.getByText("IELTS Intensive")).toBeVisible();
  await expect(sales.getByText(/Khách gửi đăng ký từ Nova Academy/)).toBeVisible();

  // 3. Nhận xử lý → đổi trạng thái → ghi chú
  await sales.getByRole("button", { name: "Nhận xử lý" }).click();
  await expect(sales.getByText("Bạn", { exact: true })).toBeVisible();
  await sales.getByRole("radio", { name: "Đã liên hệ" }).click();
  await expect(sales.getByRole("radio", { name: "Đã liên hệ" })).toHaveAttribute("aria-checked", "true");
  await sales.getByLabel("Ghi chú mới").fill("Đã gọi, hẹn test trình độ sáng thứ Bảy");
  await sales.getByRole("button", { name: "Thêm ghi chú" }).click();
  await expect(sales.getByText("Đã gọi, hẹn test trình độ sáng thứ Bảy")).toBeVisible();
  await expect(sales.getByText(/Đổi trạng thái: Mới → Đã liên hệ/)).toBeVisible();
  await expect(sales.getByText(/Giao cho Trần Quang Minh/)).toBeVisible();

  // 4. Quản trị thấy lead đã được Minh xử lý
  await login(page, "admin@leadhub.vn", "Admin@123");
  await page.goto(`/leads?q=${phone}`);
  const row = page.getByRole("row", { name: new RegExp(name) });
  await expect(row).toContainText("Đã liên hệ");
  await expect(row).toContainText("Trần Quang Minh");
});

test("tư vấn viên không vào được trang quản trị nhân viên", async ({ page }) => {
  await login(page, "minh.tran@leadhub.vn", "Sales@123");
  await expect(page.getByRole("link", { name: "Nhân viên" })).toHaveCount(0);
  await page.goto("/users");
  await expect(page.getByText("Bạn không có quyền truy cập trang này")).toBeVisible();
});

test("đăng nhập sai hiện thông báo lỗi", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("admin@leadhub.vn");
  await page.getByLabel("Mật khẩu").fill("sai-mat-khau");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText("Email hoặc mật khẩu không đúng");
});

test("@mobile tư vấn viên gọi khách từ danh sách lead trên điện thoại", async ({ page, request }) => {
  const phone = uniquePhone();
  const res = await request.post(`${API_URL}/api/public/leads?siteKey=${SITE_KEY}`, {
    data: { name: "Khách Mobile", phone, course: "Kids English" },
  });
  expect(res.status()).toBe(201);

  await login(page, "minh.tran@leadhub.vn", "Sales@123");
  await page.getByRole("navigation", { name: "Điều hướng" }).getByRole("link", { name: "Lead" }).click();
  await page.getByRole("searchbox", { name: "Tìm kiếm lead" }).fill(phone);
  const call = page.getByRole("link", { name: "Gọi Khách Mobile" }).first();
  await expect(call).toHaveAttribute("href", `tel:${phone}`);
  await expect(page.getByRole("link", { name: "Nhắn Zalo Khách Mobile" }).first()).toHaveAttribute("href", `https://zalo.me/${phone}`);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
