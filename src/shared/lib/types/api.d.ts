/** Shapes returned by the WAJHA REST API (`backend/`). Every document carries `id`. */

export interface ApiImage {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ApiCta {
  label?: string;
  href?: string;
}

export interface Settings {
  id: string;
  name: string;
  wordmark: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  foundedYear?: number;
}

export type SectionType =
  | "hero"
  | "proof"
  | "features"
  | "package"
  | "services"
  | "process"
  | "portfolio"
  | "cta"
  | "footer";

export interface Content {
  id: string;
  section: string;
  title: string;
  body: string;
  icon?: string;
  num?: string;
  badge?: string;
  items: string[];
  price?: number;
  priceBefore?: number;
  currency?: string;
  cta?: ApiCta;
  image?: ApiImage;
  order: number;
  isActive: boolean;
}

export interface Section {
  id: string;
  key: string;
  name: string;
  type: SectionType;
  title: string;
  subtitle: string;
  order: number;
  isVisible: boolean;
}

export interface LandingSection extends Section {
  contents: Content[];
}

export type PlanKind = "package" | "website" | "profile";

export interface Plan {
  id: string;
  title: string;
  kind: PlanKind;
  price: number;
  priceBefore?: number;
  currency: string;
  benefits: string[];
  badge?: string;
  cta?: string;
  image?: ApiImage;
  order: number;
  isActive: boolean;
  /** Number of clients on this plan. Only present on the dashboard's plan list. */
  orders?: number;
}

export type ProjectStatus = "active" | "review" | "done";

export interface Project {
  id: string;
  title: string;
  description: string;
  bio_image: string;
  images: string[];
  live: string;
  status: ProjectStatus;
  /** ISO date. */
  date: string;
  featured: boolean;
  order: number;
  user?: { id: string; name: string; phone: string } | null;
  plan?: { id: string; title: string; kind: PlanKind } | null;
}

/** A client of the agency (the API calls it `user`). */
export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  plan?: { id: string; title: string; price: number; currency: string } | null;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled";

/** A meeting requested from the landing page. */
export interface Booking {
  id: string;
  email: string;
  /** Empty for bookings made before the phone field existed. */
  phone: string;
  /** ISO date; the picked day at 00:00 UTC. */
  date: string;
  status: BookingStatus;
  note?: string;
  createdAt?: string;
}

export interface Landing {
  settings: Settings | null;
  projects: Array<Pick<Project, "id" | "title" | "description" | "bio_image" | "images" | "live">>;
  plans: Plan[];
}

export interface Stats {
  projects: number;
  active: number;
  clients: number;
  revenue: number;
  projectsThisMonth: number;
  clientsThisMonth: number;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
}
