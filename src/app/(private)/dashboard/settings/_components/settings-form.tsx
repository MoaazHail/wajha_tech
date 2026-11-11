"use client";

import { useState, useTransition } from "react";

import type { Settings } from "@/shared/lib/types/api";

import { updateSettingsAction } from "../../_lib/actions/settings.action";
import type { SettingsInput } from "../../_lib/schemes/settings.scheme";

const fieldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-brand";
const ltrFieldClass = `${fieldClass} text-start`;
const labelClass = "grid gap-1.5 text-sm text-white/70";

const toInput = (settings: Settings): SettingsInput => ({
  name: settings.name ?? "",
  wordmark: settings.wordmark ?? "",
  tagline: settings.tagline ?? "",
  description: settings.description ?? "",
  phone: settings.phone ?? "",
  email: settings.email ?? "",
  whatsapp: settings.whatsapp ?? "",
  address: settings.address ?? "",
  foundedYear: settings.foundedYear ?? null,
});

/** Edits the site settings: the contact details and copy shown in the header, footer and metadata. */
export function SettingsForm({ settings }: { settings: Settings }) {
  const [values, setValues] = useState<SettingsInput>(() => toInput(settings));
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof SettingsInput>(key: K, value: SettingsInput[K]) => {
    setMessage(null);
    setValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <form
      className="grid max-w-3xl gap-5 rounded-lg border border-white/10 bg-night-tile p-4 sm:p-6 "
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(null);

        startTransition(async () => {
          const result = await updateSettingsAction(values);
          setMessage(result.ok ? { ok: true, text: "تم حفظ الإعدادات" } : { ok: false, text: result.error });
        });
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          اسم الموقع
          <input required value={values.name} onChange={(e) => set("name", e.target.value)} className={fieldClass} />
        </label>
        <label className={labelClass}>
          الشعار النصي (Wordmark)
          <input dir="ltr" value={values.wordmark} onChange={(e) => set("wordmark", e.target.value)} className={ltrFieldClass} />
        </label>
      </div>

      <label className={labelClass}>
        العبارة التعريفية
        <input value={values.tagline} onChange={(e) => set("tagline", e.target.value)} className={fieldClass} />
      </label>

      <label className={labelClass}>
        الوصف
        <textarea rows={3} value={values.description} onChange={(e) => set("description", e.target.value)} className={fieldClass} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          الجوال
          <input type="tel" dir="ltr" value={values.phone} onChange={(e) => set("phone", e.target.value)} className={ltrFieldClass} />
        </label>
        <label className={labelClass}>
          البريد الإلكتروني
          <input type="email" dir="ltr" value={values.email} onChange={(e) => set("email", e.target.value)} className={ltrFieldClass} />
        </label>
      </div>

      <label className={labelClass}>
        رابط واتساب (يُستخدم في أزرار الطلب بالصفحة الرئيسية)
        <input
          dir="ltr"
          value={values.whatsapp}
          onChange={(e) => set("whatsapp", e.target.value)}
          placeholder="https://wa.me/966500000000"
          className={ltrFieldClass}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-[1fr_10rem]">
        <label className={labelClass}>
          العنوان
          <input value={values.address} onChange={(e) => set("address", e.target.value)} className={fieldClass} />
        </label>
        <label className={labelClass}>
          سنة التأسيس
          <input
            type="number"
            inputMode="numeric"
            dir="ltr"
            value={values.foundedYear ?? ""}
            onChange={(e) => set("foundedYear", e.target.value === "" ? null : Number(e.target.value))}
            className={ltrFieldClass}
          />
        </label>
      </div>

      {message && (
        <p role={message.ok ? "status" : "alert"} className={message.ok ? "text-sm text-green-400" : "text-sm text-red-300"}>
          {message.text}
        </p>
      )}

      <div className="flex">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-brand px-6 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto"
        >
          {pending ? "جارٍ الحفظ…" : "حفظ التغييرات"}
        </button>
      </div>
    </form>
  );
}
