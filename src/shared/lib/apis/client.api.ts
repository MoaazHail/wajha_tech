import "server-only";

/**
 * Thin fetch wrapper around the WAJHA REST API (`backend/`). Lives server-side
 * only so the base URL and the admin's token never reach the browser bundle.
 * The API answers `{ success, data, meta? }`; `data` is what callers get back.
 */
const BASE_URL = process.env.API_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** Seconds before the cached response is considered stale. `false` caches forever, 0 never caches. */
  revalidate?: number | false;
  tags?: string[];
  body?: unknown;
  /** Admin JWT, sent as a Bearer token. */
  token?: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!BASE_URL) throw new ApiError("API_URL is not configured", 500);

  const { revalidate = 300, tags, body, headers, token, ...init } = options;

  // FormData (file uploads) must go out as-is so fetch can set the multipart boundary itself.
  const isForm = body instanceof FormData;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body === undefined ? {} : { body: isForm ? body : JSON.stringify(body) }),
    ...(revalidate === 0 ? { cache: "no-store" as const } : { next: { revalidate, ...(tags ? { tags } : {}) } }),
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload) {
    throw new ApiError(payload?.message ?? `Request to ${path} failed`, response.status);
  }

  return payload.data;
}
