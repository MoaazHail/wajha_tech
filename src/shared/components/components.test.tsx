import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CardsSkeleton } from "@/shared/skeletons/cards.skeleton";
import { OverviewSkeleton } from "@/shared/skeletons/overview.skeleton";
import { Skeleton } from "@/shared/skeletons/skeleton";
import { TableSkeleton } from "@/shared/skeletons/table.skeleton";

import { CrudCard } from "./crud-card";
import { CtaArrow, CtaLink } from "./cta-link";
import { DataTable, type DataTableColumn } from "./data-table";
import { Dialog } from "./dialog";
import { StatusScreen } from "./status-screen";

interface Row {
  id: string;
  name: string;
  phone: string;
}

const rows: Row[] = [
  { id: "1", name: "عيادة الأمل", phone: "0501" },
  { id: "2", name: "مطعم السلطان", phone: "0502" },
];
const columns: DataTableColumn<Row>[] = [
  { key: "name", header: "الاسم", cell: (r) => r.name, strong: true },
  { key: "phone", header: "الجوال", cell: (r) => r.phone },
];

describe("DataTable", () => {
  it("renders a table for md+ and a card list for phones, both with every row", () => {
    const { container } = render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);

    const table = container.querySelector("table")!;
    expect(table.parentElement).toHaveClass("hidden", "md:block");
    expect(within(table).getByText("عيادة الأمل")).toBeInTheDocument();

    const cards = container.querySelector("ul")!;
    expect(cards).toHaveClass("md:hidden");
    expect(within(cards).getAllByRole("listitem")).toHaveLength(2);
    // Each card labels its values with the column header.
    expect(within(cards).getAllByText("الجوال")).toHaveLength(2);
  });

  it("shows the empty text in both layouts", () => {
    render(<DataTable columns={columns} rows={[]} getRowId={(r) => r.id} emptyText="لا يوجد" />);
    expect(screen.getAllByText("لا يوجد")).toHaveLength(2);
  });

  it("is read-only without handlers: no add button and no row menu", () => {
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onAdd from the toolbar button", () => {
    const onAdd = vi.fn();
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} onAdd={onAdd} addLabel="إضافة عميل" />);

    fireEvent.click(screen.getByRole("button", { name: /إضافة عميل/ }));
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it("opens the row menu and edits the right row", () => {
    const onEdit = vi.fn();
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} onEdit={onEdit} />);

    fireEvent.click(screen.getAllByLabelText("إجراءات الصف")[1]!);
    fireEvent.click(screen.getByRole("menuitem", { name: /تعديل/ }));

    expect(onEdit).toHaveBeenCalledWith(rows[1]);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens the menu on right-click", () => {
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} onEdit={() => {}} />);
    fireEvent.contextMenu(screen.getAllByText("عيادة الأمل")[0]!);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("asks for confirmation before deleting, and cancel keeps the row", () => {
    const onDelete = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        onDelete={onDelete}
        deleteMessage={(r) => `حذف ${r.name}؟`}
      />,
    );

    fireEvent.click(screen.getAllByLabelText("إجراءات الصف")[0]!);
    fireEvent.click(screen.getByRole("menuitem", { name: /حذف/ }));
    expect(screen.getByText("حذف عيادة الأمل؟")).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "إلغاء" }));
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("deletes after confirming", () => {
    const onDelete = vi.fn();
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} onDelete={onDelete} />);

    fireEvent.click(screen.getAllByLabelText("إجراءات الصف")[0]!);
    fireEvent.click(screen.getByRole("menuitem", { name: /حذف/ }));
    const dialog = screen.getByText("تأكيد الحذف").closest("dialog")!;
    fireEvent.click(within(dialog).getByRole("button", { name: "حذف" }));

    expect(onDelete).toHaveBeenCalledWith(rows[0]);
  });

  it("closes the menu with Escape", () => {
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} onEdit={() => {}} />);
    fireEvent.click(screen.getAllByLabelText("إجراءات الصف")[0]!);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("applies the dark theme", () => {
    const { container } = render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} theme="dark" />);
    expect(container.querySelector("table")!.parentElement).toHaveClass("bg-night-tile");
  });
});

describe("Dialog", () => {
  it("renders its content only while open and reports close", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Dialog open={false} onClose={onClose} title="عنوان">
        محتوى
      </Dialog>,
    );
    expect(screen.queryByText("محتوى")).not.toBeInTheDocument();

    rerender(
      <Dialog open onClose={onClose} title="عنوان">
        محتوى
      </Dialog>,
    );
    expect(screen.getByText("محتوى")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "عنوان" })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("إغلاق"));
    expect(onClose).toHaveBeenCalled();
  });

  it("scrolls instead of overflowing small screens", () => {
    const { container } = render(
      <Dialog open onClose={() => {}} title="t">
        x
      </Dialog>,
    );
    expect(container.querySelector("dialog")).toHaveClass("max-h-[92dvh]", "overflow-y-auto");
  });
});

describe("CrudCard", () => {
  it("shows edit/delete only when handlers are given", () => {
    render(<CrudCard>نص</CrudCard>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("edits, and deletes only after confirmation", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <CrudCard onEdit={onEdit} onDelete={onDelete} deleteMessage="متأكد؟">
        نص
      </CrudCard>,
    );

    fireEvent.click(screen.getByLabelText("تعديل"));
    expect(onEdit).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByLabelText("حذف"));
    expect(screen.getByText("متأكد؟")).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();

    const dialog = screen.getByText("تأكيد الحذف").closest("dialog")!;
    fireEvent.click(within(dialog).getByRole("button", { name: "حذف" }));
    expect(onDelete).toHaveBeenCalledOnce();
  });
});

describe("CtaLink / StatusScreen", () => {
  it("renders an anchor with the variant classes and passes props through", () => {
    render(
      <CtaLink href="https://wa.me/1" tone="blue" target="_blank" rel="noreferrer">
        اطلب <CtaArrow />
      </CtaLink>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://wa.me/1");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveClass("bg-brand");
  });

  it("StatusScreen shows title, description and action", () => {
    render(<StatusScreen title="غير موجودة" description="وصف" action={{ label: "الرئيسية", href: "/" }} />);
    expect(screen.getByRole("heading", { name: "غير موجودة" })).toBeInTheDocument();
    expect(screen.getByText("وصف")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "الرئيسية" })).toHaveAttribute("href", "/");
  });

  it("StatusScreen omits the optional parts", () => {
    render(<StatusScreen title="خطأ" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

describe("skeletons", () => {
  it("Skeleton is hidden from assistive tech and pulses", () => {
    const { container } = render(<Skeleton className="h-4" />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstChild).toHaveClass("animate-pulse", "h-4");
  });

  it("TableSkeleton announces loading and has a table and a card layout", () => {
    const { container } = render(<TableSkeleton columns={3} rows={5} />);
    expect(screen.getByRole("status", { name: "جارٍ التحميل" })).toBeInTheDocument();
    expect(container.querySelector(".md\\:block")).toBeInTheDocument();
    expect(container.querySelector(".md\\:hidden")).toBeInTheDocument();
  });

  it("CardsSkeleton renders the requested number of cards", () => {
    const { container } = render(<CardsSkeleton count={3} />);
    expect(container.querySelectorAll(".xl\\:grid-cols-3 > div")).toHaveLength(3);
  });

  it("OverviewSkeleton announces loading", () => {
    render(<OverviewSkeleton />);
    expect(screen.getByRole("status", { name: "جارٍ التحميل" })).toBeInTheDocument();
  });
});
