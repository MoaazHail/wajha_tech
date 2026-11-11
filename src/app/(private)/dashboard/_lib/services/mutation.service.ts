import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";

import { ApiError } from "@/shared/lib/apis/client.api";
import { LANDING_TAG } from "@/shared/lib/apis/landing.api";
import { requireToken } from "@/shared/lib/services/session.service";

import type { ActionResult } from "../types/action";

/**
 * Runs a write against the API for a Server Action: requires a session, turns
 * API errors into a message the form can show, and refreshes every screen that
 * could be showing the data, the public landing page included.
 */
export async function runMutation(write: () => Promise<unknown>): Promise<ActionResult> {
  await requireToken();

  try {
    await write();
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, error: error.message };
    // fetch() rejects with a TypeError when the API is unreachable: tell the form instead of crashing the page.
    if (error instanceof TypeError) return { ok: false, error: "تعذّر الاتصال بالخادم، حاول مرة أخرى" };
    throw error;
  }

  revalidatePath("/dashboard", "layout");
  revalidateTag(LANDING_TAG);
  return { ok: true };
}
