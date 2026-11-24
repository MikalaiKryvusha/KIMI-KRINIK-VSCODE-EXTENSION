# Bug 01 — User-message line breaks collapse in the chat bubble

**Status:** ✅ DONE
**Version/build:** 1.0.0 · `kaif/no-auto-compaction` · **When/context:** 2026-11-23, owner screenshot during K1 implementation
**Severity:** S2
**Fixing:** this session
**Fix accepted when (observable):** a user message containing `first line\nsecond line` renders the second line on a new visual line, and the exact original string, including every internal `\n`, is passed to both the idle prompt and running-turn steer bridge calls.

## Symptom

The composer accepts Shift+Enter, but the user-message bubble rendered a single manual line break as a space. The owner demonstrated a break before `Поле` that disappeared in the rendered bubble. User-authored paragraph structure must remain visible and reach the model unchanged.

## Repro (deterministic)

1. Enter `first line`, press Shift+Enter, then enter `second line`.
2. Send the message.
3. Inspect the user bubble and outgoing payload.

Component repro: render `ChatMessage` with `content: "first line\nsecond line\n\nthird paragraph"`; the first paragraph preserves whitespace and retains the internal newline.

## Forensics

- `ChatMessage.tsx` sends user text through `Markdown`.
- `Markdown.tsx` originally rendered paragraphs without preserved whitespace, so normal HTML whitespace collapsed Markdown soft breaks.
- `content.ts` and `chat.store.ts` retain the original string for idle and steer calls.

## Root cause

Confirmed rendering cause: CommonMark soft breaks plus normal HTML whitespace collapse. The outgoing-payload path required no code change.

## Fix

1. `ChatMessage.tsx` applies preserved whitespace to user Markdown paragraphs only; assistant Markdown and outer bubble spacing are unchanged.
2. `chat-message.test.tsx` guards the rendered soft break and ordinary paragraph margins.
3. `chat-store.test.ts` guards exact multiline idle and steer payloads.
4. Red-to-green: the component assertion failed before the fix and passed afterward.

TWINS: searched all `<Markdown content=` call sites — no other user-message renderer; assistant/tool renderers intentionally keep standard Markdown whitespace.
TWINS-MECH: ordinary HTML whitespace collapsing user-authored soft breaks was checked across Markdown renderers, user-text extraction and newline replacement. The queued-message panel remains an intentionally line-clamped preview.

## Decisions made without the owner

Chose paragraph-scoped CSS through the existing Markdown `className` hook instead of a Markdown plugin/dependency or a global assistant-rendering change.

## Links

- `plans/149` in `D:/work/ai_sandbox/KAIF` — K1 UI convergence.

## ✅ STATUS: DONE (2026-11-24 07:14 +03:00)

Hygiene: component and exact idle/steer payload regression checks green; full extension suite green before this documentation-only closure.
Functional run: real installed VSIX in Second Side Bar with an isolated fake provider. The composer sent `first line\nsecond line`; the bubble displayed two visual lines with computed `white-space: pre-wrap`, and the provider request recorded the exact original newline. Read-back WebP: `.tmp/k5-vscode/10-multiline-message.webp`.
Run report: `testcases/reports/2026-11-24_k5_live_acceptance.md`.
