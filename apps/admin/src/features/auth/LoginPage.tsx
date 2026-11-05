import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../../api/client";
import { Button, Field, Input } from "../../components/ui";
import { loginSchema, type LoginForm } from "../../lib/schemas";
import { useAuth } from "./AuthContext";

export const DEMO_ACCOUNTS = [
  { label: "Quản trị (ADMIN)", email: "admin@leadhub.vn", password: "Admin@123" },
  { label: "Tư vấn viên (SALES)", email: "minh.tran@leadhub.vn", password: "Sales@123" },
];

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (user) return <Navigate to="/" replace />;

  const onSubmit = handleSubmit(async (v) => {
    setServerError(null);
    try {
      await login(v.email, v.password);
      const to = (location.state as { from?: string } | null)?.from ?? "/";
      navigate(to, { replace: true });
    } catch (e) {
      setServerError(e instanceof ApiError ? e.message : "Đăng nhập không thành công, vui lòng thử lại");
    }
  });

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-fg">L</span>
            LeadHub
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">Đăng nhập</h1>
          <p className="mt-1 text-sm text-muted">Quản lý khách hàng tiềm năng từ landing page.</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="username" aria-invalid={!!errors.email} aria-describedby="email-error" {...register("email")} />
          </Field>
          <Field label="Mật khẩu" htmlFor="password" error={errors.password?.message}>
            <Input id="password" type="password" autoComplete="current-password" aria-invalid={!!errors.password} aria-describedby="password-error" {...register("password")} />
          </Field>
          {serverError && (
            <p className="text-sm text-danger" role="alert">
              {serverError}
            </p>
          )}
          <Button type="submit" loading={isSubmitting} className="w-full">
            Đăng nhập
          </Button>
        </form>

        <div className="mt-8 rounded-xl border border-line bg-surface p-4">
          <p className="text-sm font-medium">Tài khoản demo</p>
          <ul className="mt-2 space-y-1">
            {DEMO_ACCOUNTS.map((a) => (
              <li key={a.email}>
                <button
                  type="button"
                  className="w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-ink/5"
                  onClick={() => {
                    setValue("email", a.email);
                    setValue("password", a.password);
                  }}
                >
                  <span className="font-medium">{a.label}</span>
                  <span className="block text-muted">{a.email} · {a.password}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
