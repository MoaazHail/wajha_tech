"use client";

import { useState } from "react";

import { DataTable } from "@/shared/components/data-table";

import { useProjects } from "../../_lib/hooks/use-projects";
import { ProjectForm } from "./project-form";
import { PROJECT_COLUMNS } from "./projects-columns";
import type { Project } from "../../_lib/constants/dashboard-data.constant";

/** The projects table with add, edit and delete. */
export function ProjectsManager() {
  const { projects, add, update, remove } = useProjects();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const closeForm = () => setFormOpen(false);

  return (
    <>
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
        onDelete={(row) => remove(row.id)}
        deleteMessage={(row) => `هل أنت متأكد من حذف «${row.name}»؟ لا يمكن التراجع عن هذا الإجراء.`}
        emptyText="لا توجد مشاريع بعد"
      theme="dark"
      />

      <ProjectForm
        open={formOpen}
        project={editing}
        onClose={closeForm}
        onSubmit={(data) => {
          if (editing) update(editing.id, data);
          else add(data);
          closeForm();
        }}
      />
    </>
  );
}
