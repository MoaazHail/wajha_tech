"use client";

import { useState, useTransition } from "react";

import { DataTable } from "@/shared/components/data-table";
import type { Client, Plan, Project } from "@/shared/lib/types/api";

import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "../../_lib/actions/projects.action";
import type { ProjectInput } from "../../_lib/schemes/project.scheme";
import type { ActionResult } from "../../_lib/types/action";
import { ProjectForm } from "./project-form";
import { PROJECT_COLUMNS } from "./projects-columns";

interface ProjectsManagerProps {
  projects: ReadonlyArray<Project>;
  clients: ReadonlyArray<Client>;
  plans: ReadonlyArray<Plan>;
}

/** The projects table with add, edit and delete. */
export function ProjectsManager({ projects, clients, plans }: ProjectsManagerProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const submit = async (data: ProjectInput): Promise<ActionResult> =>
    editing ? updateProjectAction(editing.id, data) : createProjectAction(data);

  const remove = (row: Project) => {
    setError(null);
    startTransition(async () => {
      const result = await deleteProjectAction(row.id);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <>
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      <DataTable
        columns={PROJECT_COLUMNS}
        rows={projects}
        getRowId={(row) => row.id}
        addLabel="إضافة مشروع"
        onAdd={() => {
          setEditing(null);
          setFormOpen(true);
        }}
        onEdit={(row) => {
          setEditing(row);
          setFormOpen(true);
        }}
        onDelete={remove}
        deleteMessage={(row) => `هل أنت متأكد من حذف «${row.title}»؟ لا يمكن التراجع عن هذا الإجراء.`}
        emptyText="لا توجد مشاريع بعد"
        theme="dark"
      />

      <ProjectForm
        open={formOpen}
        project={editing}
        clients={clients}
        plans={plans}
        onClose={() => setFormOpen(false)}
        onSubmit={submit}
      />
    </>
  );
}
