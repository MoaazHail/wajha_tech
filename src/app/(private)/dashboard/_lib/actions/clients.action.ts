"use server";

import { createClient, deleteClient, updateClient } from "../apis/dashboard.api";
import { clientScheme, type ClientInput } from "../schemes/client.scheme";
import { runMutation } from "../services/mutation.service";
import type { ActionResult } from "../types/action";

export async function createClientAction(input: ClientInput): Promise<ActionResult> {
  const parsed = clientScheme.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };

  return runMutation(() => createClient(parsed.data));
}

export async function updateClientAction(id: string, input: ClientInput): Promise<ActionResult> {
  const parsed = clientScheme.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };

  return runMutation(() => updateClient(id, parsed.data));
}

export async function deleteClientAction(id: string): Promise<ActionResult> {
  return runMutation(() => deleteClient(id));
}
