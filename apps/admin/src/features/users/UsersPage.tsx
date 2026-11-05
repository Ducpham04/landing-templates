import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "../../api/client";
import { api } from "../../api/endpoints";
import type { User } from "../../api/types";
import { Drawer } from "../../components/Drawer";
import { useToast } from "../../components/Toast";
import { Button, Card, ErrorState, Field, Input, PageHeader, Select, Skeleton } from "../../components/ui";
import { formatDate } from "../../lib/format";
import { createUserSchema, updateUserSchema, type CreateUserForm, type UpdateUserForm } from "../../lib/schemas";
import { useAuth } from "../auth/AuthContext";

const ROLE_LABEL = { ADMIN: "Quản trị", SALES: "Tư vấn viên" } as const;

export function UsersPage() {
  const { user: me } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();
  const users = useQuery({ queryKey: ["users"], queryFn: api.users });
  const [editing, setEditing] = useState<User | "new" | null>(null);

  const toggle = useMutation({
    mutationFn: (u: User) => api.updateUser(u.id, { fullName: u.fullName, role: u.role, active: !u.active }),
    onSuccess: (u) => {
      toast(u.active ? `Đã mở khoá ${u.fullName}` : `Đã khoá ${u.fullName}`);
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["assignees"] });
    },
    onError: (e: Error) => toast(e.message, "error"),
  });

  return (
    <>
      <PageHeader
        title="Nhân viên"
        description="Tài khoản đăng nhập LeadHub. Tư vấn viên chỉ thấy lead của mình và lead chưa có người nhận."
        actions={<Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" aria-hidden /> Thêm nhân viên</Button>}
      />
      <Card className="[&>div]:p-0">
        {users.isError ? (
          <ErrorState message={users.error.message} onRetry={() => users.refetch()} />
        ) : !users.data ? (
          <div className="space-y-3 p-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : (
          <ul className="divide-y divide-line">
            {users.data.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{u.fullName}</span>
                    {u.id === me?.id && <span className="text-xs text-muted">(bạn)</span>}
                    {!u.active && <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">Đã khoá</span>}
                  </div>
                  <p className="truncate text-sm text-muted">{u.email} · {ROLE_LABEL[u.role]} · Tạo {formatDate(u.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setEditing(u)}>Sửa</Button>
                  {u.id !== me?.id && (
                    <Button variant={u.active ? "danger" : "secondary"} size="sm" loading={toggle.isPending && toggle.variables?.id === u.id} onClick={() => toggle.mutate(u)}>
                      {u.active ? "Khoá" : "Mở khoá"}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Drawer open={editing !== null} title={editing === "new" ? "Thêm nhân viên" : "Sửa nhân viên"} onClose={() => setEditing(null)}>
        {editing === "new" && <CreateUserView onDone={() => setEditing(null)} />}
        {editing && editing !== "new" && <EditUserView user={editing} isSelf={editing.id === me?.id} onDone={() => setEditing(null)} />}
      </Drawer>
    </>
  );
}

function useSaved(onDone: () => void) {
  const toast = useToast();
  const qc = useQueryClient();
  return (msg: string) => {
    toast(msg);
    qc.invalidateQueries({ queryKey: ["users"] });
    qc.invalidateQueries({ queryKey: ["assignees"] });
    onDone();
  };
}

function CreateUserView({ onDone }: { onDone: () => void }) {
  const toast = useToast();
  const saved = useSaved(onDone);
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { fullName: "", email: "", role: "SALES", password: "" },
  });
  const onSubmit = handleSubmit(async (v) => {
    try {
      await api.createUser(v);
      saved("Đã thêm nhân viên");
    } catch (e) {
      if (e instanceof ApiError && e.code === "EMAIL_EXISTS") setError("email", { message: e.message });
      else if (e instanceof ApiError && e.fieldErrors) Object.entries(e.fieldErrors).forEach(([k, m]) => setError(k as keyof CreateUserForm, { message: m }));
      else toast(e instanceof Error ? e.message : "Lưu không thành công", "error");
    }
  });
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Field label="Họ tên" htmlFor="u-name" error={errors.fullName?.message}><Input id="u-name" aria-invalid={!!errors.fullName} {...register("fullName")} /></Field>
      <Field label="Email" htmlFor="u-email" error={errors.email?.message}><Input id="u-email" type="email" autoComplete="off" aria-invalid={!!errors.email} {...register("email")} /></Field>
      <Field label="Vai trò" htmlFor="u-role"><Select id="u-role" {...register("role")}><option value="SALES">Tư vấn viên</option><option value="ADMIN">Quản trị</option></Select></Field>
      <Field label="Mật khẩu tạm" htmlFor="u-pass" error={errors.password?.message} hint="Tối thiểu 8 ký tự. Gửi riêng cho nhân viên.">
        <Input id="u-pass" type="password" autoComplete="new-password" aria-invalid={!!errors.password} {...register("password")} />
      </Field>
      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={isSubmitting}>Thêm nhân viên</Button>
        <Button type="button" variant="ghost" onClick={onDone}>Huỷ</Button>
      </div>
    </form>
  );
}

function EditUserView({ user, isSelf, onDone }: { user: User; isSelf: boolean; onDone: () => void }) {
  const toast = useToast();
  const saved = useSaved(onDone);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { fullName: user.fullName, role: user.role, active: user.active },
  });
  const onSubmit = handleSubmit(async (v) => {
    try {
      await api.updateUser(user.id, v);
      saved("Đã lưu thay đổi");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Lưu không thành công", "error");
    }
  });
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <p className="text-sm text-muted">{user.email}</p>
      <Field label="Họ tên" htmlFor="e-name" error={errors.fullName?.message}><Input id="e-name" aria-invalid={!!errors.fullName} {...register("fullName")} /></Field>
      {isSelf ? (
        <Field label="Vai trò" htmlFor="e-role" hint="Không thể tự đổi vai trò của chính mình.">
          <Input id="e-role" value={ROLE_LABEL[user.role]} readOnly />
        </Field>
      ) : (
        <Field label="Vai trò" htmlFor="e-role">
          <Select id="e-role" {...register("role")}><option value="SALES">Tư vấn viên</option><option value="ADMIN">Quản trị</option></Select>
        </Field>
      )}
      {!isSelf && (
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" className="h-5 w-5 accent-[var(--primary)]" {...register("active")} /> Đang hoạt động
        </label>
      )}
      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={isSubmitting}>Lưu thay đổi</Button>
        <Button type="button" variant="ghost" onClick={onDone}>Huỷ</Button>
      </div>
    </form>
  );
}
