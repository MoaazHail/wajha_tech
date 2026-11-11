import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  api: {
    listClients: vi.fn(),
    listPlans: vi.fn(),
    listProjects: vi.fn(),
    getStats: vi.fn(),
    getSettings: vi.fn(),
  },
  actions: {
    createClientAction: vi.fn(),
    updateClientAction: vi.fn(),
    deleteClientAction: vi.fn(),
    createPlanAction: vi.fn(),
    updatePlanAction: vi.fn(),
    deletePlanAction: vi.fn(),
    createProjectAction: vi.fn(),
    updateProjectAction: vi.fn(),
    deleteProjectAction: vi.fn(),
    updateSettingsAction: vi.fn(),
    uploadImageAction: vi.fn(),
  },
  getAdmin: vi.fn(),
  redirect: vi.fn((to: string) => {
    throw new Error(`NEXT_REDIRECT:${to}`);
  }),
}));

vi.mock("./_lib/apis/dashboard.api", () => mocks.api);
vi.mock("./_lib/actions/clients.action", () => mocks.actions);
vi.mock("./_lib/actions/plans.action", () => mocks.actions);
vi.mock("./_lib/actions/projects.action", () => mocks.actions);
vi.mock("./_lib/actions/settings.action", () => mocks.actions);
vi.mock("./_lib/actions/uploads.action", () => mocks.actions);
vi.mock("@/shared/lib/services/session.service", () => ({ getAdmin: mocks.getAdmin }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect, usePathname: () => "/dashboard" }));
vi.mock("@/shared/lib/actions/auth.action", () => ({ logoutAction: vi.fn() }));

import type { Client, Plan, Project, Settings, Stats } from "@/shared/lib/types/api";

import { PlansSummary } from "./_components/plans-summary";
import { RecentProjects } from "./_components/recent-projects";
import Layout from "../layout";
import ContentsPage from "./contents/page";
import DashboardPage from "./page";
import DashboardLoading from "./loading";
import PlansLoading from "./plans/loading";
import { PlansManager } from "./plans/_components/plans-manager";
import PlansPage from "./plans/page";
import ProjectsLoading from "./projects/loading";
import { ProjectsManager } from "./projects/_components/projects-manager";
import ProjectsPage from "./projects/page";
import SettingsLoading from "./settings/loading";
import { SettingsForm } from "./settings/_components/settings-form";
import SettingsPage from "./settings/page";
import UsersLoading from "./users/loading";
import { UsersManager } from "./users/_components/users-manager";
import UsersPage from "./users/page";

const plans: Plan[] = [
  { id: "pl1", title: "باقة الشركات", kind: "package", price: 1200, currency: "ريال", benefits: ["دعم فني"], order: 0, isActive: true, orders: 3 },
  { id: "pl2", title: "موقع", kind: "website", price: 1500, currency: "ريال", benefits: [], order: 1, isActive: true },
];
const clients: Client[] = [
  { id: "c1", name: "عيادة الأمل", phone: "+966500000001", email: "a@b.co", plan: { id: "pl1", title: "باقة الشركات", price: 1200, currency: "ريال" } },
  { id: "c2", name: "مطعم السلطان", phone: "+966500000002" },
];
const projects: Project[] = [
  {
    id: "j1",
    title: "موقع عيادة الأمل",
    description: "",
    bio_image: "",
    images: [],
    live: "",
    status: "active",
    date: "2026-10-18T00:00:00.000Z",
    featured: true,
    order: 0,
    user: { id: "c1", name: "عيادة الأمل", phone: "" },
    plan: { id: "pl1", title: "باقة الشركات", kind: "package" },
  },
];
const stats: Stats = { projects: 6, active: 2, clients: 6, revenue: 7200, projectsThisMonth: 1, clientsThisMonth: 2 };
const settings: Settings = {
  id: "s",
  name: "واجهة",
  wordmark: "WAJHA",
  tagline: "t",
  description: "d",
  phone: "+966",
  email: "hello@wajha.sa",
  whatsapp: "https://wa.me/1",
  address: "الرياض",
  foundedYear: 2025,
};

beforeEach(() => {
  mocks.api.listClients.mockResolvedValue(clients);
  mocks.api.listPlans.mockResolvedValue(plans);
  mocks.api.listProjects.mockResolvedValue(projects);
  mocks.api.getStats.mockResolvedValue(stats);
  mocks.api.getSettings.mockResolvedValue(settings);
  for (const action of Object.values(mocks.actions)) action.mockResolvedValue({ ok: true });
  mocks.actions.uploadImageAction.mockResolvedValue({ ok: true, path: "/images/1.png" });
});

