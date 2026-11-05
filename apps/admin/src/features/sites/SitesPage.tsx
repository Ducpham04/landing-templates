import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "../../api/client";
import { api } from "../../api/endpoints";
import type { Site } from "../../api/types";
import { Drawer } from "../../components/Drawer";
import { useToast } from "../../components/Toast";
import { Button, Card, EmptyState, ErrorState, Field, Input, PageHeader, Skeleton } from "../../components/ui";
import { siteSchema, type SiteForm } from "../../lib/schemas";

const API_ORIGIN = import.meta.env.VITE_PUBLIC_API_ORIGIN || window.location.origin;
const endpointFor = (key: string) => `${API_ORIGIN}/api/public/leads?siteKey=${key}`;

export function SitesPage() {
  const toast = useToast();
  const qc = useQueryClient();
  const sites = useQuery({ queryKey: ["sites"], queryFn: api.sites });
  const [editing, setEditing] = useState<Site | "new" | null>(null);
  const [confirmRegen, setConfirmRegen] = useState<number | null>(null);

  const regen = useMutation({
    mutationFn: api.regenerateKey,
    onSuccess: () => {
      setConfirmRegen(null);
      toast("Đã tạo key mới. Nhớ cập nhật endpoint trên landing.");
      qc.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: (e: Error) => toast(e.message, "error"),
  });

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Đã sao chép");
    } catch {
      toast("Không sao chép được, hãy chọn và sao chép thủ công", "error");
    }
  };

  return (
    <>
      <PageHeader
        title="Landing page"
        description="Mỗi landing có một site key. Dán endpoint vào cấu hình form của landing để lead đổ về LeadHub."
        actions={<Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" aria-hidden /> Thêm landing</Button>}
      />
      <Card className="[&>div]:p-0">
        {sites.isError ? (
          <ErrorState message={sites.error.message} onRetry={() => sites.refetch()} />
        ) : !sites.data ? (
          <div className="space-y-3 p-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : sites.data.length === 0 ? (
          <EmptyState title="Chưa có landing nào" description="Thêm landing đầu tiên để nhận site key." action={<Button onClick={() => setEditing("new")}>Thêm landing</Button>} />
        ) : (
          <ul className="divide-y divide-line">
            {sites.data.map((s) => (
              <li key={s.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{s.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${s.active ? "bg-primary-soft text-primary ring-primary/30" : "bg-ink/5 text-muted ring-line"}`}>
                        {s.active ? "Đang nhận lead" : "Tạm tắt"}
                      </span>
                    </div>
                    <p className="text-sm text-muted">{s.domain ?? "Chưa có domain"} · <span className="tabular">{s.leadCount}</span> lead</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setEditing(s)}>Sửa</Button>
                    {confirmRegen === s.id ? (
                      <>
                        <Button variant="danger" size="sm" loading={regen.isPending} onClick={() => regen.mutate(s.id)}>Xác nhận tạo key mới</Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmRegen(null)}>Huỷ</Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => setConfirmRegen(s.id)}>Tạo lại key</Button>
                    )}
                  </div>
                </div>
                {confirmRegen === s.id && <p className="mt-2 text-sm text-danger">Key cũ sẽ ngừng hoạt động ngay, form trên landing hiện tại sẽ không gửi được.</p>}
                {s.siteKey && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-bg px-3 py-2">
                    <code className="min-w-0 flex-1 truncate text-xs">{endpointFor(s.siteKey)}</code>
                    <button onClick={() => copy(endpointFor(s.siteKey!))} className="grid h-9 w-9 shrink-0 place-items-center rounded-md hover:bg-ink/5" aria-label={`Sao chép endpoint của ${s.name}`}>
                      <Copy className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Drawer open={editing !== null} title={editing === "new" ? "Thêm landing" : "Sửa landing"} onClose={() => setEditing(null)}>
        {editing !== null && <SiteFormView site={editing === "new" ? null : editing} onDone={() => setEditing(null)} />}
      </Drawer>
    </>
  );
}

function SiteFormView({ site, onDone }: { site: Site | null; onDone: () => void }) {
  const toast = useToast();
  const qc = useQueryClient();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<SiteForm>({
    resolver: zodResolver(siteSchema),
    defaultValues: { name: site?.name ?? "", domain: site?.domain ?? "", active: site?.active ?? true },
  });
  const onSubmit = handleSubmit(async (v) => {
    try {
      if (site) await api.updateSite(site.id, { name: v.name, domain: v.domain || undefined, active: v.active });
      else await api.createSite({ name: v.name, domain: v.domain || undefined });
      toast(site ? "Đã lưu landing" : "Đã thêm landing");
      qc.invalidateQueries({ queryKey: ["sites"] });
      onDone();
    } catch (e) {
      if (e instanceof ApiError && e.fieldErrors) {
        Object.entries(e.fieldErrors).forEach(([k, m]) => setError(k as keyof SiteForm, { message: m }));
      } else toast(e instanceof Error ? e.message : "Lưu không thành công", "error");
    }
  });
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Field label="Tên landing" htmlFor="site-name" error={errors.name?.message}>
        <Input id="site-name" aria-invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field label="Domain" htmlFor="site-domain" error={errors.domain?.message} hint="Không bắt buộc, ví dụ: du-an-abc.vn">
        <Input id="site-domain" aria-invalid={!!errors.domain} {...register("domain")} />
      </Field>
      {site && (
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" className="h-5 w-5 accent-[var(--primary)]" {...register("active")} />
          Đang nhận lead
        </label>
      )}
      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={isSubmitting}>{site ? "Lưu thay đổi" : "Thêm landing"}</Button>
        <Button type="button" variant="ghost" onClick={onDone}>Huỷ</Button>
      </div>
    </form>
  );
}
