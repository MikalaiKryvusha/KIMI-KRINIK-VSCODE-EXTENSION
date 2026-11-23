import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  notifyAttention: vi.fn(),
  speak: vi.fn(),
  playTone: vi.fn(),
}));

vi.mock("@/services", () => ({
  bridge: { notifyAttention: boundary.notifyAttention },
}));
vi.mock("../../webview-ui/src/lib/sounds", () => ({
  playTone: boundary.playTone,
}));

import { notifyAttention, previewSound } from "../../webview-ui/src/lib/attention";

const VOICE = { sound: "voice", volume: 80 } as const;

beforeEach(() => {
  boundary.notifyAttention.mockReset();
  boundary.speak.mockReset();
  boundary.playTone.mockReset();
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
    notifyAttention("Answer required", VOICE, 1_000);
    await Promise.resolve();

    expect(boundary.notifyAttention).toHaveBeenCalledWith("Answer required");
    expect(boundary.speak).not.toHaveBeenCalled();
  });

  it("falls back to speech at the chosen volume only when Glass is unavailable and throttles duplicates", async () => {
    boundary.notifyAttention.mockResolvedValue({ ok: false });
    notifyAttention("Нужен ответ", { sound: "voice", volume: 40 }, 1_000);
    notifyAttention("Нужен ответ", { sound: "voice", volume: 40 }, 2_000);
    notifyAttention("Нужен ответ", { sound: "voice", volume: 40 }, 7_000);
    await Promise.resolve();

    expect(boundary.notifyAttention).toHaveBeenCalledTimes(2);
    expect(boundary.speak).toHaveBeenCalledTimes(2);
    expect(boundary.speak.mock.calls[0]?.[0]).toMatchObject({ lang: "ru-RU", volume: 0.4 });
  });

  it("plays the chosen tone at its volume and skips the voice route", () => {
    notifyAttention("Approval required", { sound: "chime", volume: 30 }, 50_000);

    expect(boundary.playTone).toHaveBeenCalledWith("chime", 30);
    expect(boundary.notifyAttention).not.toHaveBeenCalled();
  });

  it("stays silent for an event switched off", () => {
    notifyAttention("Done", { sound: "off", volume: 60 }, 90_000);

    expect(boundary.playTone).not.toHaveBeenCalled();
    expect(boundary.notifyAttention).not.toHaveBeenCalled();
    expect(boundary.speak).not.toHaveBeenCalled();
  });

  it("previews a tone or the voice without the throttle", () => {
    previewSound("Error", { sound: "bell", volume: 70 });
    previewSound("Error", { sound: "bell", volume: 70 });
    previewSound("Error", { sound: "voice", volume: 50 });

    expect(boundary.playTone).toHaveBeenCalledTimes(2);
    expect(boundary.speak.mock.calls[0]?.[0]).toMatchObject({ text: "Error", volume: 0.5 });
  });
});
