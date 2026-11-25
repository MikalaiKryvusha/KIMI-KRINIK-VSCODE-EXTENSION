import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let scrollTop = 0;

vi.mock("react-scroll-to-bottom", () => ({
  default: ({ children, scrollViewClassName }: { children: React.ReactNode; scrollViewClassName?: string }) => <div className={scrollViewClassName}>{children}</div>,
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
  scrollTop = 100;
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(1000);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(200);
  vi.spyOn(Element.prototype, "scrollTop", "get").mockImplementation(() => scrollTop);
  vi.spyOn(Element.prototype, "scrollTop", "set").mockImplementation((value: number) => { scrollTop = value; });
  useChatStore.setState({
    messages: [{ id: "assistant-1", role: "assistant", content: "answer", steps: [], timestamp: 0 }],
    isStreaming: false,
  });
});

afterEach(() => {
  cleanup();
  document.body.removeAttribute("data-baseuri");
  document.documentElement.classList.remove("dark");
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
    expect(sticky.className).toContain("px-2");
    expect(sticky.className).toContain("pt-2");
    expect(sticky.querySelector("[data-testid=sticky-prompt-bubble]")?.className).toContain("w-full");
    expect(sticky.querySelector("[data-testid=sticky-prompt-bubble]")?.className).toContain("bg-zinc-100");
    expect(sticky.querySelector("[data-testid=sticky-prompt-bubble]")?.className).toContain("rounded-2xl");
    expect(sticky.querySelector("[data-testid=sticky-prompt-bubble]")?.className).toContain("rounded-br-md");
    expect(screen.getByTestId("sticky-prompt-expansion").style.maxHeight).toBe("32px");
    expect(screen.getByTestId("sticky-prompt-expansion").className).toContain("transition-[max-height]");
    expect(screen.getByTestId("sticky-prompt-fade").className).toContain("from-zinc-100");
    expect(screen.getByTestId("sticky-prompt-fade").className).toContain("dark:from-zinc-800");
    expect(sticky.querySelector("button")?.className).toContain("items-center");
    expect(sticky.querySelector(".tabler-icon-chevron-down")?.getAttribute("class")).toContain("transition-transform");
    expect(sticky.querySelector(".tabler-icon-chevron-down")?.getAttribute("class")).toContain("motion-reduce:transition-none");

    fireEvent.click(within(sticky).getByRole("button", { name: /Expand/ }));
    const expansion = screen.getByTestId("sticky-prompt-expansion");
    expect(expansion.style.maxHeight).toBe("1000px");
    expect(expansion.className).toContain("transition-[max-height]");
    expect(expansion.className).toContain("motion-reduce:transition-none");
    const fullPrompt = screen.getByTestId("sticky-prompt-full");
    expect(fullPrompt.className).toContain("opacity-100");
    expect(fullPrompt.className).toContain("pr-6");
    expect(sticky.querySelector("[data-testid=sticky-prompt-full]")?.className).not.toContain("mt-2");
    expect(within(sticky).getByRole("button", { name: /Collapse/ }).className).toContain("absolute");
    expect(within(sticky).getByRole("button", { name: /Collapse/ }).className).toContain("right-2");
    expect(sticky.querySelector(".tabler-icon-chevron-down")?.getAttribute("class")).toContain("rotate-180");
    expect(sticky.querySelector("[data-testid=sticky-prompt-full]")).not.toBeNull();
    const thumbnail = sticky.querySelector('img[alt="Media"]');
    expect(thumbnail?.getAttribute("src")).toBe(image);
    fireEvent.click(thumbnail!);
    expect(document.querySelector('img[alt="Preview"]')?.getAttribute("src")).toBe(image);
    fireEvent.keyDown(document, { key: "Escape" });

    fireEvent.click(within(sticky).getByRole("button", { name: /Collapse/ }));
    expect(screen.getByTestId("sticky-prompt-expansion").style.maxHeight).toBe("32px");
    expect(screen.getByTestId("sticky-prompt-full").className).toContain("opacity-100");
    expect(screen.getByTestId("sticky-prompt-fade")).not.toBeNull();
    expect(screen.getByTestId("sticky-prompt-full").getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelectorAll("[data-testid=sticky-user-prompt]")).toHaveLength(1);
  });

  it("hides expansion when the prompt already fits one line", () => {
    useChatStore.setState({ messages: [promptMessages[0]!, promptMessages[1]!], isStreaming: false });
    render(<ChatArea />);

    expect(screen.queryByRole("button", { name: /Expand/ })).toBeNull();
  });

  it("keeps a horizontally truncated single-line prompt free of collapse state and fade", () => {
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(500);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100);
    const singleLine = "one line that exceeds the available sticky width";
    useChatStore.setState({
      messages: [
        { id: "user-one-line", role: "user", content: singleLine, timestamp: 1, turnIndex: 0 },
        { id: "assistant-one-line", role: "assistant", content: "answer", timestamp: 2, steps: [], turnIndex: 0 },
      ],
      isStreaming: false,
    });
    render(<ChatArea />);

    const sticky = screen.getByTestId("sticky-user-prompt");
    expect(sticky.textContent).toContain(singleLine);
    expect(sticky.querySelector("button")?.getAttribute("aria-expanded")).toBeNull();
    expect(sticky.querySelector("button")?.getAttribute("aria-controls")).toBeNull();
    expect(screen.queryByRole("button", { name: /Expand/ })).toBeNull();
    expect(screen.queryByTestId("sticky-prompt-expansion")).toBeNull();
    expect(screen.queryByTestId("sticky-prompt-fade")).toBeNull();
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

  it("hides the sticky prompt at the top and restores it after scrolling", () => {
    useChatStore.setState({ messages: promptMessages, isStreaming: false });
    scrollTop = 0;
    render(<ChatArea />);

    expect(screen.queryByTestId("sticky-user-prompt")).toBeNull();
    const scroll = document.querySelector(".chat-scroll-view")!;
    act(() => {
      scrollTop = 100;
      fireEvent.scroll(scroll);
    });
    expect(screen.queryByTestId("sticky-user-prompt")).not.toBeNull();
  });

  it("keeps an expanded sticky prompt open on wheel and touch scrolling", () => {
    useChatStore.setState({
      messages: [
        { id: "user-long", role: "user", content: "first line\nsecond line", timestamp: 1, turnIndex: 0 },
        { id: "assistant-long", role: "assistant", content: "answer", timestamp: 2, steps: [], turnIndex: 0 },
      ],
      isStreaming: false,
    });
    render(<ChatArea />);
    const scroll = document.querySelector(".chat-scroll-view")!;

    fireEvent.click(screen.getByRole("button", { name: /Expand/ }));
    expect(screen.getByTestId("sticky-prompt-full").getAttribute("aria-hidden")).toBe("false");
    fireEvent.wheel(scroll);
    expect(screen.getByRole("button", { name: /Collapse/ })).not.toBeNull();
    expect(screen.getByTestId("sticky-prompt-full").getAttribute("aria-hidden")).toBe("false");

    fireEvent.touchMove(scroll);
    expect(screen.getByRole("button", { name: /Collapse/ })).not.toBeNull();
    expect(screen.getByTestId("sticky-prompt-full").getAttribute("aria-hidden")).toBe("false");
  });

  it("does not resurrect an expansion after another prompt becomes sticky", () => {
    const firstMessages: ChatMessageType[] = [
      { id: "user-long", role: "user", content: "first line\nsecond line", timestamp: 1, turnIndex: 0 },
      { id: "assistant-long", role: "assistant", content: "answer", timestamp: 2, steps: [], turnIndex: 0 },
    ];
    useChatStore.setState({ messages: firstMessages, isStreaming: false });
    render(<ChatArea />);

    fireEvent.click(screen.getByRole("button", { name: /Expand/ }));
    expect(screen.queryByTestId("sticky-prompt-full")).not.toBeNull();
    act(() => useChatStore.setState({ messages: promptMessages }));
    act(() => useChatStore.setState({ messages: firstMessages }));

    expect(screen.getByTestId("sticky-prompt-full").getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByTestId("sticky-prompt-expansion").style.maxHeight).toBe("32px");
  });
});

