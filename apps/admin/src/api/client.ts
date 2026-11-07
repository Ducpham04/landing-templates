import { session } from "../lib/session";
import type { AuthResponse } from "./types";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fieldErrors?: Record<string, string>,
  ) {
    super(message);
  }
}

let refreshing: Promise<boolean> | null = null;

/** Làm mới access token (gộp các lời gọi đồng thời thành 1). */
async function refreshTokens(): Promise<boolean> {
  const s = session.get();
  if (!s) return false;
  refreshing ??= fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: s.refreshToken }),
  })
    .then(async (r) => {
      if (!r.ok) return false;
      session.set((await r.json()) as AuthResponse);
      return true;
    })
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

async function toError(res: Response): Promise<ApiError> {
  try {
    const data = await res.json();
    return new ApiError(res.status, data.error ?? "ERROR", data.message ?? "Đã có lỗi xảy ra", data.fieldErrors);
  } catch {
    return new ApiError(res.status, "ERROR", res.status >= 500 ? "Máy chủ đang gặp sự cố, vui lòng thử lại" : "Đã có lỗi xảy ra");
  }
}

export async function request<T>(path: string, opts: RequestOptions = {}, retried = false): Promise<T> {
  const { body, auth = true, headers, ...rest } = opts;
  const h = new Headers(headers);
  if (body !== undefined) h.set("Content-Type", "application/json");
  const token = session.get()?.accessToken;
  if (auth && token) h.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`/api${path}`, { ...rest, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new ApiError(0, "NETWORK", "Không kết nối được máy chủ, kiểm tra mạng và thử lại");
  }

  if (res.status === 401 && auth && !retried && session.get()) {
    if (await refreshTokens()) return request<T>(path, opts, true);
    session.clear();
  }
  if (!res.ok) throw await toError(res);
  if (res.status === 204) return undefined as T;
  const type = res.headers.get("Content-Type") ?? "";
  return (type.includes("application/json") ? res.json() : res.blob()) as Promise<T>;
}

/** Tạo query string, bỏ các giá trị rỗng. */
export function qs(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "" || v === false) continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}
