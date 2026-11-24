import { cleanup, render } from "@testing-library/react";
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
import { useChatStore } from "../../webview-ui/src/stores/chat.store";

beforeEach(() => {
  useChatStore.setState({
    messages: [{ id: "assistant-1", role: "assistant", content: "answer", steps: [], timestamp: 0 }],
    isStreaming: false,
  });
});

afterEach(cleanup);

describe("scroll to bottom button", () => {
  it("uses the brand pink background", () => {
    render(<ChatArea />);

    const button = document.querySelector(".tabler-icon-arrow-down")?.closest("button");
    expect(button?.className).toContain("bg-[#FF1A8C]");
    expect(button?.className).not.toContain("bg-blue-400");
  });
});
