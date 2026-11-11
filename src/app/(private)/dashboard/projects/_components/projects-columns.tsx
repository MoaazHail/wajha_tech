import type { DataTableColumn } from "@/shared/components/data-table";
import type { Project } from "@/shared/lib/types/api";
import { cn } from "@/shared/lib/utils/cn.util";

import { PROJECT_STATUS } from "../../_lib/constants/project-status.constant";

export const PROJECT_COLUMNS: ReadonlyArray<DataTableColumn<Project>> = [
  { key: "title", header: "المشروع", cell: (row) => row.title, strong: true },
  { key: "client", header: "العميل", cell: (row) => row.user?.name ?? "—" },
  { key: "plan", header: "الخطة", cell: (row) => row.plan?.title ?? "—" },
  {
    key: "status",
    header: "الحالة",
    cell: (row, theme) => {
      const status = PROJECT_STATUS[row.status];

      return (
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            theme === "dark" ? status.darkClassName : status.className,
          )}
        >
          {status.label}
        </span>
      );
    },
  },
  { key: "date", header: "التاريخ", cell: (row) => row.date.slice(0, 10), className: "ltr text-start" },
];
