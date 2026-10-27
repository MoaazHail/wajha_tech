"use client";

import { useState } from "react";

import { Dialog } from "@/shared/components/dialog";

import {
  PROJECT_PLANS,
  PROJECT_STATUS,
  type Project,
  type ProjectStatus,
} from "../../_lib/constants/dashboard-data.constant";

type ProjectInput = Omit<Project, "id">;

interface ProjectFormProps {
  open: boolean;
  /** The project being edited; leave empty to add a new one. */
  project?: Project | null;
  onClose: () => void;
  onSubmit: (data: ProjectInput) => void;
}

const EMPTY: ProjectInput = {
  name: "",
  client: "",
  plan: PROJECT_PLANS[0],
  status: "active",
  date: new Date().toISOString().slice(0, 10),
};

const fieldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px] outline-none transition-colors focus:border-brand";

export function ProjectForm({ open, project, onClose, onSubmit }: ProjectFormProps) {
  return (
    <Dialog open={open} onClose={onClose} title={project ? "تعديل المشروع" : "إضافة مشروع"}>
      {/* Keyed so each open starts from the right values. */}
      <FormBody key={project?.id ?? "new"} project={project} onClose={onClose} onSubmit={onSubmit} />
    </Dialog>
  );
}

function FormBody({ project, onClose, onSubmit }: Omit<ProjectFormProps, "open">) {
  const [values, setValues] = useState<ProjectInput>(project ?? EMPTY);

  const set = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ ...values, name: values.name.trim(), client: values.client.trim() });
      }}
    >
      <label className="grid gap-1.5 text-sm text-muted">
        اسم المشروع
        <input
          required
          value={values.name}
          onChange={(event) => set("name", event.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="grid gap-1.5 text-sm text-muted">
        العميل
        <input
          required
          value={values.client}
          onChange={(event) => set("client", event.target.value)}
          className={fieldClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm text-muted">
          الخطة
          <select value={values.plan} onChange={(event) => set("plan", event.target.value)} className={fieldClass}>
            {PROJECT_PLANS.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm text-muted">
          الحالة
          <select
            value={values.status}
            onChange={(event) => set("status", event.target.value as ProjectStatus)}
            className={fieldClass}
          >
            {(Object.keys(PROJECT_STATUS) as ProjectStatus[]).map((status) => (
              <option key={status} value={status}>
                {PROJECT_STATUS[status].label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-1.5 text-sm text-muted">
        التاريخ
        <input
          required
          type="date"
          value={values.date}
          onChange={(event) => set("date", event.target.value)}
          className={fieldClass}
        />
      </label>

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
          className="rounded-md bg-brand px-4 py-2 text-[15px] font-medium text-white transition-colors hover:bg-brand-dark"
        >
          {project ? "حفظ" : "إضافة"}
        </button>
      </div>
    </form>
  );
}
