import { bridge } from "@/services";
import { useSettingsStore } from "@/stores/settings.store";
import type { SoundEventSetting } from "shared/sounds";
import { playTone } from "./sounds";

const ATTENTION_THROTTLE_MS = 5_000;
const ATTENTION_IDENTITY_PREFIX = "Николай, это Кими Криник.";
const recentNotifications = new Map<string, number>();

function attentionText(message: string): string {
  const text = message.trim() || "Your attention is needed.";
  return text.startsWith(ATTENTION_IDENTITY_PREFIX) ? text : `${ATTENTION_IDENTITY_PREFIX} ${text}`;
}

export function notifyAttention(message: string, setting: SoundEventSetting, now: number = Date.now()): void {
  if (!useSettingsStore.getState().extensionConfig.soundEnabled || setting.sound === "off") return;
  const text = attentionText(message);
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
  if (!useSettingsStore.getState().extensionConfig.soundEnabled || setting.sound === "off") return;
  if (setting.sound === "voice") {
    speakAttention(message, setting.volume);
    return;
  }
  playTone(setting.sound, setting.volume);
}

function speakAttention(text: string, volume: number): void {
  try {
    if (typeof speechSynthesis === "undefined") return;
    const spokenText = attentionText(text);
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = /[а-яё]/i.test(spokenText) ? "ru-RU" : /[一-鿿]/.test(spokenText) ? "zh-CN" : "en-US";
    if (utterance.lang === "ru-RU" && typeof speechSynthesis.getVoices === "function") {
      const voices = speechSynthesis.getVoices();
      const voice = voices.find((candidate) => /eugene|eugeny/i.test(candidate.name) && candidate.lang.toLowerCase().startsWith("ru"))
        ?? voices.find((candidate) => candidate.lang.toLowerCase().startsWith("ru"));
      if (voice) utterance.voice = voice;
    }
    utterance.rate = 0.95;
    utterance.volume = Math.max(0, Math.min(volume, 100)) / 100;
    speechSynthesis.speak(utterance);
  } catch {
    return;
  }
}
