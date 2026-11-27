import { describe, expect, it } from "vitest";

import manifest from "../package.json";
import { DEFAULT_SOUND_SETTINGS, SOUND_CHOICES, isSoundSettings, normalizeSoundSettings } from "../shared/sounds";

describe("sound settings", () => {
  it("assigns a distinct meaningful enabled sound to every event", () => {
    expect(DEFAULT_SOUND_SETTINGS).toEqual({
      approval: { sound: "glass", volume: 80 },
      question: { sound: "voice", volume: 80 },
      error: { sound: "alert", volume: 80 },
      turnComplete: { sound: "chime", volume: 60 },
    });
  });

  it("keeps manifest sound defaults matched to the shared settings and documents every choice", () => {
    const setting = manifest.contributes.configuration.properties["kimi.sounds"];
    expect(setting.default).toEqual(DEFAULT_SOUND_SETTINGS);
    for (const choice of SOUND_CHOICES) expect(setting.description).toContain(choice);
  });

  it("fills missing or invalid events with the defaults and rounds the volume", () => {
    expect(normalizeSoundSettings({ approval: { sound: "chime", volume: 42.6 }, error: { sound: "siren", volume: 300 } })).toEqual({
      ...DEFAULT_SOUND_SETTINGS,
      approval: { sound: "chime", volume: 43 },
    });
    expect(normalizeSoundSettings("broken")).toEqual(DEFAULT_SOUND_SETTINGS);
  });

  it("accepts only a complete map of known sounds with volumes from 0 to 100", () => {
    expect(isSoundSettings(DEFAULT_SOUND_SETTINGS)).toBe(true);
    expect(isSoundSettings({ ...DEFAULT_SOUND_SETTINGS, question: { sound: "voice", volume: -1 } })).toBe(false);
    expect(isSoundSettings({ approval: DEFAULT_SOUND_SETTINGS.approval })).toBe(false);
  });
});
