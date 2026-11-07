import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { LeadFilters, LeadStatus } from "../../api/types";
import { STATUSES } from "../../lib/format";

/** Bộ lọc lead đồng bộ với URL (chia sẻ link được, giữ khi bấm Back). */
export function useLeadFilters() {
  const [sp, setSp] = useSearchParams();
  const filters: LeadFilters = useMemo(() => {
    const status = sp.get("status") as LeadStatus | null;
    const num = (k: string) => {
      const v = Number(sp.get(k));
      return Number.isFinite(v) && v > 0 ? v : undefined;
    };
    return {
      status: status && STATUSES.includes(status) ? status : undefined,
      siteId: num("siteId"),
      assigneeId: num("assigneeId"),
      unassigned: sp.get("unassigned") === "true" || undefined,
      q: sp.get("q") ?? undefined,
      from: sp.get("from") ?? undefined,
      to: sp.get("to") ?? undefined,
      page: Math.max(0, Number(sp.get("page")) || 0),
    };
  }, [sp]);

  const update = (patch: Partial<LeadFilters>) => {
    const next = { ...filters, page: 0, ...patch };
    const out = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) {
      if (v === undefined || v === "" || v === false || (k === "page" && v === 0)) continue;
      out.set(k, String(v));
    }
    setSp(out, { replace: true });
  };

  const activeCount = ["status", "siteId", "assigneeId", "unassigned", "from", "to"].filter(
    (k) => filters[k as keyof LeadFilters] !== undefined,
  ).length;

  return { filters, update, activeCount, reset: () => setSp(new URLSearchParams(), { replace: true }) };
}
