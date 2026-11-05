import { qs, request } from "./client";
import type {
  Activity, Assignee, AuthResponse, LeadDetail, LeadFilters, LeadStatus, LeadSummary, Note, Page, Role, Site, Stats, User,
} from "./types";

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: { email, password }, auth: false }),
  logout: (refreshToken: string) =>
    request<void>("/auth/logout", { method: "POST", body: { refreshToken }, auth: false }),
  me: () => request<User>("/auth/me"),

  stats: () => request<Stats>("/dashboard/stats"),

  leads: (f: LeadFilters) => request<Page<LeadSummary>>(`/leads${qs({ ...f, size: 20 })}`),
  lead: (id: number) => request<LeadDetail>(`/leads/${id}`),
  updateLead: (id: number, body: { status?: LeadStatus; assigneeId?: number; unassign?: boolean }) =>
    request<LeadDetail>(`/leads/${id}`, { method: "PATCH", body }),
  claimLead: (id: number) => request<LeadDetail>(`/leads/${id}/claim`, { method: "POST" }),
  notes: (id: number) => request<Note[]>(`/leads/${id}/notes`),
  addNote: (id: number, content: string) => request<Note>(`/leads/${id}/notes`, { method: "POST", body: { content } }),
  activities: (id: number) => request<Activity[]>(`/leads/${id}/activities`),
  exportLeads: (f: LeadFilters) => request<Blob>(`/leads/export${qs({ ...f, page: undefined })}`),

  sites: () => request<Site[]>("/sites"),
  createSite: (body: { name: string; domain?: string }) => request<Site>("/sites", { method: "POST", body }),
  updateSite: (id: number, body: { name: string; domain?: string; active: boolean }) =>
    request<Site>(`/sites/${id}`, { method: "PUT", body }),
  regenerateKey: (id: number) => request<Site>(`/sites/${id}/regenerate-key`, { method: "POST" }),

  users: () => request<User[]>("/users"),
  assignees: () => request<Assignee[]>("/users/assignees"),
  createUser: (body: { fullName: string; email: string; role: Role; password: string }) =>
    request<User>("/users", { method: "POST", body }),
  updateUser: (id: number, body: { fullName: string; role: Role; active: boolean }) =>
    request<User>(`/users/${id}`, { method: "PUT", body }),
};
