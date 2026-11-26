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
const COLLAPSED_STICKY_PREVIEW_HEIGHT = 32;
const STICKY_EXIT_MS = 200;
const STICKY_OUTER_VERTICAL_PX = 17;

export function getPromptKey(message: ChatMessage, index: number): string {
  if (message.clientId !== undefined) return message.clientId;
  if (message.turnIndex !== undefined) return `turn:${message.turnIndex}`;
  return `content:${index}:${Content.getText(message.content)}`;
}

export function getLatestPromptKey(messages: readonly ChatMessage[]): string | undefined {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role === "user") return getPromptKey(message, index);
  }
  return undefined;
}

export interface PromptBottom {
  key: string;
  bottom: number;
}

export function selectActivePromptId(prompts: readonly PromptBottom[], currentPromptId?: string): string | undefined {
  let candidateIndex = -1;
  for (let index = 0; index < prompts.length; index += 1) {
    if (prompts[index]!.bottom <= PROMPT_BOUNDARY_PX) candidateIndex = index;
    else break;
  }
  const candidate = candidateIndex < 0 ? undefined : prompts[candidateIndex]!.key;
  if (currentPromptId === undefined || candidate === currentPromptId) return candidate;
  const nextIndex = candidateIndex + 1;
  let nearestIndex = candidateIndex;
  if (nearestIndex < 0) nearestIndex = nextIndex < prompts.length ? nextIndex : -1;
  else if (nextIndex < prompts.length && Math.abs(prompts[nextIndex]!.bottom - PROMPT_BOUNDARY_PX) < Math.abs(prompts[candidateIndex]!.bottom - PROMPT_BOUNDARY_PX)) nearestIndex = nextIndex;
  if (nearestIndex < 0) return candidate;
  const nearestPreviousKey = nearestIndex <= 0 ? undefined : prompts[nearestIndex - 1]!.key;
  if (
    Math.abs(prompts[nearestIndex]!.bottom - PROMPT_BOUNDARY_PX) < PROMPT_HYSTERESIS_PX
    && (currentPromptId === prompts[nearestIndex]!.key || (nearestPreviousKey !== undefined && currentPromptId === nearestPreviousKey))
  ) {
    return currentPromptId;
  }
  return candidate;
}

