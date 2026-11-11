import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAdmin } from "@/shared/lib/services/session.service";
import { Logo } from "@/shared/ui/logo";

import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  robots: { index: false },
};

export default async function LoginPage() {
  if (await getAdmin()) redirect("/dashboard");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-night px-gutter py-10 text-white">
      <div className="w-full max-w-sm rounded-lg border border-white/10 bg-night-tile p-7">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo size={44} compact />
          <h1 className="text-xl">لوحة التحكم</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
