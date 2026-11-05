import type { LeadStatus } from "../api/types";

const TZ = "Asia/Ho_Chi_Minh";

export const STATUS_META: Record<LeadStatus, { label: string; className: string }> = {
  NEW: { label: "Mới", className: "bg-blue-50 text-blue-800 ring-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:ring-blue-900" },
  CONTACTED: { label: "Đã liên hệ", className: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-900" },
  QUALIFIED: { label: "Tiềm năng", className: "bg-violet-50 text-violet-800 ring-violet-200 dark:bg-violet-950 dark:text-violet-200 dark:ring-violet-900" },
  WON: { label: "Đã chốt", className: "bg-green-50 text-green-800 ring-green-200 dark:bg-green-950 dark:text-green-200 dark:ring-green-900" },
  LOST: { label: "Thất bại", className: "bg-gray-100 text-gray-700 ring-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700" },
};

export const STATUSES = Object.keys(STATUS_META) as LeadStatus[];

/** "5 phút trước", "Hôm qua 14:20", "03/11/2026" */
export function relativeTime(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  const diff = Math.round((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} ngày trước`;
  return formatDate(iso);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("vi-VN", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

/** 0912345678 → 0912 345 678 */
export function formatPhone(p: string): string {
  const d = p.replace(/\D/g, "");
  return d.length === 10 ? `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}` : p;
}

export const zaloLink = (phone: string) => `https://zalo.me/${phone.replace(/\D/g, "")}`;

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(n);
}

/** Tên hiển thị ngắn cho trục biểu đồ: "05/11" */
export function shortDay(isoDate: string): string {
  const [, m, d] = isoDate.split("-");
  return `${d}/${m}`;
}
