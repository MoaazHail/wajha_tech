import type { DataTableColumn } from "@/shared/components/data-table";
import type { Client } from "@/shared/lib/types/api";

export const USER_COLUMNS: ReadonlyArray<DataTableColumn<Client>> = [
  { key: "name", header: "العميل", cell: (row) => row.name, strong: true },
  { key: "phone", header: "الجوال", cell: (row) => row.phone, className: "ltr text-start" },
  { key: "email", header: "البريد الإلكتروني", cell: (row) => row.email || "—", className: "ltr text-start" },
  { key: "plan", header: "الخطة", cell: (row) => row.plan?.title ?? "—" },
];
