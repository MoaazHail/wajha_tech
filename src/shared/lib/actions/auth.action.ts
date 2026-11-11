"use server";

import { redirect } from "next/navigation";

import { loginRequest } from "../apis/auth.api";
import { ApiError } from "../apis/client.api";
import { loginScheme } from "../schemes/auth.scheme";
import { clearSession, setSession } from "../services/session.service";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginScheme.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  try {
    const { token } = await loginRequest(parsed.data.email, parsed.data.password);
    await setSession(token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
    if (error instanceof ApiError && error.status === 429) return { error: "محاولات كثيرة، حاول لاحقاً" };
    return { error: "تعذّر الاتصال بالخادم، حاول مرة أخرى" };
  }

  // Outside the try block: redirect() works by throwing.
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