describe("private layout", () => {
  it("redirects to /login without a valid admin", async () => {
    mocks.getAdmin.mockResolvedValue(null);
    await expect(Layout({ children: <p>x</p> })).rejects.toThrow("NEXT_REDIRECT:/login");
  });

  it("renders the sidebar and the page for an admin", async () => {
    mocks.getAdmin.mockResolvedValue({ id: "1", name: "Ali", email: "a@b.co", role: "admin" });
    render(await Layout({ children: <p>الصفحة</p> }));
    expect(screen.getByText("الصفحة")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "روابط لوحة التحكم" })).toBeInTheDocument();
  });
});

describe("overview page", () => {
  it("shows the four stat cards, recent projects and the plans", async () => {
    render(await DashboardPage());

    expect(screen.getByRole("heading", { name: "لوحة التحكم" })).toBeInTheDocument();
    expect(screen.getByText("إجمالي المشاريع")).toBeInTheDocument();
    expect(screen.getByText("7,200")).toBeInTheDocument();
    expect(screen.getByText("+2 هذا الشهر")).toBeInTheDocument();
    expect(mocks.api.listProjects).toHaveBeenCalledWith(4);
  });

  it("PlansSummary and RecentProjects render their data", () => {
    render(
      <>
        <PlansSummary plans={plans} />
        <RecentProjects projects={projects} />
      </>,
    );
    expect(screen.getByText("1,200 ريال · 3 طلب")).toBeInTheDocument();
    expect(screen.getAllByText("موقع عيادة الأمل").length).toBeGreaterThan(0);
    expect(screen.getAllByText("قيد التنفيذ").length).toBeGreaterThan(0);
  });
});

