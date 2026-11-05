import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../../api/endpoints";
import { Card, ErrorState, PageHeader, Skeleton, StatusBadge } from "../../components/ui";
import { formatNumber, formatPhone, relativeTime, STATUSES, STATUS_META } from "../../lib/format";
import { useAuth } from "../auth/AuthContext";
import { BarChart } from "./BarChart";

export function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const stats = useQuery({ queryKey: ["stats"], queryFn: api.stats, refetchInterval: 60_000 });
  const latest = useQuery({ queryKey: ["leads", { page: 0 }], queryFn: () => api.leads({ page: 0 }) });

  return (
    <>
      <PageHeader
        title={`Xin chào, ${user?.fullName.split(" ").pop()}`}
        description={isAdmin ? "Số liệu toàn bộ landing page." : "Số liệu trong phạm vi lead của bạn và lead chưa có người nhận."}
      />
      {stats.isError ? (
        <Card><ErrorState message={stats.error.message} onRetry={() => stats.refetch()} /></Card>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              ["Tổng lead", stats.data?.total],
              ["Mới hôm nay", stats.data?.newToday],
              ["Đang chăm sóc", stats.data?.inProgress],
              ["Tỉ lệ chốt", stats.data ? `${stats.data.conversionRate.toLocaleString("vi-VN")}%` : undefined],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-xl border border-line bg-surface p-4">
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="tabular mt-1 text-[28px] leading-tight font-semibold">
                  {value === undefined ? <Skeleton className="h-8 w-16" /> : typeof value === "number" ? formatNumber(value) : value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Card title="Lead 14 ngày gần nhất" className="lg:col-span-2">
              {stats.data ? <BarChart data={stats.data.daily} /> : <Skeleton className="h-44" />}
            </Card>
            <Card title="Theo trạng thái">
              {stats.data ? (
                <ul className="space-y-3">
                  {STATUSES.map((s) => {
                    const n = stats.data.byStatus[s] ?? 0;
                    const pct = stats.data.total ? (n / stats.data.total) * 100 : 0;
                    return (
                      <li key={s}>
                        <Link to={`/leads?status=${s}`} className="block rounded-md hover:bg-ink/5">
                          <div className="flex justify-between text-sm">
                            <span>{STATUS_META[s].label}</span>
                            <span className="tabular font-medium">{n}</span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-ink/8">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <Skeleton className="h-40" />
              )}
            </Card>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Card title="Theo landing">
              {stats.data?.bySite.length ? (
                <ul className="divide-y divide-line">
                  {stats.data.bySite.map((s) => (
                    <li key={s.siteId}>
                      <Link to={`/leads?siteId=${s.siteId}`} className="flex justify-between py-2.5 text-sm hover:text-primary">
                        <span>{s.siteName}</span>
                        <span className="tabular font-medium">{s.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : stats.data ? (
                <p className="text-sm text-muted">Chưa có lead nào.</p>
              ) : (
                <Skeleton className="h-24" />
              )}
            </Card>
            <Card title="Lead mới nhất" action={<Link to="/leads" className="text-sm font-medium text-primary">Xem tất cả</Link>} className="lg:col-span-2">
              {latest.data ? (
                latest.data.content.length ? (
                  <ul className="-my-2 divide-y divide-line">
                    {latest.data.content.slice(0, 5).map((l) => (
                      <li key={l.id}>
                        <Link to={`/leads/${l.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:text-primary">
                          <span className="min-w-0">
                            <span className="block truncate font-medium">{l.fullName}</span>
                            <span className="tabular block text-sm text-muted">{formatPhone(l.phone)} · {l.siteName}</span>
                          </span>
                          <span className="flex shrink-0 flex-col items-end gap-1">
                            <StatusBadge status={l.status} />
                            <span className="text-xs text-muted">{relativeTime(l.createdAt)}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted">Chưa có lead nào. Lead mới từ landing sẽ hiện ở đây.</p>
                )
              ) : (
                <Skeleton className="h-40" />
              )}
            </Card>
          </div>
        </>
      )}
    </>
  );
}
