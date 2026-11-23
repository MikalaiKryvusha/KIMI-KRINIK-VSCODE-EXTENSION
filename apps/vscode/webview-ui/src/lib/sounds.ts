import type { ToneChoice } from "shared/sounds";

interface Note {
  readonly frequency: number;
  readonly start: number;
  readonly duration: number;
}

const TONES: Record<ToneChoice, readonly Note[]> = {
  chime: [
    { frequency: 880, start: 0, duration: 0.18 },
    { frequency: 1320, start: 0.12, duration: 0.32 },
  ],
  bell: [{ frequency: 660, start: 0, duration: 0.7 }],
  pop: [{ frequency: 520, start: 0, duration: 0.09 }],
  alert: [
    { frequency: 740, start: 0, duration: 0.12 },
    { frequency: 740, start: 0.18, duration: 0.12 },
    { frequency: 740, start: 0.36, duration: 0.12 },
  ],
};

export function playTone(tone: ToneChoice, volume: number): void {
  try {
    if (typeof AudioContext === "undefined") return;
    const context = new AudioContext();
    const peak = Math.max(0, Math.min(volume, 100)) / 100 * 0.4;
    let end = 0;
    for (const note of TONES[tone]) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + note.start;
      oscillator.type = "sine";
      oscillator.frequency.value = note.frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(peak, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + note.duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + note.duration);
      end = Math.max(end, note.start + note.duration);
    }
    window.setTimeout(() => {
      void context.close().catch(() => undefined);
    }, (end + 0.2) * 1000);
  } catch {
    return;
  }
}
