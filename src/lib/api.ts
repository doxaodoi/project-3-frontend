/**
 * API client for the Reclaim backend.
 * Handles JWT token storage and auto-attaches Authorization headers.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/* ---------- Token helpers ---------- */

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("reclaim_token");
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("reclaim_refresh");
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("reclaim_token", access);
  localStorage.setItem("reclaim_refresh", refresh);
}

export function clearTokens() {
  localStorage.removeItem("reclaim_token");
  localStorage.removeItem("reclaim_refresh");
}

/* ---------- Fetch wrapper ---------- */

export class ApiError extends Error {
  status: number;
  detail?: string;
  constructor(status: number, message: string, detail?: string) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser sets multipart boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || res.statusText, body.detail);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

/* ---------- Auth ---------- */

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}

export interface UserDTO {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
}

export const auth = {
  register: (data: { fullName: string; email: string; phone?: string; password: string }) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<UserDTO>("/api/auth/me"),

  updateProfile: (data: { fullName?: string; phone?: string }) =>
    request<UserDTO>("/api/auth/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

/* ---------- Items ---------- */

export interface PhotoDTO {
  id: number;
  url: string;
  isPrimary: boolean;
}

export interface ItemDTO {
  id: number;
  type: "LOST" | "FOUND";
  title: string;
  description: string | null;
  category: string | null;
  categoryId: number | null;
  location: string | null;
  locationId: number | null;
  heldAt: string | null;
  latitude: number | null;
  longitude: number | null;
  eventDate: string | null;
  status: string;
  color: string | null;
  brand: string | null;
  isAiDescribed: boolean;
  tags: string[];
  photos: PhotoDTO[];
  reporter: UserDTO;
  matchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageDTO<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const items = {
  list: (params?: Record<string, string | number>) => {
    const qs = params
      ? "?" + new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v != null && v !== "")
            .map(([k, v]) => [k, String(v)]),
        ).toString()
      : "";
    return request<PageDTO<ItemDTO>>(`/api/items${qs}`);
  },

  get: (id: number | string) => request<ItemDTO>(`/api/items/${id}`),

  create: (data: Record<string, unknown>) =>
    request<ItemDTO>("/api/items", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Record<string, unknown>) =>
    request<ItemDTO>(`/api/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/api/items/${id}`, { method: "DELETE" }),

  updateStatus: (id: number, status: string) =>
    request<ItemDTO>(`/api/items/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  mine: () => request<ItemDTO[]>("/api/items/mine"),
};

/* ---------- Matches ---------- */

export interface MatchDTO {
  id: number;
  lostItem: ItemDTO;
  foundItem: ItemDTO;
  score: number;
  aiExplanation: string | null;
  status: string;
  createdAt: string;
}

export const matches = {
  forItem: (itemId: number | string) =>
    request<MatchDTO[]>(`/api/items/${itemId}/matches`),

  explain: (matchId: number) =>
    request<{ explanation: string }>(`/api/matches/${matchId}/explanation`),

  confirm: (matchId: number) =>
    request<MatchDTO>(`/api/matches/${matchId}/confirm`, { method: "POST" }),

  dismiss: (matchId: number) =>
    request<MatchDTO>(`/api/matches/${matchId}/dismiss`, { method: "POST" }),
};

/* ---------- Claims ---------- */

export interface ClaimDTO {
  id: number;
  itemId: number;
  itemTitle: string;
  claimant: UserDTO;
  status: string;
  message: string;
  reviewedAt: string | null;
  createdAt: string;
}

export const claims = {
  create: (itemId: number, message: string) =>
    request<ClaimDTO>(`/api/items/${itemId}/claims`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  forItem: (itemId: number) =>
    request<ClaimDTO[]>(`/api/items/${itemId}/claims`),

  mine: () => request<ClaimDTO[]>("/api/claims/mine"),

  update: (claimId: number, status: string) =>
    request<ClaimDTO>(`/api/claims/${claimId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

/* ---------- Conversations ---------- */

export interface ConversationDTO {
  id: number;
  itemId: number | null;
  itemTitle: string | null;
  otherUser: UserDTO;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface MessageDTO {
  id: number;
  senderId: number;
  senderName: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export const conversations = {
  list: () => request<ConversationDTO[]>("/api/conversations"),

  messages: (convId: number) =>
    request<MessageDTO[]>(`/api/conversations/${convId}/messages`),

  send: (convId: number, body: string) =>
    request<MessageDTO>(`/api/conversations/${convId}/messages`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  markRead: (msgId: number) =>
    request<void>(`/api/conversations/messages/${msgId}/read`, { method: "PATCH" }),
};

/* ---------- Notifications ---------- */

export interface NotificationDTO {
  id: number;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export const notifications = {
  list: () => request<NotificationDTO[]>("/api/notifications"),

  unreadCount: () =>
    request<{ count: number }>("/api/notifications/unread-count"),

  markRead: (id: number) =>
    request<void>(`/api/notifications/${id}/read`, { method: "PATCH" }),

  markAllRead: () =>
    request<void>("/api/notifications/read-all", { method: "PATCH" }),
};

/* ---------- AI ---------- */

export interface AiDescribeResult {
  title: string;
  description: string;
  category: string;
  color: string | null;
  brand: string | null;
  tags: string[];
}

export const ai = {
  describe: (photo: File) => {
    const fd = new FormData();
    fd.append("photo", photo);
    return request<AiDescribeResult>("/api/ai/describe", {
      method: "POST",
      body: fd,
    });
  },

  status: () => request<{ available: boolean }>("/api/ai/status"),

  parseSearch: (query: string) =>
    request<{ filters: Record<string, string>; aiParsed: boolean }>(
      "/api/ai/parse-search",
      {
        method: "POST",
        body: JSON.stringify({ query }),
      },
    ),
};

/* ---------- Reference data ---------- */

export interface CategoryDTO {
  id: number;
  name: string;
  icon: string;
}

export interface LocationDTO {
  id: number;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
}

export const categories = {
  list: () => request<CategoryDTO[]>("/api/categories"),
};

export const locations = {
  list: () => request<LocationDTO[]>("/api/locations"),
};

/* ---------- Admin ---------- */

export interface AdminStats {
  totalItems: number;
  lostCount: number;
  foundCount: number;
  resolvedCount: number;
  pendingClaims: number;
  totalUsers: number;
  resolutionRate: number;
  byCategory: Record<string, number>;
  byLocation: Record<string, number>;
}

export const admin = {
  stats: () => request<AdminStats>("/api/admin/stats"),
  items: (page = 0, size = 20) =>
    request<PageDTO<ItemDTO>>(`/api/admin/items?page=${page}&size=${size}`),
  users: () => request<UserDTO[]>("/api/admin/users"),
  claims: () => request<ClaimDTO[]>("/api/admin/claims"),
};
