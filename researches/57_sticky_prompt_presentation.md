# Research 57 — Sticky prompt presentation and message timestamps

> **Created:** 2026-11-25 · **Parent:** `plans/03_sticky_viewport_prompt.md`; owner's presentation requests · **Status:** complete; implementation follows these sources · **Outbound:** no new dependency or public RPC

## Goal vector

**Achieve.** Keep the visible turn's user prompt recognizable as a user bubble, animate expansion without moving the reading anchor, and show when user messages were sent.

**Avoid.** A tall sticky overlay, text-button inconsistency with the rest of the extension, animation that ignores reduced motion, or a second date/media implementation.

## Sources

- [Claude Code #60161 — dynamic sticky section headers](https://github.com/anthropics/claude-code/issues/60161): the pinned prompt follows the response in the viewport and changes at section boundaries. The report also documents `position: sticky` on each user message. KIMI KRINIK's current visible-assistant selector implements the same behavior without choosing the newest message globally.
- [Claude Code #36146 — a long static sticky header hides the conversation](https://github.com/anthropics/claude-code/issues/36146): the pinned panel can occupy 50–80% of the viewport. Collapsed sticky stays one line; expanded content participates in normal flow and never auto-expands.
- [WAI-ARIA accordion example](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/): a semantic button owns `aria-expanded` and `aria-controls`; Enter/Space toggles it. The chevron is decorative and the accessible action remains available to assistive technology.
- [Claude Code #28531 — per-message timestamps](https://github.com/anthropics/claude-code/issues/28531): a gray inline timestamp helps users reconstruct long sessions. KIMI KRINIK uses localized `HH:MM` from the existing numeric message timestamp, without a new setting or library.

## Local prior art

`ThinkingBlock.tsx` already rotates `IconChevronDown` with `transition-transform`. `SessionList.tsx` already formats existing timestamps without a date library. `MessageMedia` and `MediaPreviewModal` remain the only media path.

## Decisions

- Keep the full-width rounded user bubble and one-line collapsed summary. Show expansion only for truncated, multiline or media prompts.
- Use the existing chevron with a 180° transition and a short fade/slide expansion. Add `motion-reduce` variants so reduced-motion users get immediate state changes.
- Render localized `HH:MM` in the ordinary user bubble using `Intl.DateTimeFormat` and the extension's EN/RU/ZH language.
- Preserve the scroll-anchor adjustment already verified on the packaged build; do not rewrite the active-prompt selector during this presentation pass.

## Verification

Component checks cover chevron rotation, reduced-motion classes, expansion visibility, timestamp text and existing media behavior. The packaged VSIX check reads the final rounded bubble, chevron and timestamp in WebP and DOM.
