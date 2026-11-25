# Bug 31 — Expanded sticky prompt oscillates during scrolling

**Status:** 🔧 owner revised the collapse contract on 2026-11-25 23:18 +03:00; new preservation/animation refinement in progress
**Version/build:** KIMI KRINIK 1.0.0 build 22 · owner's accumulated VS Code profile · **When/context:** 2026-11-25 18:12–23:18 +03:00, owner visual review
**Severity:** S2
**Fixing:** this session, with the revised sticky behavior and animation
**Fix accepted when (observable):** an expanded sticky prompt remains expanded during wheel/touch scrolling and collapses only manually or when another prompt becomes sticky; expansion no longer feeds repeated geometry changes back into active-prompt selection; height and text fade animate in both directions.

## Symptom

[OWNER] «если попасть в тонкий момент чата, где сообщение большое и оно же в стики в верхнем, который развернёт - полотно чата начинает плясать, дергается, то вверх, то вниз. Баг.» · 2026-11-25 (чат)
[OWNER] «все стики сообщения, которые развернуты - нужно автоматически сворачивать при листании пользователем чата и закреплении другого любого сообщения как стики.» · 2026-11-25 (чат)

## Owner correction — 2026-11-25 23:18 +03:00

[OWNER] «Оно не должно сворачиваться, когда я скролю чат, а должно остоваться раскрытым до момента, пока оно - или вручную пользователем не свернуто - или чат не пролиста до ДРУГОГО собщения, и ОНО стало стики.» · 2026-11-25 23:04 +03:00 (chat)

This supersedes the earlier automatic wheel/touch-collapse requirement and its build-25 expected evidence below. The old evidence remains historical, not the current acceptance criterion. The owner also requires downward height growth with text fade-in, upward collapse with fade-out, and small top/side padding around the sticky bubble.

Component evidence for the revised contract: the updated sticky suite is 11/11, covering wheel/touch preservation, manual collapse, active-prompt replacement, two-way grid/fade classes and top/side padding. Packaged visual observation remains pending.

2026-11-26 00:36 +03:00 — packaged build 33 real isolated sticky run: collapsed preview `32px` with bubble-colored fade, expanded height `827px`, wheel preserved `aria-expanded=true`, and manual collapse returned to `32px`. This satisfies the revised isolated contract; accumulated main-profile observation remains open.

## Repro

[OWNER] «лучше не восроизводить, а читать код и искать в коде, чем они вызваны и как чинить.» · 2026-11-25 (чат)

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

## Isolated build-25 evidence — 2026-11-25 20:11 +03:00

Hygiene: full extension 621 passed / 1 skipped; typecheck and root lint green; VSIX static audit and Extension Host smoke pass.
Functional run: on packaged build 25, a 40-line sticky prompt expanded at the bottom of a real conversation, then a real wheel event collapsed it (`expandedBefore: true`, `expandedAfter: false`). At `scrollTop = 0` no sticky was present. The installed webview hash matched the source.

REAL WORLD: accumulated — the owner's build-22 large-prompt oscillation remains the original observation; data and machine — isolated Windows VS Code 1.123.0 with packaged build 25; path — expanded sticky and wheel in Second Side Bar. The collapse boundary is verified on the isolated real product. The owner's accumulated main profile has build 25 installed but its running Extension Host has not been restarted, so this bug is not DONE.

## Decisions made without the owner

Limited automatic collapse to wheel/touch input and active-prompt replacement; streaming and other programmatic scrolling alone do not collapse the expansion.

## Links

- `plans/03_sticky_viewport_prompt.md`
- `apps/vscode/webview-ui/src/components/ChatArea.tsx`
- `apps/vscode/webview-ui/src/components/StickyUserPrompt.tsx`
- `bugs/30_sticky_prompt_visible_at_chat_start.md`
