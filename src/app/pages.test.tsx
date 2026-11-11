import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getLanding: vi.fn(),
  getAdmin: vi.fn(),
  redirect: vi.fn((to: string) => {
    throw new Error(`NEXT_REDIRECT:${to}`);
  }),
  loginAction: vi.fn(),
}));

vi.mock("@/shared/lib/apis/landing.api", () => ({ getLanding: mocks.getLanding, LANDING_TAG: "landing" }));
vi.mock("@/shared/lib/services/session.service", () => ({ getAdmin: mocks.getAdmin }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect, usePathname: () => "/" }));
vi.mock("@/shared/lib/actions/auth.action", () => ({ loginAction: mocks.loginAction }));
vi.mock("./_lib/actions/booking.action", () => ({ bookMeetingAction: vi.fn() }));

import type { Landing } from "@/shared/lib/types/api";

import { CtaBand } from "./_components/cta-band";
import { Hero } from "./_components/hero";
import { HeroProofBand } from "./_components/hero-proof-band";
import { Pricing } from "./_components/pricing";
import { Process } from "./_components/process";
import { SoloServices } from "./_components/solo-services";
import { Why } from "./_components/why";
import { WorkRail } from "./_components/work-rail";
import { buildLandingSections } from "./_lib/constants/landing.constant";
import { findSection } from "./_lib/utils/landing.util";
import ErrorPage from "./error";
import HomePage from "./page";
import LoginPage from "./login/page";
import { LoginForm } from "./login/_components/login-form";
import NotFound from "./not-found";

const WA = "https://wa.me/966500000000";
const sections = buildLandingSections(WA);
const get = (type: Parameters<typeof findSection>[1]) => findSection(sections, type)!;

const projects: Landing["projects"] = [
  { id: "p1", title: "موقع عيادة الأمل", description: "", bio_image: "/assets/images/exam-app.png", images: [], live: "https://amal.example" },
  { id: "p2", title: "بروفايل نخبة", description: "", bio_image: "", images: [], live: "javascript:alert(1)" },
];

