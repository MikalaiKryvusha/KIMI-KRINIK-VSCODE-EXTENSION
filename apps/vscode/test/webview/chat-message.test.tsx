import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services", () => ({
  bridge: {
    checkFilesExist: vi.fn(async () => ({})),
    getImageDataUri: vi.fn(),
    openFile: vi.fn(),
  },
}));

import { ChatMessage } from "../../webview-ui/src/components/ChatMessage";

afterEach(cleanup);

describe("user message rendering", () => {
  it("preserves manual line breaks without adding paragraph spacing", () => {
    const { container } = render(
      <ChatMessage
        message={{
          id: "user-1",
          role: "user",
          content: "first line\nsecond line\n\nthird paragraph",
          timestamp: 0,
        }}
      />,
    );

    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]?.textContent).toBe("first line\nsecond line");
    expect(paragraphs[0]?.className).toBe("mb-2 last:mb-0");
    expect(paragraphs[0]?.parentElement?.className).toContain("[&_p]:whitespace-pre-wrap");
    expect(paragraphs[1]?.textContent).toBe("third paragraph");
  });

  it("shows the localized send time to the left of the user bubble", () => {
    const timestamp = Date.UTC(2026, 0, 2, 3, 4);
    const { container } = render(<ChatMessage message={{ id: "user-time", role: "user", content: "hello", timestamp }} />);

    const time = container.querySelector("time");
    const bubble = container.querySelector(".rounded-2xl");
    expect(time?.textContent).toBe(new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(timestamp));
    expect(time?.getAttribute("dateTime")).toBe(new Date(timestamp).toISOString());
    expect(time?.parentElement?.className).toContain("items-center");
    expect(time?.nextElementSibling).toBe(bubble);
    expect(bubble?.contains(time)).toBe(false);
  });
});

describe("steering media", () => {
  it("renders image and video thumbnails and opens the same URIs in the viewer", () => {
    const image = "data:image/png;base64,AAAA";
    const video = "data:video/mp4;base64,BBBB";
    const { container } = render(
      <ChatMessage
        message={{
          id: "assistant-steer-media",
          role: "assistant",
          content: "",
          steps: [{
            n: 1,
            items: [{
              type: "steer",
              content: [
                { type: "text", text: "look" },
                { type: "image_url", image_url: { url: image } },
                { type: "video_url", video_url: { url: video } },
              ],
            }],
          }],
          timestamp: 0,
        }}
      />,
    );

    const thumbnail = container.querySelector('img[alt="Media"]');
    const videoThumbnail = container.querySelector("video");
    expect(thumbnail?.getAttribute("src")).toBe(image);
    expect(videoThumbnail?.getAttribute("src")).toBe(video);

    fireEvent.click(thumbnail!);
    expect(document.querySelector('img[alt="Preview"]')?.getAttribute("src")).toBe(image);
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(videoThumbnail!);
    expect(document.querySelector(".fixed video")?.getAttribute("src")).toBe(video);
  });
});

describe("working indicator", () => {
  it("keeps both animated eyes inside the pink face and follows the working state", () => {
    const { container, rerender } = render(
      <ChatMessage
        message={{ id: "assistant-1", role: "assistant", content: "", steps: [], timestamp: 0 }}
        isStreaming
      />,
    );

    expect(container.querySelector("[role=status]")?.textContent).toBe("Requesting…");
    const face = container.querySelector(".kimi-wi-face");
    expect(face).not.toBeNull();
    expect(face?.querySelectorAll(".kimi-wi-eye")).toHaveLength(2);
    expect(container.querySelector(".kimi-wi-eyes")?.parentElement).toBe(face);

    rerender(
      <ChatMessage
        message={{ id: "assistant-1", role: "assistant", content: "answer", steps: [], timestamp: 0 }}
        isStreaming
      />,
    );
    expect(container.querySelector("[role=status]")?.textContent).toBe("Working…");
  });
});

describe("assistant streaming text", () => {
  it("keeps the visible text node mounted when its step finishes", () => {
    const { container, rerender } = render(
      <ChatMessage
        message={{
          id: "assistant-streaming-text",
          role: "assistant",
          content: "",
          steps: [{ n: 1, items: [{ type: "text", content: "visible answer", finished: false }] }],
          timestamp: 0,
        }}
        isStreaming
      />,
    );
    const before = Array.from(container.querySelectorAll("p")).find((paragraph) => paragraph.textContent === "visible answer");
    expect(before).not.toBeUndefined();

    rerender(
      <ChatMessage
        message={{
          id: "assistant-streaming-text",
          role: "assistant",
          content: "",
          steps: [{ n: 1, items: [{ type: "text", content: "visible answer", finished: true }] }],
          timestamp: 0,
        }}
      />,
    );

    const after = Array.from(container.querySelectorAll("p")).find((paragraph) => paragraph.textContent === "visible answer");
    expect(after).toBe(before);
  });

  it("keeps the fallback response mounted when streaming finishes", () => {
    const { container, rerender } = render(
      <ChatMessage
        message={{ id: "assistant-fallback-text", role: "assistant", content: "fallback answer", steps: [], timestamp: 0 }}
        isStreaming
      />,
    );
    const before = Array.from(container.querySelectorAll("p")).find((paragraph) => paragraph.textContent === "fallback answer");
    expect(before).not.toBeUndefined();

    rerender(
      <ChatMessage
        message={{ id: "assistant-fallback-text", role: "assistant", content: "fallback answer", steps: [], timestamp: 0 }}
      />,
    );

    const after = Array.from(container.querySelectorAll("p")).find((paragraph) => paragraph.textContent === "fallback answer");
    expect(after).toBe(before);
  });
});

describe("assistant response brand", () => {
  it("loads the pink KIMI KRINIK robot from the packaged resources", () => {
    document.body.setAttribute("data-baseuri", "https://extension.test");
    try {
      const { container } = render(
        <ChatMessage
          message={{ id: "assistant-brand", role: "assistant", content: "answer", steps: [], timestamp: 0 }}
        />,
      );

      const image = container.querySelector<HTMLImageElement>('img[alt="KIMI KRINIK"]');
      expect(image).not.toBeNull();
      expect(image?.getAttribute("src")).toBe("https://extension.test/resources/krinik-robot-logo.png");
      expect(image?.className).toContain("size-6");
      expect(image?.className).not.toContain("rounded");
      expect(image?.style.height).toBe("auto");
    } finally {
      document.body.removeAttribute("data-baseuri");
    }
  });

  it("uses the brand pink for step path dots and their glow", () => {
    const { container } = render(
      <ChatMessage
        message={{
          id: "assistant-steps",
          role: "assistant",
          content: "",
          steps: [{ n: 1, items: [{ type: "thinking", content: "step", finished: false }] }],
          timestamp: 0,
        }}
        isStreaming
      />,
    );

    const dot = container.querySelector(".size-1\\.5.rounded-full");
    expect(dot?.className).toContain("bg-[#FF1A8C]");
    expect(dot?.className).toContain("rgba(255,26,140,0.6)");
  });
});
