import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SplashScreen } from "./splash-screen";

describe("SplashScreen", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("locks page scroll while shown, then removes itself and unlocks", () => {
    const { container } = render(<SplashScreen />);
    expect(container.firstChild).not.toBeNull();
    expect(document.body.style.overflow).toBe("hidden");

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    expect(container.firstChild).toBeNull();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
