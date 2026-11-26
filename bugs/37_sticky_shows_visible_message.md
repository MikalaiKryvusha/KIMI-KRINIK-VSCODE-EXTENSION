# Bug 37 — Sticky shows the message that is still visible on screen

**Status:** 🔧 fixed; full suite 651/1, lint and typecheck green; real isolated and main-profile visual acceptance pending
**Version/build:** owner's accumulated main profile, KIMI KRINIK 1.0.0 build 39 · **When/context:** 2026-11-26 10:07 +03:00, tossed by the owner mid-task during the UI-polish review
**Severity:** S2
**Fixing:** this session, after the sound-section dimming task
**Fix accepted when (observable):** a user message that is still (even partially) visible in the chat viewport never appears in the sticky; the sticky shows the latest message that has fully scrolled out of view.

## Symptom

The sticky captured the owner's latest message («когда звук выключен…») while that same message was still displayed in the chat viewport — the owner had not scrolled past it. Expected: the sticky shows the previous message from the chat, the one that actually left the viewport. Owner's words: «в стики попало сообщение, которое сейчас у меня на экране - это неверно, так как я до него ещё не мог долистать. В стики должно было быть предыдущее сообщенгие из чата.»

## Repro

1. Send a message long enough that the chat can scroll.
2. Keep the message (or its tail) visible in the viewport without scrolling past it.
3. Observe the sticky bar duplicating that visible message instead of showing the previous one.

## Forensics

- Owner screenshot 2026-11-26: the sticky line «когда звук выключен, нужно очень сильно затемнять…» renders above the chat while the identical message bubble is visible below.
- The sticky contract and the viewport observer live in the sticky prompt work: `plans/03_sticky_viewport_prompt.md`, `bugs/30_sticky_prompt_visible_at_chat_start.md`, `bugs/31_expanded_sticky_scroll_oscillation.md`.

## Root cause

`useActivePromptId` had three paths that could select a VISIBLE prompt: the `atBottom` shortcut unconditionally returned `getLatestPromptKey`, the empty-assistant-tops fallback did the same, and `selectActivePromptId` defaulted to `visible[0]` when no assistant crossed the boundary. The mid-scroll assistant-top selection could never select a visible prompt (a prompt's bottom is always above its response's top), but the shortcuts bypassed the viewport-visibility rule entirely.

## Fix

One selection rule everywhere (the plan's own invariant): the sticky shows the latest user prompt whose bubble bottom has fully crossed the 80 px top boundary, measured directly on user-message elements. `UserMessage` now carries `data-message-id`/`data-message-role="user"` so the hook can measure it. The at-bottom shortcut, the latest-prompt fallbacks and the first-candidate default are removed; the 24 px hysteresis is preserved around the boundary in both scroll directions. When nothing has scrolled out, no sticky renders. `plans/03` AC3 updated to the owner's rule. Regression tests: the rewritten `selectActivePromptId` suite pins last-scrolled-out selection, both hysteresis directions and the nothing-scrolled-out case.

## Decisions made without the owner

[AI] The out-line reuses the existing 80 px boundary constant (≈ the sticky bar's covered band) rather than introducing a new constant; the `!scroll` bootstrap branch keeps its latest-prompt fallback because it runs before any measurement exists.

## Links

- `bugs/30_sticky_prompt_visible_at_chat_start.md` · `bugs/31_expanded_sticky_scroll_oscillation.md` · `plans/03_sticky_viewport_prompt.md`
