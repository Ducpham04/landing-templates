import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "../../api/client";
import { api } from "../../api/endpoints";
import type { Activity, LeadStatus } from "../../api/types";
import { useToast } from "../../components/Toast";
import { Button, Card, ErrorState, Field, Select, Skeleton, StatusBadge, Textarea } from "../../components/ui";
import { formatDateTime, formatPhone, STATUSES, STATUS_META, zaloLink } from "../../lib/format";
import { noteSchema, type NoteForm } from "../../lib/schemas";
import { useAuth } from "../auth/AuthContext";

const EXTRA_LABELS: Record<string, string> = {
  interest: "Quan tâm",
  type: "Loại công trình",
  area: "Diện tích (m²)",
  budget: "Ngân sách",
  course: "Khoá học",
  age: "Độ tuổi",
  time: "Thời gian học thử",
};

function activityText(a: Activity): string {
  const label = (v?: string) => (v && v in STATUS_META ? STATUS_META[v as LeadStatus].label : v);
  switch (a.type) {
    case "CREATED":
      return `Khách gửi đăng ký từ ${a.toValue ?? "landing"}`;
    case "STATUS_CHANGED":
      return `Đổi trạng thái: ${label(a.fromValue)} → ${label(a.toValue)}`;
    case "ASSIGNED":
      return a.toValue ? `Giao cho ${a.toValue}` : `Bỏ người phụ trách${a.fromValue ? ` (${a.fromValue})` : ""}`;
    case "NOTE_ADDED":
      return "Thêm ghi chú";
  }
}

