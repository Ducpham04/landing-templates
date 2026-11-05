import { shortDay } from "../../lib/format";

/** Biểu đồ cột SVG thuần (DECISIONS D11). */
export function BarChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const W = 100 / data.length;
  return (
    <figure>
      <div className="flex h-44 items-end gap-1 sm:gap-1.5" role="img" aria-label={`Lead theo ngày: ${data.map((d) => `${shortDay(d.date)} ${d.count}`).join(", ")}`}>
        {data.map((d) => (
          <div key={d.date} className="group flex h-full flex-1 flex-col items-center justify-end" style={{ maxWidth: `${W}%` }}>
            <span className="tabular mb-1 text-[11px] text-muted opacity-0 group-hover:opacity-100 sm:opacity-100">{d.count || ""}</span>
            <div
              className="w-full rounded-t-[3px] bg-primary/85 transition-colors group-hover:bg-primary"
              style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? 4 : 1 }}
              title={`${shortDay(d.date)}: ${d.count} lead`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1 sm:gap-1.5" aria-hidden>
        {data.map((d, i) => (
          <span key={d.date} className="tabular flex-1 text-center text-[11px] text-muted">
            {i % 2 === data.length % 2 ? shortDay(d.date) : ""}
          </span>
        ))}
      </div>
    </figure>
  );
}
