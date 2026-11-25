import { useEffect, useRef, useState } from "react";
import ScrollToBottom, { useScrollToBottom, useSticky } from "react-scroll-to-bottom";
import { IconArrowDown } from "@tabler/icons-react";
import { ChatMessage } from "./ChatMessage";
import { getPromptKey, StickyUserPrompt, useActivePromptId } from "./StickyUserPrompt";
import { WelcomeScreen } from "./WelcomeScreen";
import { useChatStore } from "@/stores";
import { cn } from "@/lib/utils";
import { getForkTurnIndex } from "shared/fork-turn-index";

function ScrollButton() {
  const scrollToBottom = useScrollToBottom();
  const [sticky] = useSticky();

  if (sticky) return null;

  return (
    <button
      onClick={() => scrollToBottom()}
      className={cn("absolute bottom-4 right-4 p-2 rounded-full z-10", "bg-[#FF1A8C] text-white shadow-lg", "hover:bg-[#FF1A8C]/85 transition-all")}
    >
      <IconArrowDown className="size-4" />
    </button>
  );
}

function MessageList() {
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);

  return (
    <>
      <div className="">
        {messages.map((message, idx) => (
          <ChatMessage
            key={message.id}
            message={message}
            turnIndex={getForkTurnIndex(messages, idx)}
            isStreaming={isStreaming && idx === messages.length - 1 && message.role === "assistant"}
          />
        ))}
      </div>
      <ScrollButton />
    </>
  );
}

export function ChatArea() {
  const messages = useChatStore((s) => s.messages);
  const hostRef = useRef<HTMLDivElement>(null);
  const activePromptId = useActivePromptId(messages, hostRef);
  const sessionId = useChatStore((s) => s.sessionId);
  const [expandedPromptId, setExpandedPromptId] = useState<string>();
  useEffect(() => { setExpandedPromptId(undefined); }, [sessionId]);
  const activePromptIndex = messages.findIndex((message, index) => message.role === "user" && getPromptKey(message, index) === activePromptId);
  const activePrompt = activePromptIndex < 0 ? undefined : messages[activePromptIndex];

  const toggleExpandedPrompt = () => {
    const scroll = hostRef.current?.querySelector<HTMLElement>(".chat-scroll-view");
    const assistant = activePromptIndex < 0 ? undefined : messages.slice(activePromptIndex + 1).find((message) => message.role === "assistant");
    const findAssistant = () => assistant === undefined || !scroll ? undefined : Array.from(scroll.querySelectorAll("[data-message-role=assistant]")).find((element) => element.getAttribute("data-message-id") === assistant.id);
    const beforeTop = findAssistant()?.getBoundingClientRect().top;
    setExpandedPromptId((current) => current === activePromptId ? undefined : activePromptId);
    requestAnimationFrame(() => {
      if (!scroll || beforeTop === undefined) return;
      const afterTop = findAssistant()?.getBoundingClientRect().top;
      if (afterTop !== undefined) scroll.scrollTop += afterTop - beforeTop;
    });
  };

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center relative">
        <WelcomeScreen />
      </div>
    );
  }

  return (
    <div ref={hostRef} className="h-full relative">
      <ScrollToBottom className="h-full" scrollViewClassName="chat-scroll-view h-full overflow-y-auto overflow-x-hidden" followButtonClassName="hidden" initialScrollBehavior="auto">
        <StickyUserPrompt message={activePrompt} expanded={expandedPromptId === activePromptId} onToggle={toggleExpandedPrompt} />
        <MessageList />
      </ScrollToBottom>
    </div>
  );
}
