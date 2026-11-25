# Bug 30 — Sticky prompt duplicates the start of the chat at the top

**Status:** 🔧 component fix verified; packaged VSIX and accumulated-profile acceptance pending
**Version/build:** KIMI KRINIK 1.0.0 build 22 · owner's accumulated VS Code profile · **When/context:** 2026-11-25 18:12 +03:00, owner visual review
**Severity:** S2
**Fixing:** this session, before the remaining 1.0.0 UI work
**Fix accepted when (observable):** at `scrollTop = 0` no sticky prompt is rendered; after the user scrolls into an assistant turn, the owning prompt can become sticky; no sticky flash occurs on initial render.

## Symptom

[OWNER] «я в самом верху чата, выше сообщений, чем стартовое, нет. При этом показывается неверно стики сообщение - оно там вообще не нужно, так как выше, чем уже отображаемое стартовое - сообщений нет. Баг.» · 2026-11-25 (чат, со скриншотом)

The sticky copy of the latest prompt appears above the conversation even though the viewport is already at the beginning and no earlier message is hidden above it.

## Repro

The owner asked for a code-path diagnosis rather than a live reproduction. The deterministic component check will set the real scroll container to its top and read whether the sticky element exists, then scroll down and read it again.

## Forensics

- `useActivePromptId` initializes from `getLatestPromptKey(messages)`, so a sticky candidate exists before scroll geometry is read.
- Its `atBottom` branch also selects the latest prompt without checking whether the viewport is simultaneously at the top.
- `ChatArea` renders `StickyUserPrompt` whenever that candidate resolves to a message.

## Root cause / Hypotheses

The active-prompt selection models which prompt owns the visible assistant response but has no top-of-chat visibility boundary. Initial and bottom shortcuts can therefore select a prompt whose sticky copy is unnecessary.

## Fix plan

1. Add a component regression for top → scrolled-down transitions and initial render.
2. Start without a sticky candidate and explicitly clear it at the top boundary before the bottom boundary is evaluated.
3. Keep the existing assistant-owned selection and hysteresis unchanged away from the top.
4. Run the affected suite, full extension suite, typecheck and lint; inspect the packaged VSIX presentation.

## Fix evidence — 2026-11-25 18:25 +03:00

The initial candidate is now empty and the real scroll container explicitly clears it at `scrollTop <= 0` before evaluating the bottom boundary. Scrolling down reuses the unchanged assistant-owned selection.

Hygiene: the new top-boundary regression was red before the change and green afterward; `chat-area` is 9/9 and the full extension suite is 613 passed / 1 skipped / 0 failed. Typecheck and root lint exit 0.
Functional run: NONE. Packaged VSIX and accumulated-profile visual acceptance remain pending.

TWINS: searched `getLatestPromptKey(messages)`, `expandedPromptId` and scroll-boundary shortcuts across `apps/vscode`; the active-prompt hook is the only selection path, with its latest-prompt fallback retained for non-scroll test hosts and genuine scrolled states.
TWINS-MECH: an unnecessary duplicate can come from initial state, a boundary shortcut, or stale ownership state. Those forms were searched in the same hook and `ChatArea`; no second sticky renderer exists.

REAL WORLD: accumulated — the owner's build-22 screenshot and existing sessions; data and machine — his Windows VS Code; path — conversation top in Second Side Bar. The code path is fixed and component-verified, but the real world is not yet observed on a new VSIX.

## Decisions made without the owner

Used the exact top boundary requested by the owner; did not redesign the existing assistant-owned selection or hysteresis.

## Links

- `plans/03_sticky_viewport_prompt.md`
- `apps/vscode/webview-ui/src/components/StickyUserPrompt.tsx`
- `apps/vscode/webview-ui/src/components/ChatArea.tsx`
- `bugs/31_expanded_sticky_scroll_oscillation.md`