describe("steering presentation", () => {
  it("keeps the current robot and working state until the post-steer response has content", () => {
    document.body.setAttribute("data-baseuri", "https://extension.test");
    const deferredAssistant: ChatMessageType = {
      id: "assistant-steered",
      role: "assistant",
      content: "",
      timestamp: 4,
      steps: [],
      clientId: "steer-client",
      optimistic: true,
      deferPresentation: true,
    };
    useChatStore.setState({
      messages: [
        { id: "user-original", role: "user", content: "original", timestamp: 1, clientId: "original-client" },
        {
          id: "assistant-original",
          role: "assistant",
          content: "",
          timestamp: 2,
          steps: [{ n: 1, items: [{ type: "thinking", content: "thinking", finished: false }] }],
          clientId: "original-client",
        },
        { id: "steer-client", role: "user", content: "steer", timestamp: 3, clientId: "steer-client", optimistic: true },
        deferredAssistant,
      ],
      isStreaming: true,
    });
    render(<ChatArea />);

    expect(screen.getAllByRole("img", { name: "KIMI KRINIK" })).toHaveLength(1);
    const trailing = screen.getByTestId("trailing-working-indicator");
    const steeringText = screen.getAllByText("steer").at(-1)!;
    expect(trailing.textContent).toBe("Working…");
    expect(trailing.closest("[data-message-id]")).toBeNull();
    expect(steeringText.compareDocumentPosition(trailing) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    act(() => useChatStore.setState((state) => ({
      messages: state.messages.map((message) => message.id === "assistant-steered"
        ? { ...message, steps: [{ n: 1, items: [{ type: "text", content: "post-steer answer", finished: false }] }] }
        : message),
    })));

    expect(screen.getAllByRole("img", { name: "KIMI KRINIK" })).toHaveLength(2);
    expect(screen.queryByTestId("trailing-working-indicator")).toBeNull();
    expect(screen.getByRole("status").closest("[data-message-id]")?.getAttribute("data-message-id")).toBe("assistant-steered");
    document.body.removeAttribute("data-baseuri");
  });
});

describe("welcome screen", () => {
  it("always shows the full shortcut guide and centers the robot with KIMI", () => {
    document.body.setAttribute("data-baseuri", "https://extension.test");
    document.documentElement.classList.add("dark");
    const random = vi.spyOn(Math, "random").mockReturnValue(0.99);
    useChatStore.setState({ messages: [], isStreaming: false });
    render(<ChatArea />);

    expect(random).not.toHaveBeenCalled();
    expect(screen.getByText("⚡ Commands")).not.toBeNull();
    expect(screen.getByText("💡 Tips")).not.toBeNull();
    expect(screen.getByText("🚀 Pro Tips")).not.toBeNull();
    expect(screen.getByText("/compact")).not.toBeNull();
    expect(screen.getByText("Alt+K")).not.toBeNull();

    const robot = screen.getByRole("img", { name: "KIMI KRINIK" });
    const wordmark = screen.getByRole("img", { name: "KIMI" });
    expect(robot.getAttribute("src")).toBe("https://extension.test/resources/krinik-robot-logo.png");
    expect(wordmark.getAttribute("src")).toBe("https://extension.test/dist/kimi-banner-dark.svg");
    expect(robot.parentElement).toBe(wordmark.parentElement);
    expect(robot.nextElementSibling).toBe(wordmark);
    expect(robot.parentElement?.className).toContain("items-center");
    expect(robot.parentElement?.className).toContain("justify-center");
    expect(robot.parentElement?.className).toContain("max-w-full");
    expect(robot.className).toContain("w-[72px]");
    expect(robot.parentElement?.className).toContain("gap-4");
    expect(wordmark.className).toContain("min-w-0");
  });
});
