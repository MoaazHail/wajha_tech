import "server-only";

import { redirect } from "next/navigation";

import { ApiError, apiRequest, type RequestOptions } from "@/shared/lib/apis/client.api";
import { requireToken } from "@/shared/lib/services/session.service";
import type { Booking, Client, Plan, Project, Settings, Stats } from "@/shared/lib/types/api";

/** Authenticated, never cached. An expired or rejected token sends the admin back to sign in. */
async function adminRequest<T>(path: string, options: RequestOptions = {}) {
  const token = await requireToken();

  try {
    return await apiRequest<T>(path, { ...options, token, revalidate: 0 });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/login");
    throw error;
  }
}

/** The API caps a page at 200, which is plenty for an agency's dashboard. */
const ALL = "?limit=200";

/** Sends one image to the API, which saves it as backend/images/<timestamp>.<ext> and returns its public path. */
export const uploadImage = (file: File) => {
  const body = new FormData();
  body.append("image", file);
  return adminRequest<{ path: string }>("/uploads/image", { method: "POST", body });
};

export const getStats = () => adminRequest<Stats>("/stats");

export const listPlans = () => adminRequest<Plan[]>("/plans");
export const listProjects = (limit = 200) => adminRequest<Project[]>(`/projects?limit=${limit}`);
export const listClients = () => adminRequest<Client[]>(`/users${ALL}`);

export interface PlanPayload {
  title: string;
  price: number;
  benefits: string[];
}

export const createPlan = (body: PlanPayload) => adminRequest<Plan>("/plans", { method: "POST", body });
export const updatePlan = (id: string, body: PlanPayload) =>
  adminRequest<Plan>(`/plans/${id}`, { method: "PATCH", body });
export const deletePlan = (id: string) => adminRequest<{ id: string }>(`/plans/${id}`, { method: "DELETE" });

export interface ProjectPayload {
  title: string;
  description: string;
  bio_image: string;
  live: string;
  status: Project["status"];
  date: string;
  featured: boolean;
  /** Client id, or "" for none. */
  user: string;
  /** Plan id, or "" for none. */
  plan: string;
}

export const createProject = (body: ProjectPayload) => adminRequest<Project>("/projects", { method: "POST", body });
export const updateProject = (id: string, body: ProjectPayload) =>
  adminRequest<Project>(`/projects/${id}`, { method: "PATCH", body });
export const deleteProject = (id: string) => adminRequest<{ id: string }>(`/projects/${id}`, { method: "DELETE" });

export interface ClientPayload {
  name: string;
  phone: string;
  email: string;
  /** Plan id, or "" for none. */
  plan: string;
}

export const createClient = (body: ClientPayload) => adminRequest<Client>("/users", { method: "POST", body });
export const updateClient = (id: string, body: ClientPayload) =>
  adminRequest<Client>(`/users/${id}`, { method: "PATCH", body });
export const deleteClient = (id: string) => adminRequest<{ id: string }>(`/users/${id}`, { method: "DELETE" });

export type SettingsPayload = Omit<Settings, "id" | "foundedYear"> & { foundedYear?: number };

/** The site settings are a single record: read and updated, never created or deleted by hand. */
export const getSettings = () => adminRequest<Settings>("/settings");
export const updateSettings = (body: SettingsPayload) => adminRequest<Settings>("/settings", { method: "PUT", body });

export interface BookingPayload {
  email: string;
  /** `YYYY-MM-DD` */
  date: string;
  status: Booking["status"];
  note: string;
}

export const listBookings = () => adminRequest<Booking[]>(`/bookings${ALL}`);
export const createAdminBooking = (body: BookingPayload) => adminRequest<Booking>("/bookings", { method: "POST", body });
export const updateAdminBooking = (id: string, body: BookingPayload) =>
  adminRequest<Booking>(`/bookings/${id}`, { method: "PATCH", body });
export const deleteAdminBooking = (id: string) => adminRequest<{ id: string }>(`/bookings/${id}`, { method: "DELETE" });
