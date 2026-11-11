"use server";

import { createProject, deleteProject, updateProject } from "../apis/dashboard.api";
import { projectScheme, type ProjectInput } from "../schemes/project.scheme";
import { runMutation } from "../services/mutation.service";
import type { ActionResult } from "../types/action";

export async function createProjectAction(input: ProjectInput): Promise<ActionResult> {
  const parsed = projectScheme.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };

  return runMutation(() => createProject(parsed.data));
}

export async function updateProjectAction(id: string, input: ProjectInput): Promise<ActionResult> {
  const parsed = projectScheme.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };

  return runMutation(() => updateProject(id, parsed.data));
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  return runMutation(() => deleteProject(id));
}