describe("landing sections", () => {
  it("Hero renders the copy and a button that opens the booking modal", () => {
    render(<Hero section={get("hero")} proof={get("proof")} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("عميلك يحكم عليك");
    expect(screen.queryByRole("link", { name: /اطلب موقعك الآن/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /اطلب موقعك الآن/ }));
    expect(screen.getByRole("heading", { name: "احجز موعداً معنا" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "شاهد نماذج الأعمال" })).toHaveAttribute("href", "#work");
  });

  it("Hero keeps the booking button even without a WhatsApp link", () => {
    render(<Hero section={findSection(buildLandingSections(""), "hero")!} />);
    expect(screen.getByRole("button", { name: /اطلب موقعك الآن/ })).toBeInTheDocument();
  });

  it("HeroProofBand shows the track record and one avatar per client", () => {
    const { container } = render(<HeroProofBand section={get("proof")} />);
    expect(screen.getByText(/أكثر من/)).toBeInTheDocument();
    expect(container.querySelectorAll("img")).toHaveLength(3);
  });

  it("Why lists the four features", () => {
    render(<Why section={get("features")} />);
    expect(screen.getByRole("heading", { name: "نساعد الشركات على النمو رقمياً" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
  });

  it("Pricing shows the package price, the old price and its benefits", () => {
    render(<Pricing section={get("package")} />);
    expect(screen.getByText("1,200")).toBeInTheDocument();
    expect(screen.getByText(/2,000/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
    expect(screen.getByRole("link", { name: /اطلب الباقة الآن/ })).toHaveAttribute("href", WA);
  });

  it("Pricing renders nothing without a package", () => {
    const { container } = render(<Pricing section={{ ...get("package"), contents: [] }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("SoloServices renders both services with prices and order links", () => {
    render(<SoloServices section={get("services")} />);
    expect(screen.getByText("1,500")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /اطلب خدمة الموقع/ })).toHaveAttribute("href", WA);
    expect(screen.getByRole("link", { name: /اطلب خدمة البروفايل/ })).toHaveAttribute("href", WA);
  });

  it("Process renders the four numbered steps", () => {
    render(<Process section={get("process")} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
  });

  it("CtaBand renders the closing call to action", () => {
    render(<CtaBand section={get("cta")} />);
    expect(screen.getByRole("link", { name: /تواصل معنا الآن/ })).toHaveAttribute("href", WA);
  });

  it("WorkRail renders each project and only links safe URLs", () => {
    render(<WorkRail section={get("portfolio")} projects={projects} />);

    expect(screen.getByText("موقع عيادة الأمل").closest("a")).toHaveAttribute("href", "https://amal.example");
    // A javascript: URL from the database is rendered as plain, unlinked text.
    expect(screen.getByText("بروفايل نخبة").closest("a")).toBeNull();
    expect(screen.getByLabelText("التالي")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("السابق"));
  });

  it("WorkRail copes with no projects", () => {
    render(<WorkRail section={get("portfolio")} projects={[]} />);
    expect(screen.getByRole("heading", { name: "نماذج من أعمالنا" })).toBeInTheDocument();
  });
});

describe("home page", () => {
  beforeEach(() => {
    mocks.getLanding.mockResolvedValue({
      settings: { whatsapp: WA },
      projects,
      plans: [],
    } as unknown as Landing);
  });

  it("renders every section from static copy, with API projects and the settings WhatsApp link", async () => {
    const { container } = render(await HomePage());

    for (const id of ["top", "why", "pricing", "services", "work", "faq"]) {
      expect(container.querySelector(`#${id}`), `#${id}`).toBeInTheDocument();
    }
    expect(screen.getByText("موقع عيادة الأمل")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /اطلب موقعك الآن/ })).toBeInTheDocument();
  });

  it("still renders when settings are missing", async () => {
    mocks.getLanding.mockResolvedValue({ settings: null, projects: [], plans: [] });
    render(await HomePage());
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});

describe("login page", () => {
  it("redirects an already signed-in admin to the dashboard", async () => {
    mocks.getAdmin.mockResolvedValue({ id: "1" });
    await expect(LoginPage()).rejects.toThrow("NEXT_REDIRECT:/dashboard");
  });

  it("shows the form to everyone else", async () => {
    mocks.getAdmin.mockResolvedValue(null);
    render(await LoginPage());
    expect(screen.getByRole("heading", { name: "لوحة التحكم" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "تسجيل الدخول" })).toBeInTheDocument();
  });
});

describe("LoginForm client-side validation", () => {
  const fill = (email: string, password: string) => {
    fireEvent.change(screen.getByLabelText("البريد الإلكتروني"), { target: { value: email } });
    fireEvent.change(screen.getByLabelText("كلمة المرور"), { target: { value: password } });
    fireEvent.submit(screen.getByRole("button", { name: "تسجيل الدخول" }).closest("form")!);
  };

  it("blocks an XSS payload before anything is sent", () => {
    render(<LoginForm />);
    fill('<img src=x onerror=alert(1)>@x.co', "pw");

    expect(screen.getByRole("alert")).toHaveTextContent("البريد الإلكتروني يحتوي على رموز غير مسموحة");
    expect(mocks.loginAction).not.toHaveBeenCalled();
  });

  it("blocks an empty password", () => {
    render(<LoginForm />);
    fill("admin@wajha.sa", "");
    expect(screen.getByRole("alert")).toHaveTextContent("كلمة المرور مطلوبة");
  });

  it("blocks a malformed email", () => {
    render(<LoginForm />);
    fill("admin", "pw");
    expect(screen.getByRole("alert")).toHaveTextContent("البريد الإلكتروني غير صالح");
  });

  it("lets a valid login through to the server action", async () => {
    mocks.loginAction.mockResolvedValue({});
    render(<LoginForm />);
    fill("admin@wajha.sa", "pw");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await waitFor(() => expect(mocks.loginAction).toHaveBeenCalled());
  });
});

describe("status pages", () => {
  it("not-found links back home", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { name: "الصفحة غير موجودة" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "العودة للرئيسية" })).toHaveAttribute("href", "/");
  });

  it("error page logs the error and retries on click", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const reset = vi.fn();
    const error = new Error("boom");

    render(<ErrorPage error={error} reset={reset} />);
    expect(spy).toHaveBeenCalledWith(error);

    fireEvent.click(screen.getByRole("button", { name: "إعادة المحاولة" }));
    expect(reset).toHaveBeenCalledOnce();
    spy.mockRestore();
  });
});
