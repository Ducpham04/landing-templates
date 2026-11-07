import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const noteSchema = z.object({
  content: z.string().trim().min(1, "Vui lòng nhập nội dung ghi chú").max(2000, "Ghi chú tối đa 2000 ký tự"),
});
export type NoteForm = z.infer<typeof noteSchema>;

export const siteSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên landing").max(120, "Tên tối đa 120 ký tự"),
  domain: z
    .string()
    .trim()
    .regex(/^$|^[a-zA-Z0-9.-]{1,190}$/, "Domain chỉ gồm chữ, số, dấu chấm, gạch ngang (vd: du-an-abc.vn)"),
  active: z.boolean(),
});
export type SiteForm = z.infer<typeof siteSchema>;

const roleSchema = z.enum(["ADMIN", "SALES"]);

export const createUserSchema = z.object({
  fullName: z.string().trim().min(1, "Vui lòng nhập họ tên").max(120, "Họ tên tối đa 120 ký tự"),
  email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  role: roleSchema,
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự").max(72, "Mật khẩu tối đa 72 ký tự"),
});
export type CreateUserForm = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(1, "Vui lòng nhập họ tên").max(120, "Họ tên tối đa 120 ký tự"),
  role: roleSchema,
  active: z.boolean(),
});
export type UpdateUserForm = z.infer<typeof updateUserSchema>;
