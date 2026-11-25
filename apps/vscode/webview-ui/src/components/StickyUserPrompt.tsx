import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { Content } from "@/lib/content";
import { useT } from "@/i18n";
import type { ChatMessage } from "@/stores/chat.store";
import { MessageMedia } from "./ChatMessage";
import { MediaPreviewModal } from "./MediaPreviewModal";

const PROMPT_BOUNDARY_PX = 80;
const PROMPT_HYSTERESIS_PX = 24;
const BOTTOM_THRESHOLD_PX = 32;

export function getPromptKey(message: ChatMessage, index: number): string {
  if (message.clientId !== undefined) return message.clientId;
  if (message.turnIndex !== undefined) return `turn:${message.turnIndex}`;
  return `content:${index}:${Content.getText(message.content)}`;
}

function promptForAssistant(messages: readonly ChatMessage[], assistantIndex: number): { key: string; index: number } | undefined {
  for (let index = assistantIndex - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role === "user") return { key: getPromptKey(message, index), index };
  }
  return undefined;
}

export function getLatestPromptKey(messages: readonly ChatMessage[]): string | undefined {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role === "user") return getPromptKey(message, index);
  }
  return undefined;
}

export function selectActivePromptId(
  messages: readonly ChatMessage[],
  assistantTops: ReadonlyMap<string, number>,
  currentPromptId?: string,
): string | undefined {
  const visible = messages.flatMap((message, index) => {
    if (message.role !== "assistant") return [];
    const top = assistantTops.get(message.id);
    const prompt = promptForAssistant(messages, index);
    return top === undefined || prompt === undefined ? [] : [{ ...prompt, top }];
  });
  if (visible.length === 0) return getLatestPromptKey(messages);

  let selected = visible[0]!;
  for (const candidate of visible) {
    if (candidate.top > PROMPT_BOUNDARY_PX) break;
    selected = candidate;
  }
  if (
    currentPromptId !== undefined
    && selected.key !== currentPromptId
    && Math.abs(selected.top - PROMPT_BOUNDARY_PX) < PROMPT_HYSTERESIS_PX
    && visible.some((candidate) => candidate.key === currentPromptId)
  ) {
    return currentPromptId;
  }
  return selected.key;
}

export function useActivePromptId(messages: readonly ChatMessage[], hostRef: RefObject<HTMLDivElement | null>): string | undefined {
  const [activePromptId, setActivePromptId] = useState(() => getLatestPromptKey(messages));

  useEffect(() => {
    const scroll = hostRef.current?.querySelector<HTMLElement>(".chat-scroll-view");
    if (!scroll) {
      setActivePromptId((current) => current ?? getLatestPromptKey(messages));
      return;
    }

    const update = () => {
      const atBottom = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight <= BOTTOM_THRESHOLD_PX;
      if (atBottom) {
        setActivePromptId(getLatestPromptKey(messages));
        return;
      }
      const scrollTop = scroll.getBoundingClientRect().top;
      const tops = new Map<string, number>();
      for (const element of scroll.querySelectorAll<HTMLElement>("[data-message-role=assistant]")) {
        const id = element.getAttribute("data-message-id");
        if (id) tops.set(id, element.getBoundingClientRect().top - scrollTop);
      }
      setActivePromptId((current) => selectActivePromptId(messages, tops, current));
    };

    update();
    scroll.addEventListener("scroll", update, { passive: true });
    const resizeObserver = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(update);
    resizeObserver?.observe(scroll);
    return () => {
      scroll.removeEventListener("scroll", update);
      resizeObserver?.disconnect();
    };
  }, [hostRef, messages]);

  return activePromptId;
}

interface StickyUserPromptProps {
  message?: ChatMessage;
  expanded: boolean;
  onToggle: () => void;
}

export function StickyUserPrompt({ message, expanded, onToggle }: StickyUserPromptProps) {
  const t = useT();
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);
  const summaryRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);
  const text = message ? Content.getText(message.content) : "";
  const images = message ? Content.getImages(message.content) : [];
  const videos = message ? Content.getVideos(message.content) : [];

  useLayoutEffect(() => {
    const summary = summaryRef.current;
    if (!summary) {
      setTruncated(false);
      return;
    }
    const update = () => setTruncated(summary.scrollWidth > summary.clientWidth);
    update();
    const resizeObserver = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(update);
    resizeObserver?.observe(summary);
    return () => resizeObserver?.disconnect();
  }, [text, expanded]);

  if (!message) return null;

  const canExpand = text.includes("\n") || images.length > 0 || videos.length > 0 || truncated;
  const action = expanded ? t("sticky.collapse") : t("sticky.expand");

  return (
    <div data-testid="sticky-user-prompt" className="sticky top-0 z-20 border-b bg-background text-foreground shadow-sm">
      <div data-testid="sticky-prompt-bubble" className="relative w-full rounded-2xl rounded-br-md bg-zinc-100 px-3.5 py-1.5 transition-colors duration-200 motion-reduce:transition-none dark:bg-zinc-800">
        <button
          type="button"
          onClick={onToggle}
          disabled={!expanded && !canExpand}
          aria-label={expanded || canExpand ? action : undefined}
          aria-expanded={expanded}
          aria-controls="sticky-prompt-full"
          className={expanded
            ? "absolute right-2 top-1.5 z-10 flex size-5 items-center justify-center rounded-md text-muted-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700"
            : "flex w-full min-w-0 items-center gap-3 text-left"}
        >
          {!expanded && <span ref={summaryRef} className="min-w-0 flex-1 truncate text-xs leading-none">{text || t("queue.mediaOnly")}</span>}
          {(expanded || canExpand) && <IconChevronDown className={`ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`} />}
        </button>
        {expanded && (
          <div id="sticky-prompt-full" data-testid="sticky-prompt-full" className="min-w-0 animate-in fade-in slide-in-from-top-1 pr-6 text-xs leading-relaxed duration-200 motion-reduce:animate-none">
            {text && <div className="whitespace-pre-wrap wrap-break-word">{text}</div>}
            <MessageMedia images={images} videos={videos} onPreview={setPreviewMedia} />
          </div>
        )}
      </div>
      <MediaPreviewModal src={previewMedia} onClose={() => setPreviewMedia(null)} />
    </div>
  );
}
