"use client";

import { useEffect } from "react";

import { StatusScreen } from "@/shared/components/status-screen";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen title="حدث خطأ غير متوقع" description="جرّب إعادة تحميل الصفحة مرة أخرى.">
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-brand px-7 py-3.5 font-display text-[15.5px] font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        إعادة المحاولة
      </button>
    </StatusScreen>
  );
}