describe("users page", () => {
  it("lists clients with their plan, dash for missing values", async () => {
    render(await UsersPage());
    expect(screen.getByRole("heading", { name: "العملاء" })).toBeInTheDocument();
    expect(screen.getAllByText("عيادة الأمل").length).toBeGreaterThan(0);
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("adds a client through the form", async () => {
    render(<UsersManager clients={clients} plans={plans} />);

    fireEvent.click(screen.getByRole("button", { name: /إضافة عميل/ }));
    const dialog = screen.getByRole("heading", { name: "إضافة عميل" }).closest("dialog")!;
    fireEvent.change(within(dialog).getByLabelText("اسم العميل"), { target: { value: "شركة جديدة" } });
    fireEvent.change(within(dialog).getByLabelText("الجوال"), { target: { value: "+966511111111" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "إضافة" }));

    await waitFor(() =>
      expect(mocks.actions.createClientAction).toHaveBeenCalledWith({
        name: "شركة جديدة",
        phone: "+966511111111",
        email: "",
        plan: "",
      }),
    );
  });

  it("edits a client from the row menu, prefilled", async () => {
    render(<UsersManager clients={clients} plans={plans} />);

    fireEvent.click(screen.getAllByLabelText("إجراءات الصف")[0]!);
    fireEvent.click(screen.getByRole("menuitem", { name: /تعديل/ }));

    const dialog = screen.getByRole("heading", { name: "تعديل العميل" }).closest("dialog")!;
    expect(within(dialog).getByLabelText("اسم العميل")).toHaveValue("عيادة الأمل");
    fireEvent.click(within(dialog).getByRole("button", { name: "حفظ" }));

    await waitFor(() => expect(mocks.actions.updateClientAction).toHaveBeenCalledWith("c1", expect.objectContaining({ name: "عيادة الأمل" })));
  });

  it("shows the server error inside the form and keeps it open", async () => {
    mocks.actions.createClientAction.mockResolvedValue({ ok: false, error: "رقم الجوال مستخدم" });
    render(<UsersManager clients={clients} plans={plans} />);

    fireEvent.click(screen.getByRole("button", { name: /إضافة عميل/ }));
    const dialog = screen.getByRole("heading", { name: "إضافة عميل" }).closest("dialog")!;
    fireEvent.change(within(dialog).getByLabelText("اسم العميل"), { target: { value: "x" } });
    fireEvent.change(within(dialog).getByLabelText("الجوال"), { target: { value: "+966511111111" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "إضافة" }));

    expect(await within(dialog).findByRole("alert")).toHaveTextContent("رقم الجوال مستخدم");
  });

  it("deletes after confirmation and surfaces a failure", async () => {
    mocks.actions.deleteClientAction.mockResolvedValue({ ok: false, error: "تعذر الحذف" });
    render(<UsersManager clients={clients} plans={plans} />);

    fireEvent.click(screen.getAllByLabelText("إجراءات الصف")[0]!);
    fireEvent.click(screen.getByRole("menuitem", { name: /حذف/ }));
    const confirm = screen.getByText("تأكيد الحذف").closest("dialog")!;
    fireEvent.click(within(confirm).getByRole("button", { name: "حذف" }));

    await waitFor(() => expect(mocks.actions.deleteClientAction).toHaveBeenCalledWith("c1"));
    expect(await screen.findByText("تعذر الحذف")).toBeInTheDocument();
  });
});

describe("projects page", () => {
  it("lists projects with client, plan and status", async () => {
    render(await ProjectsPage());
    expect(screen.getByRole("heading", { name: "المشاريع" })).toBeInTheDocument();
    expect(screen.getAllByText("قيد التنفيذ").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2026-10-18").length).toBeGreaterThan(0);
  });

  it("adds a project, uploading the chosen image first", async () => {
    render(<ProjectsManager projects={projects} clients={clients} plans={plans} />);

    fireEvent.click(screen.getByRole("button", { name: /إضافة مشروع/ }));
    const dialog = screen.getByRole("heading", { name: "إضافة مشروع" }).closest("dialog")!;
    fireEvent.change(within(dialog).getByLabelText("اسم المشروع"), { target: { value: "موقع جديد" } });

    URL.createObjectURL = vi.fn(() => "blob:preview");
    URL.revokeObjectURL = vi.fn();
    const file = new File(["x"], "a.png", { type: "image/png" });
    fireEvent.change(within(dialog).getByLabelText("صورة المشروع"), { target: { files: [file] } });
    fireEvent.click(within(dialog).getByRole("button", { name: "إضافة" }));

    await waitFor(() => expect(mocks.actions.uploadImageAction).toHaveBeenCalled());
    await waitFor(() =>
      expect(mocks.actions.createProjectAction).toHaveBeenCalledWith(
        expect.objectContaining({ title: "موقع جديد", bio_image: "/images/1.png", status: "active" }),
      ),
    );
  });

  it("stops and shows the error when the upload fails", async () => {
    mocks.actions.uploadImageAction.mockResolvedValue({ ok: false, error: "حجم الصورة كبير" });
    URL.createObjectURL = vi.fn(() => "blob:preview");
    URL.revokeObjectURL = vi.fn();
    render(<ProjectsManager projects={projects} clients={clients} plans={plans} />);

    fireEvent.click(screen.getByRole("button", { name: /إضافة مشروع/ }));
    const dialog = screen.getByRole("heading", { name: "إضافة مشروع" }).closest("dialog")!;
    fireEvent.change(within(dialog).getByLabelText("اسم المشروع"), { target: { value: "x" } });
    fireEvent.change(within(dialog).getByLabelText("صورة المشروع"), {
      target: { files: [new File(["x"], "a.png", { type: "image/png" })] },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: "إضافة" }));

    expect(await within(dialog).findByRole("alert")).toHaveTextContent("حجم الصورة كبير");
    expect(mocks.actions.createProjectAction).not.toHaveBeenCalled();
  });

  it("edits and deletes a project", async () => {
    render(<ProjectsManager projects={projects} clients={clients} plans={plans} />);

    fireEvent.click(screen.getAllByLabelText("إجراءات الصف")[0]!);
    fireEvent.click(screen.getByRole("menuitem", { name: /تعديل/ }));
    const dialog = screen.getByRole("heading", { name: "تعديل المشروع" }).closest("dialog")!;
    expect(within(dialog).getByLabelText("اسم المشروع")).toHaveValue("موقع عيادة الأمل");
    fireEvent.click(within(dialog).getByRole("button", { name: "حفظ" }));
    await waitFor(() => expect(mocks.actions.updateProjectAction).toHaveBeenCalledWith("j1", expect.objectContaining({ date: "2026-10-18", user: "c1" })));
  });
});

describe("plans page", () => {
  it("shows plan cards with price and orders", async () => {
    render(await PlansPage());
    expect(screen.getByRole("heading", { name: "الخطط" })).toBeInTheDocument();
    expect(screen.getByText("باقة الشركات")).toBeInTheDocument();
    expect(screen.getByText("3 طلب")).toBeInTheDocument();
    expect(screen.getByText("0 طلب")).toBeInTheDocument();
  });

  it("adds a plan, splitting benefits by line", async () => {
    render(<PlansManager plans={plans} />);

    fireEvent.click(screen.getByRole("button", { name: /إضافة خطة/ }));
    const dialog = screen.getByRole("heading", { name: "إضافة خطة" }).closest("dialog")!;
    fireEvent.change(within(dialog).getByLabelText("اسم الخطة"), { target: { value: "جديدة" } });
    fireEvent.change(within(dialog).getByLabelText("السعر (ريال)"), { target: { value: "900" } });
    fireEvent.change(within(dialog).getByLabelText("المميزات (ميزة في كل سطر)"), { target: { value: "أ\n\n ب " } });
    fireEvent.click(within(dialog).getByRole("button", { name: "إضافة" }));

    await waitFor(() =>
      expect(mocks.actions.createPlanAction).toHaveBeenCalledWith({ title: "جديدة", price: 900, benefits: ["أ", "ب"] }),
    );
  });

  it("deletes a plan after confirmation", async () => {
    render(<PlansManager plans={plans} />);
    fireEvent.click(screen.getAllByLabelText("حذف")[0]!);
    const dialog = screen.getByText("تأكيد الحذف").closest("dialog")!;
    fireEvent.click(within(dialog).getByRole("button", { name: "حذف" }));
    await waitFor(() => expect(mocks.actions.deletePlanAction).toHaveBeenCalledWith("pl1"));
  });

  it("shows an empty state", () => {
    render(<PlansManager plans={[]} />);
    expect(screen.getByText("لا توجد خطط بعد")).toBeInTheDocument();
  });
});

describe("settings page", () => {
  it("loads the current settings into the form", async () => {
    render(await SettingsPage());
    expect(screen.getByRole("heading", { name: "الإعدادات" })).toBeInTheDocument();
    expect(screen.getByLabelText("اسم الموقع")).toHaveValue("واجهة");
    expect(screen.getByLabelText("سنة التأسيس")).toHaveValue(2025);
  });

  it("saves edits and confirms", async () => {
    render(<SettingsForm settings={settings} />);

    fireEvent.change(screen.getByLabelText("اسم الموقع"), { target: { value: "واجهة 2" } });
    fireEvent.click(screen.getByRole("button", { name: "حفظ التغييرات" }));

    await waitFor(() => expect(mocks.actions.updateSettingsAction).toHaveBeenCalledWith(expect.objectContaining({ name: "واجهة 2", foundedYear: 2025 })));
    expect(await screen.findByRole("status")).toHaveTextContent("تم حفظ الإعدادات");
  });

  it("sends a cleared founding year as null", async () => {
    render(<SettingsForm settings={settings} />);
    fireEvent.change(screen.getByLabelText("سنة التأسيس"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "حفظ التغييرات" }));
    await waitFor(() => expect(mocks.actions.updateSettingsAction).toHaveBeenCalledWith(expect.objectContaining({ foundedYear: null })));
  });

  it("shows the server error", async () => {
    mocks.actions.updateSettingsAction.mockResolvedValue({ ok: false, error: "البريد الإلكتروني غير صالح" });
    render(<SettingsForm settings={settings} />);
    fireEvent.click(screen.getByRole("button", { name: "حفظ التغييرات" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("البريد الإلكتروني غير صالح");
  });
});

describe("contents page", () => {
  it("warns that the page is unfinished", () => {
    render(<ContentsPage />);
    expect(screen.getByRole("heading", { name: "المحتوى" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("انتبه هذه الصفحه لم تكتمل");
  });
});

describe("loading screens", () => {
  it.each([
    ["overview", DashboardLoading],
    ["users", UsersLoading],
    ["projects", ProjectsLoading],
    ["plans", PlansLoading],
    ["settings", SettingsLoading],
  ])("%s shows an accessible skeleton", (_name, Loading) => {
    render(<Loading />);
    expect(screen.getByRole("status", { name: "جارٍ التحميل" })).toBeInTheDocument();
  });
});
