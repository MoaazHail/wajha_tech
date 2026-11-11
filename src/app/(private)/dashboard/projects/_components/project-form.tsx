"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

import { Dialog } from "@/shared/components/dialog";
import type { Client, Plan, Project, ProjectStatus } from "@/shared/lib/types/api";

import { uploadImageAction } from "../../_lib/actions/uploads.action";
import { PROJECT_STATUS } from "../../_lib/constants/project-status.constant";
import type { ProjectInput } from "../../_lib/schemes/project.scheme";
import type { ActionResult } from "../../_lib/types/action";

interface ProjectFormProps {
  open: boolean;
  /** The project being edited; leave empty to add a new one. */
  project?: Project | null;
  clients: ReadonlyArray<Client>;
  plans: ReadonlyArray<Plan>;
  onClose: () => void;
  onSubmit: (data: ProjectInput) => Promise<ActionResult>;
}

const fieldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px] outline-none transition-colors focus:border-brand";

const today = () => new Date().toISOString().slice(0, 10);

const toInput = (project?: Project | null): ProjectInput => ({
  title: project?.title ?? "",
  description: project?.description ?? "",
  bio_image: project?.bio_image ?? "",
  live: project?.live ?? "",
  status: project?.status ?? "active",
  date: project ? project.date.slice(0, 10) : today(),
  featured: project?.featured ?? false,
  user: project?.user?.id ?? "",
  plan: project?.plan?.id ?? "",
});

export function ProjectForm({ open, project, clients, plans, onClose, onSubmit }: ProjectFormProps) {
  return (
    <Dialog open={open} onClose={onClose} title={project ? "تعديل المشروع" : "إضافة مشروع"}>
      {/* Keyed so each open starts from the right values. */}
      <FormBody
        key={project?.id ?? "new"}
        project={project}
        clients={clients}
        plans={plans}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </Dialog>
  );
}

function FormBody({ project, clients, plans, onClose, onSubmit }: Omit<ProjectFormProps, "open">) {
  const [values, setValues] = useState<ProjectInput>(() => toInput(project));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  /** A newly chosen image, uploaded on submit. Until then the saved path (if any) stays. */
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return setPreview(null);

    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const imageSrc = preview ?? (values.bio_image || null);

  const set = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);

        startTransition(async () => {
          let bio_image = values.bio_image;

          if (file) {
            const body = new FormData();
            body.append("image", file);

            const upload = await uploadImageAction(body);
            if (!upload.ok) return setError(upload.error);
            bio_image = upload.path;
          }

          const result = await onSubmit({ ...values, bio_image });
          if (result.ok) onClose();
          else setError(result.error);
        });
      }}
    >
      <label className="grid gap-1.5 text-sm text-muted">
        اسم المشروع
        <input
          required
          value={values.title}
          onChange={(event) => set("title", event.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="grid gap-1.5 text-sm text-muted">
        الوصف
        <textarea
          rows={3}
          value={values.description}
          onChange={(event) => set("description", event.target.value)}
          className={fieldClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm text-muted">
          العميل
          <select value={values.user} onChange={(event) => set("user", event.target.value)} className={fieldClass}>
            <option value="">بدون عميل</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>

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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

      <div className="grid gap-1.5 text-sm text-muted">
        <label htmlFor="project-image">صورة المشروع</label>
        {imageSrc && (
          <Image
            unoptimized
            src={imageSrc}
            alt=""
            width={320}
            height={200}
            className="h-32 w-auto max-w-full rounded-md border border-line object-cover"
          />
        )}
        <input
          id="project-image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className={`${fieldClass} file:me-3 file:rounded file:border-0 file:bg-surface file:px-3 file:py-1 file:text-sm`}
        />
      </div>

      <label className="grid gap-1.5 text-sm text-muted">
        رابط الموقع المباشر
        <input
          dir="ltr"
          value={values.live}
          onChange={(event) => set("live", event.target.value)}
          className={`${fieldClass} text-start`}
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={values.featured}
          onChange={(event) => set("featured", event.target.checked)}
          className="size-4 accent-brand"
        />
        عرضه في «نماذج من أعمالنا» بالصفحة الرئيسية
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
          {project ? "حفظ" : "إضافة"}
        </button>
      </div>
    </form>
  );
}
