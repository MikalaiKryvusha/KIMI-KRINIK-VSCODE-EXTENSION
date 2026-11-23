import { bridge } from "@/services";
import type { SoundEventSetting } from "shared/sounds";
import { playTone } from "./sounds";

const ATTENTION_THROTTLE_MS = 5_000;
const recentNotifications = new Map<string, number>();

export function notifyAttention(message: string, setting: SoundEventSetting, now: number = Date.now()): void {
  if (setting.sound === "off") return;
  const text = message.trim() || "Your attention is needed.";
  const previous = recentNotifications.get(text);
  if (previous !== undefined && now - previous < ATTENTION_THROTTLE_MS) return;
  recentNotifications.set(text, now);
  if (setting.sound !== "voice") {
    playTone(setting.sound, setting.volume);
    return;
  }
  void bridge.notifyAttention(text)
    .then(({ ok }) => {
      if (!ok) speakAttention(text, setting.volume);
    })
    .catch(() => speakAttention(text, setting.volume));
}

export function previewSound(message: string, setting: SoundEventSetting): void {
  if (setting.sound === "off") return;
  if (setting.sound === "voice") {
    speakAttention(message, setting.volume);
    return;
  }
  playTone(setting.sound, setting.volume);
}

function speakAttention(text: string, volume: number): void {
  try {
    if (typeof speechSynthesis === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[а-яё]/i.test(text) ? "ru-RU" : /[一-鿿]/.test(text) ? "zh-CN" : "en-US";
    utterance.rate = 0.95;
    utterance.volume = Math.max(0, Math.min(volume, 100)) / 100;
    speechSynthesis.speak(utterance);
  } catch {
    return;
  }
}
