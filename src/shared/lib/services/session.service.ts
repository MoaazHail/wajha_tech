import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { meRequest } from "../apis/auth.api";
import { ApiError } from "../apis/client.api";
import type { Admin } from "../types/api";

const COOKIE = "wajha_token";
/** Matches the API's default JWT lifetime (JWT_EXPIRES_IN=1d). */
const MAX_AGE = 60 * 60 * 24;

export async function setSession(token: string) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export async function getToken() {
  return (await cookies()).get(COOKIE)?.value;
}

/** The signed-in admin, or null when there is no cookie or the API rejects the token. */
export async function getAdmin(): Promise<Admin | null> {
  const token = await getToken();
  if (!token) return null;

  try {
    return await meRequest(token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

/** For pages, layouts and actions that need a signed-in admin: returns the token or redirects to /login. */
export async function requireToken() {
  const token = await getToken();
  if (!token) redirect("/login");
  return token;
}
