"use client";

import { DataTable } from "@/shared/components/data-table";

import { useProjects } from "../_lib/hooks/use-projects";
import { PROJECT_COLUMNS } from "../projects/_components/projects-columns";

/** Read-only view of the latest projects for the overview. */
export function RecentProjects({ limit = 4 }: { limit?: number }) {
  const { projects } = useProjects();

  return (
    <DataTable
      columns={PROJECT_COLUMNS}
      rows={projects.slice(0, limit)}
      getRowId={(row) => row.id}
      emptyText="لا توجد مشاريع بعد"
      theme="dark"
    />
  );
}
