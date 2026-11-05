export type Role = "ADMIN" | "SALES";
export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "WON" | "LOST";
export type ActivityType = "CREATED" | "STATUS_CHANGED" | "ASSIGNED" | "NOTE_ADDED";

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface Assignee {
  id: number;
  fullName: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface LeadSummary {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  status: LeadStatus;
  siteId: number;
  siteName: string;
  assigneeId?: number;
  assigneeName?: string;
  utmSource?: string;
  createdAt: string;
}

export interface LeadDetail extends LeadSummary {
  message?: string;
  extra?: Record<string, string>;
  pageUrl?: string;
  utmMedium?: string;
  utmCampaign?: string;
  updatedAt: string;
}

export interface Note {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string;
}

export interface Activity {
  id: number;
  type: ActivityType;
  fromValue?: string;
  toValue?: string;
  actorId?: number;
  actorName?: string;
  createdAt: string;
}

export interface Site {
  id: number;
  name: string;
  domain?: string;
  siteKey?: string;
  active: boolean;
  leadCount: number;
  createdAt: string;
}

export interface Stats {
  total: number;
  newToday: number;
  inProgress: number;
  won: number;
  conversionRate: number;
  byStatus: Record<LeadStatus, number>;
  bySite: { siteId: number; siteName: string; count: number }[];
  daily: { date: string; count: number }[];
}

export interface LeadFilters {
  status?: LeadStatus;
  siteId?: number;
  assigneeId?: number;
  unassigned?: boolean;
  q?: string;
  from?: string;
  to?: string;
  page?: number;
}
