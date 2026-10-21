import "server-only";

/**
 * Thin fetch wrapper around the agency backend. Lives server-side only so the
 * base URL and any token never reach the browser bundle.
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
  /** Seconds before the cached response is considered stale. */
  revalidate?: number | false;
  tags?: string[];
  body?: unknown;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!BASE_URL) throw new ApiError("API_URL is not configured", 500);

  const { revalidate = 300, tags, body, headers, ...init } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(process.env.API_TOKEN ? { Authorization: `Bearer ${process.env.API_TOKEN}` } : {}),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    next: { revalidate, ...(tags ? { tags } : {}) },
  });

  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed`, response.status);
  }

  return (await response.json()) as T;
}
