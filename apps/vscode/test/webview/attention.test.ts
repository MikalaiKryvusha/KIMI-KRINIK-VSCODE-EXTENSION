import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  speak: vi.fn(),
  playTone: vi.fn(),
  playRecordedAttention: vi.fn(),
}));

vi.mock("../../webview-ui/src/lib/sounds", () => ({
  playTone: boundary.playTone,
  playRecordedAttention: boundary.playRecordedAttention,
}));

import { notifyAttention, previewSound } from "../../webview-ui/src/lib/attention";
import { DEFAULT_EXTENSION_CONFIG, useSettingsStore } from "../../webview-ui/src/stores/settings.store";

const VOICE = { sound: "voice", volume: 80 } as const;

beforeEach(() => {
  useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, soundEnabled: true, language: "ru" } });
  boundary.speak.mockReset();
  boundary.playTone.mockReset();
  boundary.playRecordedAttention.mockReset();
  vi.stubGlobal("speechSynthesis", { speak: boundary.speak });
});

afterEach(() => vi.unstubAllGlobals());

describe("attention notifications", () => {
  it("plays the prerecorded Russian event without dynamic speech or an identity prefix", () => {
    notifyAttention("approval", VOICE, 1_000);

    expect(boundary.playRecordedAttention).toHaveBeenCalledWith("approval", "ru", 80);
    expect(boundary.speak).not.toHaveBeenCalled();
    expect(boundary.playTone).not.toHaveBeenCalled();
  });

  it("throttles the same event instead of reading dynamic message text", () => {
    notifyAttention("question", { sound: "voice", volume: 40 }, 1_000);
    notifyAttention("question", { sound: "voice", volume: 40 }, 2_000);
    notifyAttention("question", { sound: "voice", volume: 40 }, 7_000);

    expect(boundary.playRecordedAttention).toHaveBeenCalledTimes(2);
    expect(boundary.playRecordedAttention).toHaveBeenNthCalledWith(1, "question", "ru", 40);
    expect(boundary.playRecordedAttention).toHaveBeenNthCalledWith(2, "question", "ru", 40);
  });

  it("uses the Chinese recording for the error event and preview without throttling", () => {
    useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, soundEnabled: true, language: "zh" } });
    previewSound("error", { sound: "voice", volume: 50 });
    previewSound("error", { sound: "voice", volume: 50 });

    expect(boundary.playRecordedAttention).toHaveBeenNthCalledWith(1, "error", "zh", 50);
    expect(boundary.playRecordedAttention).toHaveBeenNthCalledWith(2, "error", "zh", 50);
    expect(boundary.speak).not.toHaveBeenCalled();
  });

  it("plays the chosen tone at its volume without the recording route", () => {
    notifyAttention("approval", { sound: "chime", volume: 30 }, 50_000);

    expect(boundary.playTone).toHaveBeenCalledWith("chime", 30);
    expect(boundary.playRecordedAttention).not.toHaveBeenCalled();
  });

  it("stays silent for an event switched off or the global switch off", () => {
    notifyAttention("turnComplete", { sound: "off", volume: 60 }, 90_000);
    useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, soundEnabled: false } });
    notifyAttention("turnComplete", { sound: "chime", volume: 60 }, 90_000);
    previewSound("turnComplete", { sound: "chime", volume: 60 });

    expect(boundary.playTone).not.toHaveBeenCalled();
    expect(boundary.playRecordedAttention).not.toHaveBeenCalled();
    expect(boundary.speak).not.toHaveBeenCalled();
  });

  it("plays triple and Glass through the existing tone route", () => {
    notifyAttention("turnComplete", { sound: "triple", volume: 40 }, 100_000);
    notifyAttention("approval", { sound: "glass", volume: 30 }, 200_000);

    expect(boundary.playTone).toHaveBeenNthCalledWith(1, "triple", 40);
    expect(boundary.playTone).toHaveBeenNthCalledWith(2, "glass", 30);
    expect(boundary.playRecordedAttention).not.toHaveBeenCalled();
  });
});
