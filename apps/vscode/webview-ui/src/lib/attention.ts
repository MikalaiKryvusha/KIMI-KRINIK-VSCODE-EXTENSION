import { bridge } from "@/services";

const ATTENTION_THROTTLE_MS = 5_000;
const recentNotifications = new Map<string, number>();

export function notifyAttention(message: string, now: number = Date.now()): void {
  const text = message.trim() || "Your attention is needed.";
  const previous = recentNotifications.get(text);
  if (previous !== undefined && now - previous < ATTENTION_THROTTLE_MS) return;
  recentNotifications.set(text, now);
  void bridge.notifyAttention(text)
    .then(({ ok }) => {
      if (!ok) speakAttention(text);
    })
    .catch(() => speakAttention(text));
}

function speakAttention(text: string): void {
  try {
    if (typeof speechSynthesis === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[а-яё]/i.test(text) ? "ru-RU" : "en-US";
    utterance.rate = 0.95;
    utterance.volume = 0.9;
    speechSynthesis.speak(utterance);
  } catch {
    return;
  }
}
