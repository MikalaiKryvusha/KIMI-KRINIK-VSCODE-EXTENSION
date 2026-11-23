import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  notifyAttention: vi.fn(),
  speak: vi.fn(),
}));

vi.mock("@/services", () => ({
  bridge: { notifyAttention: boundary.notifyAttention },
}));

import { notifyAttention } from "../../webview-ui/src/lib/attention";

beforeEach(() => {
  boundary.notifyAttention.mockReset();
  boundary.speak.mockReset();
  vi.stubGlobal("speechSynthesis", { speak: boundary.speak });
  vi.stubGlobal("SpeechSynthesisUtterance", class {
    lang = "";
    rate = 1;
    volume = 1;
    constructor(readonly text: string) {}
  });
});

afterEach(() => vi.unstubAllGlobals());

describe("attention notifications", () => {
  it("uses the configured Glass route without browser speech", async () => {
    boundary.notifyAttention.mockResolvedValue({ ok: true });
    notifyAttention("Answer required", 1_000);
    await Promise.resolve();

    expect(boundary.notifyAttention).toHaveBeenCalledWith("Answer required");
    expect(boundary.speak).not.toHaveBeenCalled();
  });

  it("falls back to speech only when Glass is unavailable and throttles duplicates", async () => {
    boundary.notifyAttention.mockResolvedValue({ ok: false });
    notifyAttention("Нужен ответ", 1_000);
    notifyAttention("Нужен ответ", 2_000);
    notifyAttention("Нужен ответ", 7_000);
    await Promise.resolve();

    expect(boundary.notifyAttention).toHaveBeenCalledTimes(2);
    expect(boundary.speak).toHaveBeenCalledTimes(2);
    expect(boundary.speak.mock.calls[0]?.[0].lang).toBe("ru-RU");
  });
});
