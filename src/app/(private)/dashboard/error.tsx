"use client";

import { useEffect } from "react";

/** Keeps the sidebar on screen when a dashboard page cannot load (for example the API is unreachable). */
export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="grid max-w-xl gap-4 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-white">
      <h2 className="text-lg">تعذّر تحميل الصفحة</h2>
      <p className="text-white/75">قد يكون الخادم غير متاح لحظياً. جرّب مرة أخرى.</p>
      <button
        type="button"
        onClick={reset}
        className="w-full rounded-md bg-brand px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-brand-dark sm:w-auto sm:justify-self-start"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}
