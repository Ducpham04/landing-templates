import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Download, MessageCircle, Phone, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../api/endpoints";
import { useToast } from "../../components/Toast";
import { Button, Card, EmptyState, ErrorState, Input, PageHeader, Pagination, Select, Skeleton, StatusBadge } from "../../components/ui";
import { formatPhone, relativeTime, STATUSES, STATUS_META, zaloLink } from "../../lib/format";
import { useAuth } from "../auth/AuthContext";
import { useLeadFilters } from "./useLeadFilters";

export function LeadsPage() {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const { filters, update, activeCount, reset } = useLeadFilters();
  const [q, setQ] = useState(filters.q ?? "");
  const [showFilters, setShowFilters] = useState(activeCount > 0);
  const [exporting, setExporting] = useState(false);

  // Tìm kiếm có debounce 350ms
  useEffect(() => {
    const t = setTimeout(() => {
      if ((filters.q ?? "") !== q.trim()) update({ q: q.trim() || undefined });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const leads = useQuery({ queryKey: ["leads", filters], queryFn: () => api.leads(filters), placeholderData: keepPreviousData });
  const sites = useQuery({ queryKey: ["sites"], queryFn: api.sites, staleTime: 300_000 });
  const assignees = useQuery({ queryKey: ["assignees"], queryFn: api.assignees, staleTime: 300_000 });

  const doExport = async () => {
    setExporting(true);
    try {
      const blob = await api.exportLeads(filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Xuất CSV không thành công", "error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Lead"
        description={leads.data ? `${leads.data.totalElements.toLocaleString("vi-VN")} khách hàng tiềm năng` : undefined}
        actions={
          isAdmin && (
            <Button variant="secondary" onClick={doExport} loading={exporting}>
              <Download className="h-4 w-4" aria-hidden /> Xuất CSV
            </Button>
          )
        }
      />

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input type="search" placeholder="Tìm theo tên, SĐT, email" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" aria-label="Tìm kiếm lead" />
        </div>
        <Button variant="secondary" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters} aria-controls="lead-filters">
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Bộ lọc</span>
          {activeCount > 0 && <span className="tabular rounded-full bg-primary px-1.5 text-xs text-primary-fg">{activeCount}</span>}
        </Button>
      </div>

      {showFilters && (
        <div id="lead-filters" className="mb-4 grid grid-cols-2 gap-3 rounded-xl border border-line bg-surface p-4 lg:grid-cols-6">
          <label className="col-span-2 text-sm lg:col-span-1">
            <span className="mb-1 block font-medium">Trạng thái</span>
            <Select value={filters.status ?? ""} onChange={(e) => update({ status: (e.target.value || undefined) as never })}>
              <option value="">Tất cả</option>
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
            </Select>
          </label>
          <label className="col-span-2 text-sm lg:col-span-1">
            <span className="mb-1 block font-medium">Landing</span>
            <Select value={filters.siteId ?? ""} onChange={(e) => update({ siteId: Number(e.target.value) || undefined })}>
              <option value="">Tất cả</option>
              {sites.data?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </label>
          <label className="col-span-2 text-sm lg:col-span-2">
            <span className="mb-1 block font-medium">Phụ trách</span>
            <Select
              value={filters.unassigned ? "none" : filters.assigneeId ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                update(v === "none" ? { unassigned: true, assigneeId: undefined } : { unassigned: undefined, assigneeId: Number(v) || undefined });
              }}
            >
              <option value="">Tất cả</option>
              <option value="none">Chưa có người nhận</option>
              {assignees.data?.map((u) => <option key={u.id} value={u.id}>{u.fullName}</option>)}
            </Select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Từ ngày</span>
            <Input type="date" value={filters.from ?? ""} onChange={(e) => update({ from: e.target.value || undefined })} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Đến ngày</span>
            <Input type="date" value={filters.to ?? ""} onChange={(e) => update({ to: e.target.value || undefined })} />
          </label>
          {activeCount > 0 && (
            <div className="col-span-2 lg:col-span-6">
              <button className="text-sm font-medium text-primary underline-offset-4 hover:underline" onClick={() => { setQ(""); reset(); }}>
                Xoá bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      <Card className="overflow-hidden [&>div]:p-0">
        {leads.isError ? (
          <ErrorState message={leads.error.message} onRetry={() => leads.refetch()} />
        ) : !leads.data ? (
          <div className="space-y-3 p-4">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : leads.data.content.length === 0 ? (
          <EmptyState
            title={filters.q || activeCount ? "Không có lead phù hợp" : "Chưa có lead nào"}
            description={filters.q || activeCount ? "Thử đổi từ khoá hoặc bộ lọc." : "Khi khách gửi form trên landing page, lead sẽ xuất hiện ở đây."}
          />
        ) : (
          <>
            {/* Desktop: bảng */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b border-line text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Khách hàng</th>
                  <th scope="col" className="px-4 py-3 font-medium">Landing</th>
                  <th scope="col" className="px-4 py-3 font-medium">Trạng thái</th>
                  <th scope="col" className="px-4 py-3 font-medium">Phụ trách</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {leads.data.content.map((l) => (
                  <tr key={l.id} className="hover:bg-bg">
                    <td className="px-4 py-3">
                      <Link to={`/leads/${l.id}`} className="font-medium hover:text-primary">{l.fullName}</Link>
                      <div className="tabular text-muted">{formatPhone(l.phone)}</div>
                    </td>
                    <td className="px-4 py-3">{l.siteName}</td>
                    <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-4 py-3">{l.assigneeName ?? <span className="text-muted">Chưa nhận</span>}</td>
                    <td className="px-4 py-3 text-right text-muted" title={l.createdAt}>{relativeTime(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Mobile: danh sách thẻ dòng */}
            <ul className="divide-y divide-line md:hidden">
              {leads.data.content.map((l) => (
                <li key={l.id} className="flex items-center gap-2 px-4 py-3">
                  <Link to={`/leads/${l.id}`} className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{l.fullName}</span>
                      <StatusBadge status={l.status} />
                    </div>
                    <div className="tabular truncate text-sm text-muted">{formatPhone(l.phone)} · {l.siteName}</div>
                    <div className="text-xs text-muted">{relativeTime(l.createdAt)}{l.assigneeName ? ` · ${l.assigneeName}` : " · Chưa nhận"}</div>
                  </Link>
                  <a href={`tel:${l.phone}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line text-primary" aria-label={`Gọi ${l.fullName}`}>
                    <Phone className="h-5 w-5" aria-hidden />
                  </a>
                  <a href={zaloLink(l.phone)} target="_blank" rel="noopener noreferrer" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line text-primary" aria-label={`Nhắn Zalo ${l.fullName}`}>
                    <MessageCircle className="h-5 w-5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
            <Pagination page={leads.data.page} totalPages={leads.data.totalPages} onChange={(p) => update({ page: p })} />
          </>
        )}
      </Card>
    </>
  );
}
