"use server";

import { updateSettings } from "../apis/dashboard.api";
import { settingsScheme, type SettingsInput } from "../schemes/settings.scheme";
import { runMutation } from "../services/mutation.service";
import type { ActionResult } from "../types/action";

export async function updateSettingsAction(input: SettingsInput): Promise<ActionResult> {
  const parsed = settingsScheme.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };

  const { foundedYear, ...rest } = parsed.data;
  return runMutation(() => updateSettings({ ...rest, ...(foundedYear === null ? {} : { foundedYear }) }));
}
