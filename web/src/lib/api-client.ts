"use client";

/**
 * Thin typed fetch wrapper for the qrdock API (same-origin via Next rewrite).
 * Sends credentials + X-Requested-With on every call; normalizes errors.
 */

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(path, {
    method,
    credentials: "include",
    headers: {
      "x-requested-with": "fetch",
      ...(body !== undefined ? { "content-type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return undefined as T;
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON */
  }
  if (!res.ok) {
    const message =
      (data as { error?: string } | null)?.error ??
      `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  del: <T>(path: string) => request<T>("DELETE", path),
};

/* ---- shared API types ---- */

export interface ApiUser {
  email: string;
  plan: string;
}

export interface DynamicCode {
  id: string;
  slug: string;
  destination: string;
  name: string | null;
  active: 0 | 1;
  created_at: number;
  scans: number;
}

export interface SavedDesign {
  id: string;
  name: string;
  kind: "qr" | "barcode";
  config: Record<string, unknown>;
  updatedAt: number;
}

export interface DynamicStats {
  total: number;
  byDay: { day: string; n: number }[];
  byCountry: { country: string; n: number }[];
  byDevice: { device: string; n: number }[];
  rangeDays: number;
}
