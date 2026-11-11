"use client";

import { useActionState, useState } from "react";

import { loginAction, type LoginState } from "@/shared/lib/actions/auth.action";
import { loginScheme } from "@/shared/lib/schemes/auth.scheme";

const fieldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-brand";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});

  const [clientError, setClientError] = useState<string | null>(null);

  return (
    <form
      action={formAction}
      noValidate
      className="grid gap-4"
      onSubmit={(event) => {
        // Validate in the browser first; an invalid form never reaches the server.
        const data = new FormData(event.currentTarget);
        const parsed = loginScheme.safeParse({ email: data.get("email"), password: data.get("password") });

        if (!parsed.success) {
          event.preventDefault();
          setClientError(parsed.error.issues[0]?.message ?? "بيانات غير صالحة");
          return;
        }
        setClientError(null);
      }}
    >
      <label className="grid gap-1.5 text-sm text-white/75">
        البريد الإلكتروني
        <input
          required
          name="email"
          type="email"
          autoComplete="username"
          dir="ltr"
          className={`${fieldClass} text-start`}
        />
      </label>

      <label className="grid gap-1.5 text-sm text-white/75">
        كلمة المرور
        <input
          required
          name="password"
          type="password"
          autoComplete="current-password"
          dir="ltr"
          className={`${fieldClass} text-start`}
        />
      </label>

      {(clientError ?? state.error) && (
        <p role="alert" className="text-sm text-red-300">
          {clientError ?? state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand px-4 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "جارٍ الدخول…" : "تسجيل الدخول"}
      </button>
    </form>
  );
}
