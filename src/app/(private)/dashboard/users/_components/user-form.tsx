"use client";

import { useState, useTransition } from "react";

import { Dialog } from "@/shared/components/dialog";
import type { Client, Plan } from "@/shared/lib/types/api";

import type { ClientInput } from "../../_lib/schemes/client.scheme";
import type { ActionResult } from "../../_lib/types/action";

interface UserFormProps {
  open: boolean;
  /** The client being edited; leave empty to add a new one. */
  client?: Client | null;
  plans: ReadonlyArray<Plan>;
  onClose: () => void;
  onSubmit: (data: ClientInput) => Promise<ActionResult>;
}

const fieldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px] outline-none transition-colors focus:border-brand";

const toInput = (client?: Client | null): ClientInput => ({
  name: client?.name ?? "",
  phone: client?.phone ?? "",
  email: client?.email ?? "",
  plan: client?.plan?.id ?? "",
});

export function UserForm({ open, client, plans, onClose, onSubmit }: UserFormProps) {
  return (
    <Dialog open={open} onClose={onClose} title={client ? "تعديل العميل" : "إضافة عميل"}>
      {/* Keyed so each open starts from the right values. */}
      <FormBody key={client?.id ?? "new"} client={client} plans={plans} onClose={onClose} onSubmit={onSubmit} />
    </Dialog>
  );
}

function FormBody({ client, plans, onClose, onSubmit }: Omit<UserFormProps, "open">) {
  const [values, setValues] = useState<ClientInput>(() => toInput(client));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof ClientInput>(key: K, value: ClientInput[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);

        startTransition(async () => {
          const result = await onSubmit(values);
          if (result.ok) onClose();
          else setError(result.error);
        });
      }}
    >
      <label className="grid gap-1.5 text-sm text-muted">
        اسم العميل
        <input
          required
          value={values.name}
          onChange={(event) => set("name", event.target.value)}
          className={fieldClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm text-muted">
          الجوال
          <input
            required
            type="tel"
            dir="ltr"
            value={values.phone}
            onChange={(event) => set("phone", event.target.value)}
            className={`${fieldClass} text-start`}
          />
        </label>

        <label className="grid gap-1.5 text-sm text-muted">
          البريد الإلكتروني
          <input
            type="email"
            dir="ltr"
            value={values.email}
            onChange={(event) => set("email", event.target.value)}
            className={`${fieldClass} text-start`}
          />
        </label>
      </div>

      <label className="grid gap-1.5 text-sm text-muted">
        الخطة
        <select value={values.plan} onChange={(event) => set("plan", event.target.value)} className={fieldClass}>
          <option value="">بدون خطة</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.title}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-line px-4 py-2 text-[15px] transition-colors hover:bg-surface"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand px-4 py-2 text-[15px] font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {client ? "حفظ" : "إضافة"}
        </button>
      </div>
    </form>
  );
}
