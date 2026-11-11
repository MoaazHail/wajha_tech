import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const nav = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));
vi.mock("@/shared/lib/actions/auth.action", () => ({ logoutAction: vi.fn() }));
vi.mock("@/shared/layout/splash-screen", () => ({ SplashScreen: () => <div data-testid="splash" /> }));

import type { Settings } from "@/shared/lib/types/api";

import { BackToTop } from "./back-to-top";
import { DashboardSidebar } from "./private/sidebar";
import { PublicChrome } from "./public-chrome";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const settings: Settings = {
  id: "s",
  name: "واجهة",
  wordmark: "WAJHA",
  tagline: "نحو واجهة رقمية",
  description: "",
  phone: "+966 50 123 4567",
  email: "hello@wajha.sa",
  whatsapp: "https://wa.me/966500000000",
  address: "الرياض",
  foundedYear: 2025,
};

beforeEach(() => {
  nav.pathname = "/";
});

describe("SiteHeader", () => {
  it("links the main nav anchors", () => {
    render(<SiteHeader whatsapp={settings.whatsapp} />);
    expect(screen.getAllByRole("link", { name: "مميزات الخدمة" })[0]).toHaveAttribute("href", "#why");
  });

  it("has a blurred, translucent background", () => {
    const { container } = render(<SiteHeader whatsapp={settings.whatsapp} />);
    expect(container.querySelector("header")).toHaveClass("backdrop-blur-md", "bg-brand/80");
  });

  it("points تواصل معنا at WhatsApp, and hides it when there is no link", () => {
    const { rerender } = render(<SiteHeader whatsapp={settings.whatsapp} />);
    expect(screen.getAllByRole("link", { name: "تواصل معنا" })[0]).toHaveAttribute("href", settings.whatsapp);

    rerender(<SiteHeader />);
    expect(screen.queryByRole("link", { name: "تواصل معنا" })).not.toBeInTheDocument();
  });

  it("shows the dashboard button only for admins", () => {
    const { rerender } = render(<SiteHeader whatsapp={settings.whatsapp} />);
    expect(screen.queryByRole("link", { name: "لوحة التحكم" })).not.toBeInTheDocument();

    rerender(<SiteHeader whatsapp={settings.whatsapp} isAdmin />);
    for (const link of screen.getAllByRole("link", { name: "لوحة التحكم" })) {
      expect(link).toHaveAttribute("href", "/dashboard");
    }
  });

  it("toggles the mobile menu and closes it with Escape", () => {
    render(<SiteHeader whatsapp={settings.whatsapp} />);
    const toggle = screen.getByRole("button", { name: "فتح القائمة" });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("button", { name: "فتح القائمة" })).toHaveAttribute("aria-expanded", "false");
  });
});

describe("SiteFooter", () => {
  it("renders the contact details from settings", () => {
    render(<SiteFooter settings={settings} />);
    expect(screen.getByText("نحو واجهة رقمية")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "+966 50 123 4567" })).toHaveAttribute("href", "tel:+966501234567");
    expect(screen.getByRole("link", { name: "hello@wajha.sa" })).toHaveAttribute("href", "mailto:hello@wajha.sa");
    expect(screen.getByText("الرياض")).toBeInTheDocument();
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it("survives missing settings (API down)", () => {
    render(<SiteFooter settings={null} />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /@/ })).not.toBeInTheDocument();
  });
});

describe("PublicChrome", () => {
  it("wraps public pages with header, footer and splash", () => {
    render(
      <PublicChrome settings={settings}>
        <p>الصفحة</p>
      </PublicChrome>,
    );
    expect(screen.getByText("الصفحة")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByTestId("splash")).toBeInTheDocument();
  });

  it("shows the admin strip only for admins", () => {
    const { rerender } = render(
      <PublicChrome settings={settings}>
        <p>x</p>
      </PublicChrome>,
    );
    expect(screen.queryByText("انت في منظور الادمن")).not.toBeInTheDocument();

    rerender(
      <PublicChrome settings={settings} isAdmin>
        <p>x</p>
      </PublicChrome>,
    );
    expect(screen.getByText("انت في منظور الادمن")).toBeInTheDocument();
  });

  it.each(["/dashboard", "/dashboard/users", "/login"])("renders %s bare, with no chrome and no admin strip", (path) => {
    nav.pathname = path;
    render(
      <PublicChrome settings={settings} isAdmin>
        <p>bare</p>
      </PublicChrome>,
    );
    expect(screen.getByText("bare")).toBeInTheDocument();
    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    expect(screen.queryByText("انت في منظور الادمن")).not.toBeInTheDocument();
  });
});

describe("DashboardSidebar", () => {
  it("lists every dashboard page and marks the current one", () => {
    nav.pathname = "/dashboard/settings";
    render(<DashboardSidebar adminName="Ali" />);

    const current = screen.getByRole("link", { name: /الإعدادات/ });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /نظرة عامة/ })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: /المحتوى/ })).toHaveAttribute("href", "/dashboard/contents");
    expect(screen.getByText("Ali")).toBeInTheDocument();
  });

  it("only highlights the overview on the exact path", () => {
    nav.pathname = "/dashboard/users";
    render(<DashboardSidebar adminName="Ali" />);
    expect(screen.getByRole("link", { name: /نظرة عامة/ })).not.toHaveAttribute("aria-current");
  });

  it("removes the closed mobile drawer from layout instead of parking it off-screen", () => {
    const { container } = render(<DashboardSidebar adminName="Ali" />);
    const aside = container.querySelector("aside")!;

    // An off-screen transform would widen the page on phones.
    expect(aside).toHaveClass("max-lg:hidden");
    expect(aside.className).not.toMatch(/translate-x/);

    fireEvent.click(screen.getByRole("button", { name: "فتح القائمة" }));
    expect(aside).not.toHaveClass("max-lg:hidden");
  });

  it("opens the drawer on mobile and locks page scroll", () => {
    render(<DashboardSidebar adminName="Ali" />);
    fireEvent.click(screen.getByRole("button", { name: "فتح القائمة" }));
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});

describe("BackToTop", () => {
  it("renders without throwing at the top of the page", () => {
    const { container } = render(<BackToTop />);
    expect(container).toBeInTheDocument();
  });
});
