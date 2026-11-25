import { afterEach, describe, expect, it, vi } from "vitest";

import { playRecordedAttention, playTone } from "../../webview-ui/src/lib/sounds";

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.removeAttribute("data-baseuri");
});

describe("sound generation", () => {
  it("plays the exact 880/660/990 triple beep", () => {
    const starts: number[] = [];
    const stops: number[] = [];
    const frequencies: number[] = [];
    const gain = {
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(() => ({ destination: {} })),
    };
    vi.stubGlobal("AudioContext", class {
      currentTime = 0;
      destination = {};
      createOscillator() {
        const oscillator = {
          type: "",
          frequency: { value: 0 },
          connect: vi.fn(() => gain),
          start: (time: number) => {
            frequencies.push(oscillator.frequency.value);
            starts.push(time);
          },
          stop: (time: number) => stops.push(time),
        };
        return oscillator;
      }
      createGain() { return gain; }
      close() { return Promise.resolve(); }
    });

    playTone("triple", 50);

    expect(frequencies).toEqual([880, 660, 990]);
    expect(starts).toEqual([0, 0.2, 0.4]);
    expect(stops).toEqual([0.16, 0.36, 0.66]);
  });

  it("plays the exact packaged recording for the event and language", () => {
    document.body.setAttribute("data-baseuri", "https://extension.test");
    const audio = { volume: 1, play: vi.fn(async () => undefined) };
    const AudioMock = vi.fn(function (this: typeof audio) { Object.assign(this, audio); });
    vi.stubGlobal("Audio", AudioMock);

    playRecordedAttention("error", "zh", 45);

    expect(AudioMock).toHaveBeenCalledWith("https://extension.test/resources/attention/zh/error.mp3");
    expect(AudioMock.mock.instances[0]?.volume).toBe(0.45);
    expect(audio.play).toHaveBeenCalledTimes(1);
  });

  it("reports a rejected packaged-audio play instead of swallowing it", async () => {
    const failure = new Error("play rejected");
    const audio = { volume: 1, play: vi.fn(async () => { throw failure; }) };
    const AudioMock = vi.fn(function (this: typeof audio) { Object.assign(this, audio); });
    vi.stubGlobal("Audio", AudioMock);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    playTone("glass", 30);
    await Promise.resolve();

    expect(error).toHaveBeenCalledWith("KIMI KRINIK audio playback failed: resources/glass.mp3", failure);
    error.mockRestore();
  });

  it("plays the packaged Glass audio at the chosen volume", () => {
    document.body.setAttribute("data-baseuri", "https://extension.test");
    const audio = {
      src: "",
      volume: 1,
      play: vi.fn(async () => undefined),
    };
    const AudioMock = vi.fn(function (this: typeof audio, src: string) {
      this.src = src;
      Object.assign(this, audio);
      return this;
    });
    vi.stubGlobal("Audio", AudioMock);

    playTone("glass", 30);

    expect(AudioMock).toHaveBeenCalledWith("https://extension.test/resources/glass.mp3");
    expect(AudioMock.mock.instances[0]?.volume).toBe(0.3);
    expect(audio.play).toHaveBeenCalledTimes(1);
  });
});