export function useActivePromptId(messages: readonly ChatMessage[], hostRef: RefObject<HTMLDivElement | null>): string | undefined {
  const [activePromptId, setActivePromptId] = useState<string>();

  useEffect(() => {
    const scroll = hostRef.current?.querySelector<HTMLElement>(".chat-scroll-view");
    if (!scroll) {
      setActivePromptId((current) => current ?? getLatestPromptKey(messages));
      return;
    }

    const update = () => {
      if (scroll.scrollTop <= 0) {
        setActivePromptId(undefined);
        return;
      }
      const viewportTop = scroll.getBoundingClientRect().top;
      const userElements = scroll.querySelectorAll<HTMLElement>("[data-message-role=user]");
      const prompts: PromptBottom[] = [];
      let elementIndex = 0;
      for (let index = 0; index < messages.length && elementIndex < userElements.length; index += 1) {
        const message = messages[index];
        if (message?.role !== "user") continue;
        const element = userElements[elementIndex]!;
        elementIndex += 1;
        prompts.push({ key: getPromptKey(message, index), bottom: element.getBoundingClientRect().bottom - viewportTop });
      }
      setActivePromptId((current) => selectActivePromptId(prompts, current));
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
  const fullRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [fullHeight, setFullHeight] = useState(COLLAPSED_STICKY_PREVIEW_HEIGHT);
  const [renderedMessage, setRenderedMessage] = useState(message);
  const [barHeight, setBarHeight] = useState(0);
  const shownMessage = message ?? renderedMessage;
  const text = shownMessage ? Content.getText(shownMessage.content) : "";
  const images = shownMessage ? Content.getImages(shownMessage.content) : [];
  const videos = shownMessage ? Content.getVideos(shownMessage.content) : [];

  useEffect(() => {
    if (message !== undefined) setRenderedMessage(message);
  }, [message]);

  useEffect(() => {
    if (message !== undefined || renderedMessage === undefined) return;
    const reducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setRenderedMessage(undefined), reducedMotion ? 0 : STICKY_EXIT_MS);
    return () => clearTimeout(timer);
  }, [message, renderedMessage]);

  useEffect(() => {
    const bubble = bubbleRef.current;
    if (!bubble) {
      setBarHeight(0);
      return;
    }
    const update = () => setBarHeight(bubble.offsetHeight + STICKY_OUTER_VERTICAL_PX);
    update();
    const resizeObserver = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(update);
    resizeObserver?.observe(bubble);
    return () => resizeObserver?.disconnect();
  }, [shownMessage, expanded]);

  useLayoutEffect(() => {
    const full = fullRef.current;
    if (!full) return;
    const update = () => setFullHeight(full.scrollHeight);
    update();
    const resizeObserver = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(update);
    resizeObserver?.observe(full);
    return () => resizeObserver?.disconnect();
  }, [text, images.length, videos.length, expanded]);

  if (!shownMessage) return null;

  const visible = message !== undefined;
  const canExpand = text.includes("\n") || images.length > 0 || videos.length > 0;
  const action = expanded ? t("sticky.collapse") : t("sticky.expand");

  return (
    <div
      data-testid="sticky-user-prompt"
      className="sticky top-0 z-20 border-b bg-background px-2 pt-2 pb-2 text-foreground shadow-sm overflow-hidden transition-[max-height,opacity] duration-200 motion-reduce:transition-none"
      style={{ maxHeight: visible ? barHeight : 0, opacity: visible ? 1 : 0 }}
    >
      <div ref={bubbleRef} data-testid="sticky-prompt-bubble" className="relative w-full rounded-2xl rounded-br-md bg-zinc-100 px-3.5 py-1.5 transition-colors duration-200 motion-reduce:transition-none dark:bg-zinc-800">
        <button
          type="button"
          onClick={onToggle}
          disabled={!expanded && !canExpand}
          aria-label={expanded || canExpand ? action : undefined}
          aria-expanded={expanded || canExpand ? expanded : undefined}
          aria-controls={expanded || canExpand ? "sticky-prompt-full" : undefined}
          className={expanded || canExpand
            ? "absolute right-2 top-1.5 z-10 flex size-5 items-center justify-center rounded-md text-muted-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700"
            : "flex w-full min-w-0 items-center gap-3 text-left"}
        >
          {!expanded && <span className={canExpand ? "sr-only" : "min-w-0 flex-1 truncate text-xs leading-none"}>{text || t("queue.mediaOnly")}</span>}
          {(expanded || canExpand) && <IconChevronDown className={`size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`} />}
        </button>
        {(canExpand || expanded) && (
          <div
            data-testid="sticky-prompt-expansion"
            className="relative overflow-hidden transition-[max-height] duration-300 ease-in-out motion-reduce:transition-none"
            style={{ maxHeight: expanded ? fullHeight : COLLAPSED_STICKY_PREVIEW_HEIGHT }}
          >
            <div
              id="sticky-prompt-full"
              data-testid="sticky-prompt-full"
              aria-hidden={!expanded}
              inert={!expanded}
              className="min-w-0 pr-6 text-xs leading-relaxed opacity-100"
            >
              <div ref={fullRef}>
                {text && <div className="whitespace-pre-wrap wrap-break-word">{text}</div>}
                <MessageMedia images={images} videos={videos} onPreview={setPreviewMedia} />
              </div>
            </div>
            {!expanded && (
              <span data-testid="sticky-prompt-fade" className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-zinc-100 via-zinc-100/60 to-transparent dark:from-zinc-800 dark:via-zinc-800/60" />
            )}
          </div>
        )}
      </div>
      <MediaPreviewModal src={previewMedia} onClose={() => setPreviewMedia(null)} />
    </div>
  );
}
