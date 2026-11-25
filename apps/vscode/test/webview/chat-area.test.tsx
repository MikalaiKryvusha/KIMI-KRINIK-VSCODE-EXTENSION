import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-scroll-to-bottom", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useScrollToBottom: () => vi.fn(),
  useSticky: () => [false],
}));
vi.mock("@/services", () => ({
  bridge: {
    checkFilesExist: vi.fn(async () => ({})),
    getImageDataUri: vi.fn(),
    openFile: vi.fn(),
  },
}));

import { ChatArea } from "../../webview-ui/src/components/ChatArea";
import { getLatestPromptKey, getPromptKey, selectActivePromptId } from "../../webview-ui/src/components/StickyUserPrompt";
import { useChatStore } from "../../webview-ui/src/stores/chat.store";
import type { ChatMessage as ChatMessageType } from "../../webview-ui/src/stores/chat.store";

beforeEach(() => {
  useChatStore.setState({
    messages: [{ id: "assistant-1", role: "assistant", content: "answer", steps: [], timestamp: 0 }],
    isStreaming: false,
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("scroll to bottom button", () => {
  it("uses the brand pink background", () => {
    render(<ChatArea />);

    const button = document.querySelector(".tabler-icon-arrow-down")?.closest("button");
    expect(button?.className).toContain("bg-[#FF1A8C]");
    expect(button?.className).not.toContain("bg-blue-400");
  });
});

const promptMessages: ChatMessageType[] = [
  { id: "user-1", role: "user", content: "first prompt", timestamp: 1, turnIndex: 0 },
  { id: "assistant-1", role: "assistant", content: "first answer", timestamp: 2, steps: [], turnIndex: 0 },
  { id: "user-2", role: "user", content: "second prompt", timestamp: 3, turnIndex: 1 },
  { id: "assistant-2", role: "assistant", content: "second answer", timestamp: 4, steps: [], turnIndex: 1 },
  { id: "steer-3", role: "user", content: "steering prompt", timestamp: 5, clientId: "steer-client" },
  { id: "assistant-3", role: "assistant", content: "steering answer", timestamp: 6, steps: [] },
];

describe("sticky user prompt", () => {
  it("selects the prompt owning the visible assistant turn with boundary hysteresis", () => {
    const tops = new Map([["assistant-1", -240], ["assistant-2", 40], ["assistant-3", 400]]);
    expect(selectActivePromptId(promptMessages, tops)).toBe("turn:1");
    expect(selectActivePromptId(promptMessages, new Map([["assistant-1", -240], ["assistant-2", 85]]), "turn:0")).toBe("turn:0");
    expect(selectActivePromptId(promptMessages, new Map([["assistant-1", -240], ["assistant-2", 50]]), "turn:0")).toBe("turn:1");
    expect(selectActivePromptId(promptMessages, new Map([["assistant-1", -100], ["assistant-2", 500], ["assistant-3", 800]]), "turn:0")).toBe("turn:0");
  });

  it("uses clientId, durable turn and content/order identities in that order", () => {
    expect(getPromptKey(promptMessages[4]!, 4)).toBe("steer-client");
    expect(getPromptKey(promptMessages[0]!, 0)).toBe("turn:0");
    expect(getPromptKey({ id: "legacy", role: "user", content: "old prompt", timestamp: 0 }, 0)).toBe("content:0:old prompt");
    expect(getLatestPromptKey(promptMessages)).toBe("steer-client");
  });

  it("expands full text and media with the existing viewer and collapses back", () => {
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(500);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100);
    const image = "data:image/png;base64,AAAA";
    useChatStore.setState({
      messages: [
        promptMessages[0]!,
        promptMessages[1]!,
        {
          id: "user-media",
          role: "user",
          content: [{ type: "text", text: "second full prompt" }, { type: "image_url", image_url: { url: image } }],
          timestamp: 3,
          turnIndex: 1,
        },
        promptMessages[3]!,
      ],
      isStreaming: false,
    });
    const { container } = render(<ChatArea />);
    const sticky = screen.getByTestId("sticky-user-prompt");
    expect(sticky.textContent).toContain("second full prompt");
    expect(sticky.querySelector("[data-testid=sticky-prompt-bubble]")?.className).toContain("w-full");
    expect(sticky.querySelector("[data-testid=sticky-prompt-bubble]")?.className).toContain("bg-zinc-100");
    expect(sticky.querySelector("[data-testid=sticky-prompt-bubble]")?.className).toContain("rounded-2xl");
    expect(sticky.querySelector("[data-testid=sticky-prompt-bubble]")?.className).toContain("rounded-br-md");
    expect(sticky.querySelector(".tabler-icon-chevron-down")?.getAttribute("class")).toContain("transition-transform");
    expect(sticky.querySelector(".tabler-icon-chevron-down")?.getAttribute("class")).toContain("motion-reduce:transition-none");

    fireEvent.click(within(sticky).getByRole("button", { name: /Expand/ }));
    expect(sticky.querySelector("[data-testid=sticky-prompt-full]")?.className).toContain("animate-in");
    expect(sticky.querySelector("[data-testid=sticky-prompt-full]")?.className).toContain("motion-reduce:animate-none");
    expect(sticky.querySelector(".tabler-icon-chevron-down")?.getAttribute("class")).toContain("rotate-180");
    expect(sticky.querySelector("[data-testid=sticky-prompt-full]")).not.toBeNull();
    const thumbnail = sticky.querySelector('img[alt="Media"]');
    expect(thumbnail?.getAttribute("src")).toBe(image);
    fireEvent.click(thumbnail!);
    expect(document.querySelector('img[alt="Preview"]')?.getAttribute("src")).toBe(image);
    fireEvent.keyDown(document, { key: "Escape" });

    fireEvent.click(within(sticky).getByRole("button", { name: /Collapse/ }));
    expect(sticky.querySelector("[data-testid=sticky-prompt-full]")).toBeNull();
    expect(container.querySelectorAll("[data-testid=sticky-user-prompt]")).toHaveLength(1);
  });

  it("hides expansion when the prompt already fits one line", () => {
    useChatStore.setState({ messages: [promptMessages[0]!, promptMessages[1]!], isStreaming: false });
    render(<ChatArea />);

    expect(screen.queryByRole("button", { name: /Expand/ })).toBeNull();
  });

  it("shows a media-only summary without inventing prompt text", () => {
    const image = "data:image/png;base64,AAAA";
    useChatStore.setState({
      messages: [
        { id: "media-only", role: "user", content: [{ type: "image_url", image_url: { url: image } }], timestamp: 1, clientId: "media-only" },
        { id: "assistant-media", role: "assistant", content: "answer", timestamp: 2, steps: [] },
      ],
      isStreaming: false,
    });
    render(<ChatArea />);

    expect(screen.getByTestId("sticky-user-prompt").textContent).toContain("(media)");
  });
});
