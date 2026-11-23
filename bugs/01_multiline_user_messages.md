# Bug 01 — User-message line breaks collapse in the chat bubble

**Status:** 🔴 OPEN
**Version/build:** 1.0.0 · `kaif/no-auto-compaction` working tree · **When/context:** 2026-11-23, owner screenshot during K1 implementation
**Severity:** S2
**Fixing:** this session
**Fix accepted when (observable):** a user message containing `first line\nsecond line` renders the second line on a new visual line, and the exact original string, including every internal `\n`, is passed to both the idle prompt and running-turn steer bridge calls.

## Symptom

The composer accepts Shift+Enter, but the user-message bubble renders a single manual line break as a space. The owner demonstrated a break before `Поле` that disappeared in the rendered bubble. User-authored paragraph structure must remain visible and must reach the model unchanged.

## Repro (deterministic)

1. Enter `first line`, press Shift+Enter, then enter `second line`.
2. Send the message.
3. Inspect the user bubble and the outgoing `streamChat` payload.

Component repro: render `ChatMessage` with `content: "first line\nsecond line\n\nthird paragraph"`; the first paragraph must carry preserved whitespace and retain the internal newline.

## Forensics

- `apps/vscode/webview-ui/src/components/ChatMessage.tsx` sends user text through `Markdown`.
- `apps/vscode/webview-ui/src/components/Markdown.tsx` renders paragraphs without preserved whitespace, so normal HTML whitespace handling collapses Markdown soft breaks.
- `apps/vscode/webview-ui/src/lib/content.ts` stores the original text in `Content.build`; `chat.store.ts` passes that content to `streamChat` and `steerChat` without newline replacement.
- Owner's screenshot in chat, 2026-11-23: the manual break before `Поле` is absent from the bubble.

## Root cause / Hypotheses

Confirmed rendering cause: CommonMark soft breaks plus normal HTML whitespace collapse. The store regression test observed exact multiline strings in both idle `streamChat` and running-turn `steerChat` calls, so the outgoing-payload path required no code change.

## Fix

1. `ChatMessage.tsx` now applies `whitespace-pre-wrap` to user Markdown paragraphs only; assistant Markdown and outer bubble spacing are unchanged.
2. `chat-message.test.tsx` proves that the soft break remains in the paragraph DOM while ordinary paragraph margins stay unchanged.
3. `chat-store.test.ts` proves exact multiline idle and steer payloads.
4. Red-to-green evidence: the component assertion failed before the fix with `expected 'mb-2 last:mb-0' to contain 'whitespace-pre-wrap'`; after the fix, both affected files passed 22 tests. Live Extension Host rendering remains separate evidence.

TWINS: searched all `<Markdown content=` call sites — no other user-message renderer; the other sites render assistant or tool output and intentionally keep standard Markdown whitespace.
TWINS-MECH: the mechanism is ordinary HTML whitespace collapsing user-authored soft breaks. Searched Markdown renderers, user-text extraction, and newline-replacement patterns; the queued-message panel remains an intentionally line-clamped preview, not the full chat bubble.

## Decisions made without the owner

Chose a paragraph-scoped CSS selector through the existing Markdown `className` hook instead of adding a Markdown plugin/dependency or changing global assistant rendering.

## Links

- `plans/149` in `D:/work/ai_sandbox/KAIF` — K1 UI convergence.
