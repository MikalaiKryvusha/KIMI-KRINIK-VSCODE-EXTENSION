# Bug 31 — Expanded sticky prompt oscillates during scrolling

**Status:** 🔧 component fix verified; packaged VSIX and accumulated-profile acceptance pending
**Version/build:** KIMI KRINIK 1.0.0 build 22 · owner's accumulated VS Code profile · **When/context:** 2026-11-25 18:12 +03:00, owner visual review
**Severity:** S2
**Fixing:** this session, together with the sticky top boundary
**Fix accepted when (observable):** an expanded sticky prompt collapses on user wheel/touch scrolling and whenever another prompt becomes sticky; expansion no longer feeds repeated geometry changes back into active-prompt selection.

## Symptom

[OWNER] «если попасть в тонкий момент чата, где сообщение большое и оно же в стики в верхнем, который развернёт - полотно чата начинает плясать, дергается, то вверх, то вниз. Баг.» · 2026-11-25 (чат)
[OWNER] «все стики сообщения, которые развернуты - нужно автоматически сворачивать при листании пользователем чата и закреплении другого любого сообщения как стики.» · 2026-11-25 (чат)

## Repro

The owner asked for a code-path diagnosis rather than a live reproduction. Component checks will expand the real sticky component, emit user scrolling, change the active prompt and read the expanded element's presence and scroll-anchor behavior.

## Forensics

- `ChatArea.toggleExpandedPrompt` compensates for the assistant's before/after position by mutating `scroll.scrollTop` in `requestAnimationFrame`.
- `useActivePromptId` listens to both `scroll` and `ResizeObserver`; expansion changes the same sticky geometry used by subsequent selection updates.
- `expandedPromptId` is cleared only on `sessionId` changes, not on user scrolling or `activePromptId` changes.

## Root cause / Hypotheses

Expanded height, scroll compensation and geometry-driven selection form a feedback loop. The missing collapse boundaries allow that loop to persist while the user scrolls or ownership moves to another prompt.

## Fix plan

1. Add regressions for wheel/touch collapse and active-prompt replacement.
2. Clear expanded state on those user actions and whenever the active prompt no longer owns the expansion.
3. Preserve explicit expand/collapse and its reading-position compensation; do not collapse on streaming or other programmatic scrolling alone.
4. Verify the sticky suites, full extension hygiene and packaged VSIX behavior.

## Fix evidence — 2026-11-25 18:25 +03:00

Wheel/touch capture now clears expanded state, and an `activePromptId` change clears the previous expansion so returning to that prompt cannot resurrect it. Explicit expansion and its scroll-anchor compensation remain intact.

Hygiene: wheel/touch and ownership-return regressions were red before the change and green afterward; `chat-area` is 9/9 and the full extension suite is 613 passed / 1 skipped / 0 failed. Typecheck and root lint exit 0.
Functional run: NONE. Packaged VSIX and accumulated-profile visual acceptance remain pending.

TWINS: searched `expandedPromptId`, `onWheelCapture` and `scrollTop <= 0` across `apps/vscode`; only `ChatArea` owns sticky expansion and only the shared active-prompt hook owns geometry-driven selection.
TWINS-MECH: viewport oscillation can be fed by expansion state, ownership state, resize observation or programmatic scroll compensation. The first three state paths were checked; the existing compensation was deliberately preserved and the new tests guard against stale expansion reappearing.

REAL WORLD: accumulated — the owner's build-22 large prompt and scrolling path; data and machine — his Windows VS Code; path — expanded sticky in Second Side Bar. The state fix is component-verified, but dancing on the real accumulated profile is not yet re-observed on a new VSIX.

## Decisions made without the owner

Limited automatic collapse to wheel/touch input and active-prompt replacement; streaming and other programmatic scrolling alone do not collapse the expansion.

## Links

- `plans/03_sticky_viewport_prompt.md`
- `apps/vscode/webview-ui/src/components/ChatArea.tsx`
- `apps/vscode/webview-ui/src/components/StickyUserPrompt.tsx`
- `bugs/30_sticky_prompt_visible_at_chat_start.md`
