import "server-only";

import type { Landing } from "../types/api";
import { apiRequest } from "./client.api";

/** Cache tag the dashboard revalidates after any edit that shows on the landing page. */
export const LANDING_TAG = "landing";

/** One request for everything the landing page renders. Deduplicated across the layout and the page. */
export const getLanding = () => apiRequest<Landing>("/public/landing", { tags: [LANDING_TAG] });
