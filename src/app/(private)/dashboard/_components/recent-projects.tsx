"use client";

import { DataTable } from "@/shared/components/data-table";
import type { Project } from "@/shared/lib/types/api";

import { PROJECT_COLUMNS } from "../projects/_components/projects-columns";

/** Read-only view of the latest projects for the overview. */
export function RecentProjects({ projects }: { projects: ReadonlyArray<Project> }) {
  return (
    <DataTable
      columns={PROJECT_COLUMNS}
      rows={projects}
      getRowId={(row) => row.id}
      emptyText="لا توجد مشاريع بعد"
      theme="dark"
    />
  );
}
