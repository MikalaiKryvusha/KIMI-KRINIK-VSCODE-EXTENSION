import { useSettingsStore } from "@/stores/settings.store";
import type { SoundEvent, SoundEventSetting } from "shared/sounds";
import { playRecordedAttention, playTone } from "./sounds";

const ATTENTION_THROTTLE_MS = 5_000;
const recentNotifications = new Map<SoundEvent, number>();

function playAttention(event: SoundEvent, setting: SoundEventSetting): void {
  if (setting.sound === "voice") {
    playRecordedAttention(event, useSettingsStore.getState().extensionConfig.language, setting.volume);
    return;
  }
  if (setting.sound === "off") return;
  playTone(setting.sound, setting.volume);
}

export function notifyAttention(event: SoundEvent, setting: SoundEventSetting, now: number = Date.now()): void {
  if (!useSettingsStore.getState().extensionConfig.soundEnabled || setting.sound === "off") return;
  const previous = recentNotifications.get(event);
  if (previous !== undefined && now - previous < ATTENTION_THROTTLE_MS) return;
  recentNotifications.set(event, now);
  playAttention(event, setting);
}

export function previewSound(event: SoundEvent, setting: SoundEventSetting): void {
  if (!useSettingsStore.getState().extensionConfig.soundEnabled || setting.sound === "off") return;
  playAttention(event, setting);
}
