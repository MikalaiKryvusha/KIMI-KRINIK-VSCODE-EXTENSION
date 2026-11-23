import { cleanup, render } from "@testing-library/react";
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
