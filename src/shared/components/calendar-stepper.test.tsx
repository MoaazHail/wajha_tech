import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { addDays, formatDayLong, parseDay, toDayString, today, weekdayNames } from "@/shared/lib/utils/date.util";

import { Calendar } from "./calendar";
import { Stepper } from "./stepper";

describe("date utils", () => {
  it("round-trips a day without a timezone shift", () => {
    expect(toDayString(new Date(2026, 10, 11))).toBe("2026-11-11");
    expect(toDayString(parseDay("2026-01-05")!)).toBe("2026-01-05");
  });

  it("rejects impossible and malformed days", () => {
    expect(parseDay("2026-02-30")).toBeNull();
    expect(parseDay("2026-13-01")).toBeNull();
    expect(parseDay("11/11/2026")).toBeNull();
  });

  it("adds days across month and year ends", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("formats a long Arabic date with western digits", () => {
    const text = formatDayLong("2026-11-11");
    expect(text).toMatch(/2026/);
    expect(text).toMatch(/11/);
  });

  it("lists seven weekday names, rotated by weekStartsOn", () => {
    const sunday = weekdayNames(0);
    const monday = weekdayNames(1);
    expect(sunday).toHaveLength(7);
    expect(monday[0]).toBe(sunday[1]);
    expect(new Set(sunday).size).toBe(7);
  });
});

describe("Calendar", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 11, 12)); // 2026-11-11
  });
  afterEach(() => vi.useRealTimers());

  it("shows the month of the minimum day with every day of it", () => {
    render(<Calendar onChange={() => {}} min="2026-11-11" />);
    expect(screen.getAllByRole("button", { name: /^2026-11-\d\d$/ })).toHaveLength(30);
  });

  it("disables days before min and after max, and enables the rest", () => {
    render(<Calendar onChange={() => {}} min="2026-11-11" max="2026-11-20" />);

    expect(screen.getByRole("button", { name: "2026-11-10" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "2026-11-11" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "2026-11-20" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "2026-11-21" })).toBeDisabled();
  });

  it("reports the clicked day and does not fire for a disabled one", () => {
    const onChange = vi.fn();
    render(<Calendar onChange={onChange} min="2026-11-11" />);

    fireEvent.click(screen.getByRole("button", { name: "2026-11-10" }));
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "2026-11-15" }));
    expect(onChange).toHaveBeenCalledWith("2026-11-15");
  });

  it("marks the selected day and today", () => {
    render(<Calendar value="2026-11-15" onChange={() => {}} min="2026-11-11" />);
    expect(screen.getByRole("button", { name: "2026-11-15" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "2026-11-11" })).toHaveAttribute("aria-current", "date");
  });

  it("applies a custom disabled rule", () => {
    render(<Calendar onChange={() => {}} min="2026-11-11" isDisabled={(day) => day === "2026-11-13"} />);
    expect(screen.getByRole("button", { name: "2026-11-13" })).toBeDisabled();
  });

  it("moves between months, stopping at the min and max months", () => {
    render(<Calendar onChange={() => {}} min="2026-11-11" max="2027-01-15" />);
    const prev = screen.getByRole("button", { name: "الشهر السابق" });
    const next = screen.getByRole("button", { name: "الشهر التالي" });

    expect(prev).toBeDisabled();

    fireEvent.click(next);
    expect(screen.getByRole("button", { name: "2026-12-01" })).toBeInTheDocument();
    expect(prev).toBeEnabled();

    fireEvent.click(next);
    expect(screen.getByRole("button", { name: "2027-01-31" })).toBeDisabled();
    expect(next).toBeDisabled();

    fireEvent.click(prev);
    expect(screen.getByRole("button", { name: "2026-12-25" })).toBeInTheDocument();
  });

  it("opens on the month of the selected value", () => {
    render(<Calendar value="2027-01-05" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "2027-01-05" })).toBeInTheDocument();
  });

  it("starts the week on the chosen day", () => {
    const { rerender } = render(<Calendar onChange={() => {}} min="2026-11-01" weekStartsOn={0} />);
    const sundayFirst = screen.getAllByRole("columnheader").map((el) => el.textContent);

    rerender(<Calendar onChange={() => {}} min="2026-11-01" weekStartsOn={6} />);
    const saturdayFirst = screen.getAllByRole("columnheader").map((el) => el.textContent);

    expect(saturdayFirst[0]).toBe(sundayFirst[6]);
  });

  it("is fluid: a 7-column grid with no fixed width", () => {
    const { container } = render(<Calendar onChange={() => {}} min="2026-11-11" className="extra" />);
    expect(container.firstChild).toHaveClass("w-full", "extra");
    expect(container.querySelectorAll(".grid-cols-7")).toHaveLength(2);
  });
});

describe("Stepper", () => {
  const steps = ["اختر اليوم", "البريد", "تأكيد", "تم"];

  it("says which step the user is on out of how many", () => {
    render(<Stepper steps={steps} current={2} />);
    expect(screen.getByText("البريد", { selector: "span.font-medium" })).toBeInTheDocument();
    expect(screen.getByText("2", { selector: ".font-mono" })).toBeInTheDocument();
    expect(screen.getByText("4", { selector: ".font-mono" })).toBeInTheDocument();
  });

  it("marks exactly one step as current", () => {
    const { container } = render(<Stepper steps={steps} current={3} />);
    const current = container.querySelectorAll('[aria-current="step"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("3: تأكيد");
  });

  it("describes finished steps to screen readers", () => {
    render(<Stepper steps={steps} current={3} />);
    expect(screen.getByText("1: اختر اليوم (مكتملة)")).toBeInTheDocument();
    expect(screen.getByText("2: البريد (مكتملة)")).toBeInTheDocument();
    expect(screen.getByText("4: تم")).toBeInTheDocument();
  });

  it("draws solid lines up to the current step and dashed ones after it", () => {
    const { container } = render(<Stepper steps={steps} current={2} />);
    const lines = Array.from(container.querySelectorAll("ol > li[aria-hidden]"));

    expect(lines).toHaveLength(3);
    expect(lines[0]).toHaveClass("border-solid");
    expect(lines[1]).toHaveClass("border-dashed");
    expect(lines[2]).toHaveClass("border-dashed");
  });

  it("clamps an out-of-range step", () => {
    const { container } = render(<Stepper steps={steps} current={9} />);
    expect(container.querySelector('[aria-current="step"]')).toHaveTextContent("4: تم");
  });

  it("starts with every line dashed on step 1", () => {
    const { container } = render(<Stepper steps={steps} current={1} />);
    expect(container.querySelectorAll("ol > li[aria-hidden].border-solid")).toHaveLength(0);
  });
});

describe("today()", () => {
  it("is a YYYY-MM-DD string", () => {
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
