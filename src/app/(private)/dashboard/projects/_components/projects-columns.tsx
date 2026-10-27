import type { DataTableColumn } from "@/shared/components/data-table";
import { cn } from "@/shared/lib/utils/cn.util";

import { PROJECT_STATUS, type Project } from "../../_lib/constants/dashboard-data.constant";

export const PROJECT_COLUMNS: ReadonlyArray<DataTableColumn<Project>> = [
  { key: "name", header: "المشروع", cell: (row) => row.name, strong: true },
  { key: "client", header: "العميل", cell: (row) => row.client },
  { key: "plan", header: "الخطة", cell: (row) => row.plan },
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
  { key: "date", header: "التاريخ", cell: (row) => row.date, className: "ltr text-start" },
];
