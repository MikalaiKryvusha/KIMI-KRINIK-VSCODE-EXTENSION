# Bug 32 — Steering moves the robot and Working indicator to an empty assistant

**Status:** 🔧 component/store fix verified; packaged VSIX and accumulated-profile acceptance pending
**Version/build:** KIMI KRINIK 1.0.0 build 22 · owner's accumulated VS Code profile · **When/context:** 2026-11-25 18:15 +03:00, owner steering review
**Severity:** S2
**Fixing:** this session, after the sticky boundaries
**Fix accepted when (observable):** immediately after a steering send, the existing assistant keeps its robot and «Работаю…» without a second empty robot/indicator; when real post-steer content arrives, its assistant section appears after the steering bubble and owns the indicator.

## Symptom

[OWNER] «когда я делаю досыл стиринг сообщения, вот это дёргается» · 2026-11-25 (чат, со скриншотом двух роботов и «Рассуждение» / «Работаю…»)
[OWNER] «не нужно дергаться» · 2026-11-25 (чат)

## Repro

The owner explicitly requested code reading instead of live reproduction. Component checks will render the existing assistant, the optimistic steering user entry and the deferred assistant, then add real post-steer content and read robot/indicator ownership.

## Forensics

- `appendOptimisticTurn` appends both an optimistic user and an empty assistant for every send, including `steerNow`.
- `ChatArea` passes `isStreaming` only to the last array entry when it is an assistant, so the previous content-bearing assistant loses its indicator immediately.
- The empty assistant renders its `KimiLogo` and `WorkingIndicator` even before any `StepBegin` or `ContentPart` arrives.
- `SteerInput` reconciles the optimistic records but does not provide real assistant content by itself.

## Root cause / Hypotheses

The optimistic steering lifecycle creates a second visible working region before the engine produces a post-steer response. The global streaming flag moves to that empty region, producing the observed jump without any delivery error.

## Fix plan

1. Add a component regression for one stable robot/indicator before content and normal presentation after content.
2. Mark only steering-created assistants as deferred; hide them while empty and keep streaming on the latest presented assistant.
3. Preserve the optimistic user bubble, existing assistant event route, retry/fallback and durable TurnBegin behavior.
4. Run red-first component/store checks, full extension hygiene and packaged VSIX acceptance.

## Fix evidence — 2026-11-25 18:39 +03:00

Steering-created assistants now carry `deferPresentation`. They retain their optimistic identity and receive the same engine events, but render only after real content exists. `ChatArea` keeps streaming on the latest presented assistant, while durable TurnBegin and idle fallback reveal the deferred record.

Hygiene: robot/indicator ownership and store reveal regressions were red before the change and green afterward; target suites are 42/42 and the full extension suite is 615 passed / 1 skipped / 0 failed. Typecheck and root lint exit 0.
Functional run: NONE. Packaged VSIX and accumulated-profile steering acceptance remain pending.

TWINS: searched `appendOptimisticTurn`, `deferPresentation` and the `isStreaming` projection across `apps/vscode`; idle, retry, queue and queue-batch sends keep immediate presentation, while only `steerNow` defers it. No second last-assistant streaming selector remains.
TWINS-MECH: the jump can come from optimistic record creation, assistant visibility, streaming ownership or durable reconciliation. All four forms were searched; the fix covers the steering variants without changing the event-delivery path.

REAL WORLD: accumulated — the owner's build-22 active turn and steering screenshot; data and machine — his Windows VS Code; path — immediate Steer in Second Side Bar. The presentation state machine is verified locally, but the real steering view is not yet observed on a new VSIX.

## Decisions made without the owner

Kept the empty steering assistant in the timeline for event compatibility and changed only its presentation boundary. Did not redesign steering delivery, optimistic user identity or queue behavior.

## Links

- `bugs/16_steer_avatar_precedes_user_bubble.md`
- `bugs/19_tool_cards_hide_working_state.md`
- `apps/vscode/webview-ui/src/stores/chat.store.ts`
- `apps/vscode/webview-ui/src/stores/event-handlers.ts`
- `apps/vscode/webview-ui/src/components/ChatArea.tsx`
- `apps/vscode/webview-ui/src/components/ChatMessage.tsx`
