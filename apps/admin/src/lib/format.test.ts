import { formatPhone, relativeTime, shortDay } from "./format";
import { createUserSchema, loginSchema } from "./schemas";

describe("format", () => {
  it("formats Vietnamese phone numbers", () => {
    expect(formatPhone("0912345678")).toBe("0912 345 678");
    expect(formatPhone("123")).toBe("123");
  });
  it("renders relative time in Vietnamese", () => {
    const now = new Date("2026-11-05T10:00:00Z");
    expect(relativeTime("2026-11-05T09:59:30Z", now)).toBe("Vừa xong");
    expect(relativeTime("2026-11-05T09:55:00Z", now)).toBe("5 phút trước");
    expect(relativeTime("2026-11-05T07:00:00Z", now)).toBe("3 giờ trước");
    expect(relativeTime("2026-11-03T10:00:00Z", now)).toBe("2 ngày trước");
  });
  it("shortens ISO day", () => expect(shortDay("2026-11-05")).toBe("05/11"));
});

describe("schemas", () => {
  it("validates login", () => {
    expect(loginSchema.safeParse({ email: "a@b.vn", password: "x" }).success).toBe(true);
    const r = loginSchema.safeParse({ email: "sai", password: "" });
    expect(r.success).toBe(false);
  });
  it("requires 8+ char password for new users", () => {
    const r = createUserSchema.safeParse({ fullName: "A", email: "a@b.vn", role: "SALES", password: "123" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].message).toBe("Mật khẩu tối thiểu 8 ký tự");
  });
});
