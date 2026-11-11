import "server-only";

import type { Admin } from "../types/api";
import { apiRequest } from "./client.api";

export const loginRequest = (email: string, password: string) =>
  apiRequest<{ token: string; admin: Admin }>("/auth/login", {
    method: "POST",
    body: { email, password },
    revalidate: 0,
  });

export const meRequest = (token: string) => apiRequest<Admin>("/auth/me", { token, revalidate: 0 });