export function LeadDetailPage() {
  const id = Number(useParams().id);
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();

  const lead = useQuery({ queryKey: ["lead", id], queryFn: () => api.lead(id), enabled: id > 0 });
  const notes = useQuery({ queryKey: ["lead", id, "notes"], queryFn: () => api.notes(id), enabled: lead.isSuccess });
  const activities = useQuery({ queryKey: ["lead", id, "activities"], queryFn: () => api.activities(id), enabled: lead.isSuccess });
  const assignees = useQuery({ queryKey: ["assignees"], queryFn: api.assignees, enabled: isAdmin, staleTime: 300_000 });

  const onChanged = (msg: string) => {
    toast(msg);
    qc.invalidateQueries({ queryKey: ["lead", id] });
    qc.invalidateQueries({ queryKey: ["leads"] });
    qc.invalidateQueries({ queryKey: ["stats"] });
  };
  const onError = (e: Error) => toast(e.message, "error");

  const update = useMutation({
    mutationFn: (body: Parameters<typeof api.updateLead>[1]) => api.updateLead(id, body),
    onSuccess: () => onChanged("Đã cập nhật lead"),
    onError,
  });
  const claim = useMutation({ mutationFn: () => api.claimLead(id), onSuccess: () => onChanged("Bạn đã nhận xử lý lead này"), onError });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoteForm>({ resolver: zodResolver(noteSchema), defaultValues: { content: "" } });
  const addNote = useMutation({
    mutationFn: (content: string) => api.addNote(id, content),
    onSuccess: () => {
      reset();
      onChanged("Đã thêm ghi chú");
    },
    onError,
  });

  if (lead.isError) {
    const notFound = lead.error instanceof ApiError && lead.error.status === 404;
    return (
      <Card>
        {notFound ? (
          <div className="py-10 text-center">
            <p className="font-medium">Không tìm thấy lead</p>
            <p className="mt-1 text-sm text-muted">Lead không tồn tại hoặc đã được giao cho người khác.</p>
            <Link to="/leads" className="mt-4 inline-block text-sm font-medium text-primary">Về danh sách lead</Link>
          </div>
        ) : (
          <ErrorState message={lead.error.message} onRetry={() => lead.refetch()} />
        )}
      </Card>
    );
  }
  if (!lead.data) return <div className="space-y-4"><Skeleton className="h-20" /><Skeleton className="h-40" /><Skeleton className="h-40" /></div>;

  const l = lead.data;
  const busy = update.isPending || claim.isPending;
  const canClaim = !isAdmin && !l.assigneeId;
  const info: [string, string | undefined][] = [
    ["Email", l.email],
    ["Landing", l.siteName],
    ["Thời gian gửi", formatDateTime(l.createdAt)],
    ...Object.entries(l.extra ?? {}).map(([k, v]) => [EXTRA_LABELS[k] ?? k, v] as [string, string]),
    ["Lời nhắn", l.message],
    ["Nguồn (UTM)", [l.utmSource, l.utmMedium, l.utmCampaign].filter(Boolean).join(" / ") || undefined],
    ["Trang gửi", l.pageUrl],
  ];

  return (
    <>
      <Link to="/leads" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Danh sách lead
      </Link>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{l.fullName}</h1>
            <StatusBadge status={l.status} />
          </div>
          <p className="tabular mt-1 text-muted">{formatPhone(l.phone)}</p>
        </div>
        <div className="flex gap-2">
          <a href={`tel:${l.phone}`} className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-fg hover:bg-primary-hover">
            <Phone className="h-4 w-4" aria-hidden /> Gọi
          </a>
          <a href={zaloLink(l.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-surface px-4 text-sm font-medium hover:bg-bg">
            <MessageCircle className="h-4 w-4" aria-hidden /> Zalo
          </a>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card title="Xử lý">
            <p className="mb-2 text-sm font-medium" id="status-label">Trạng thái</p>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="radiogroup" aria-labelledby="status-label">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  role="radio"
                  aria-checked={l.status === s}
                  disabled={busy}
                  onClick={() => l.status !== s && update.mutate({ status: s })}
                  className={`h-10 shrink-0 rounded-lg border px-3.5 text-sm font-medium transition-colors disabled:opacity-60 ${
                    l.status === s ? "border-primary bg-primary text-primary-fg" : "border-line bg-surface hover:bg-bg"
                  }`}
                >
                  {STATUS_META[s].label}
                </button>
              ))}
            </div>

            <div className="mt-5 border-t border-line pt-4">
              {isAdmin ? (
                <label className="block max-w-sm text-sm">
                  <span className="mb-1.5 block font-medium">Người phụ trách</span>
                  <Select
                    value={l.assigneeId ?? ""}
                    disabled={busy}
                    onChange={(e) => update.mutate(e.target.value ? { assigneeId: Number(e.target.value) } : { unassign: true })}
                  >
                    <option value="">Chưa giao</option>
                    {assignees.data?.map((u) => <option key={u.id} value={u.id}>{u.fullName}{u.role === "ADMIN" ? " (Quản trị)" : ""}</option>)}
                  </Select>
                </label>
              ) : canClaim ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted">Lead này chưa có người phụ trách.</p>
                  <Button onClick={() => claim.mutate()} loading={claim.isPending}>Nhận xử lý</Button>
                </div>
              ) : (
                <p className="text-sm">
                  <span className="text-muted">Người phụ trách: </span>
                  <span className="font-medium">{l.assigneeId === user?.id ? "Bạn" : l.assigneeName}</span>
                </p>
              )}
            </div>
          </Card>

          <Card title="Ghi chú">
            <form onSubmit={handleSubmit((v) => addNote.mutate(v.content))} noValidate className="space-y-3">
              <Field label="Ghi chú mới" htmlFor="note" error={errors.content?.message}>
                <Textarea id="note" rows={3} placeholder="Nội dung cuộc gọi, hẹn lịch, nhu cầu của khách..." aria-invalid={!!errors.content} {...register("content")} />
              </Field>
              <Button type="submit" loading={addNote.isPending}>Thêm ghi chú</Button>
            </form>
            <ul className="mt-5 space-y-4">
              {notes.data?.map((n) => (
                <li key={n.id} className="border-l border-line pl-3">
                  <p className="text-sm whitespace-pre-wrap">{n.content}</p>
                  <p className="mt-1 text-xs text-muted">{n.authorName} · {formatDateTime(n.createdAt)}</p>
                </li>
              ))}
              {notes.data?.length === 0 && <li className="text-sm text-muted">Chưa có ghi chú.</li>}
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Thông tin">
            <dl className="space-y-3 text-sm">
              {info.filter(([, v]) => v).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-muted">{k}</dt>
                  <dd className="mt-0.5 break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card title="Lịch sử">
            <ol className="space-y-3">
              {activities.data?.map((a) => (
                <li key={a.id} className="text-sm">
                  <p>{activityText(a)}</p>
                  <p className="text-xs text-muted">{a.actorName ? `${a.actorName} · ` : ""}{formatDateTime(a.createdAt)}</p>
                </li>
              ))}
            </ol>
            {!activities.data && <Skeleton className="h-20" />}
          </Card>
        </div>
      </div>
    </>
  );
}
