/** What a dashboard Server Action hands back to the form that called it. */
export type ActionResult = { ok: true } | { ok: false; error: string };
