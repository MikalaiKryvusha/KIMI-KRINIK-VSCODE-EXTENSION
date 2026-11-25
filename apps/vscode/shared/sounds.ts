export const SOUND_EVENTS = ["approval", "question", "error", "turnComplete"] as const;
export type SoundEvent = (typeof SOUND_EVENTS)[number];

export const SOUND_CHOICES = ["voice", "chime", "bell", "pop", "alert", "triple", "glass", "off"] as const;
export type SoundChoice = (typeof SOUND_CHOICES)[number];
export type ToneChoice = Exclude<SoundChoice, "voice" | "off">;

export interface SoundEventSetting {
  readonly sound: SoundChoice;
  readonly volume: number;
}

export type SoundSettings = Readonly<Record<SoundEvent, SoundEventSetting>>;

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  approval: { sound: "glass", volume: 80 },
  question: { sound: "voice", volume: 80 },
  error: { sound: "alert", volume: 80 },
  turnComplete: { sound: "chime", volume: 60 },
};

function isSoundChoice(value: unknown): value is SoundChoice {
  return (SOUND_CHOICES as readonly unknown[]).includes(value);
}

function isVolume(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isSoundSettings(value: unknown): value is SoundSettings {
  if (!isRecord(value)) return false;
  return SOUND_EVENTS.every((event) => {
    const setting = value[event];
    return isRecord(setting) && isSoundChoice(setting["sound"]) && isVolume(setting["volume"]);
  });
}

export function normalizeSoundSettings(value: unknown): SoundSettings {
  const source = isRecord(value) ? value : {};
  const entries = SOUND_EVENTS.map((event): [SoundEvent, SoundEventSetting] => {
    const fallback = DEFAULT_SOUND_SETTINGS[event];
    const setting = isRecord(source[event]) ? source[event] : {};
    return [event, {
      sound: isSoundChoice(setting["sound"]) ? setting["sound"] : fallback.sound,
      volume: isVolume(setting["volume"]) ? Math.round(setting["volume"]) : fallback.volume,
    }];
  });
  return Object.fromEntries(entries) as Record<SoundEvent, SoundEventSetting>;
}
