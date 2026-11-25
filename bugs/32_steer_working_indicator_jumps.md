# Bug 32 — Steering moves the robot and Working indicator to an empty assistant

**Status:** 🔧 verified on isolated packaged build 25; accumulated main-profile running-build acceptance pending
**Version/build:** KIMI KRINIK 1.0.0 build 22 · owner's accumulated VS Code profile · **When/context:** 2026-11-25 18:15 +03:00, owner steering review
**Severity:** S2
**Fixing:** this session, after the sticky boundaries
**Fix accepted when (observable):** immediately after a steering send, the user entry sits above one trailing avatar/«Работаю…» without a second empty KIMI header; when real post-steer content arrives, its assistant section appears after the steering bubble and owns the indicator.

## Symptom

[OWNER] «когда я делаю досыл стиринг сообщения, вот это дёргается» · 2026-11-25 (чат, со скриншотом двух роботов и «Рассуждение» / «Работаю…»)
[OWNER] «не нужно дергаться» · 2026-11-25 (чат)
[OWNER] «а нужно просто добавлять пользовательское сообщение в чат над анимацией Работаю кими и его аватарокй» · 2026-11-25 (чат)

The required immediate order is existing assistant content → steering user message → one trailing avatar/Working indicator. The steering message must be above the animation, with no second empty KIMI header.

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

Steering-created assistants now carry `deferPresentation`. They retain their optimistic identity and receive the same engine events, but render only after real content exists. Before content, `ChatArea` renders one trailing Working indicator after the steering user entry; durable TurnBegin and idle fallback reveal the deferred record.

Hygiene: robot/indicator ownership and store reveal regressions were red before the change and green afterward; target suites are 42/42 and the full extension suite is 615 passed / 1 skipped / 0 failed. Typecheck and root lint exit 0.
Functional run: NONE. Packaged VSIX and accumulated-profile steering acceptance remain pending.

TWINS: searched `appendOptimisticTurn`, `deferPresentation` and the `isStreaming` projection across `apps/vscode`; idle, retry, queue and queue-batch sends keep immediate presentation, while only `steerNow` defers it. No second last-assistant streaming selector remains.
TWINS-MECH: the jump can come from optimistic record creation, assistant visibility, streaming ownership or durable reconciliation. All four forms were searched; the fix covers the steering variants without changing the event-delivery path.

REAL WORLD: accumulated — the owner's build-22 active turn and steering screenshot; data and machine — his Windows VS Code; path — immediate Steer in Second Side Bar. The presentation state machine is verified locally, but the real steering view is not yet observed on a new VSIX.

## Follow-up fix evidence — 2026-11-25 19:34 +03:00

The owner clarified the required visual order. The first fix kept Working inside the original assistant, which put the steering user message below the animation. `ChatArea` now renders one trailing Working indicator after that user entry until real post-steer content arrives; no second empty KIMI header appears.

Hygiene: the DOM-order regression was red before the follow-up and green afterward. Full extension remains 621 passed / 1 skipped; typecheck and root lint exit 0.
Functional run: NONE on the follow-up. A new VSIX must be packaged and observed.

corrected: `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`, `.changeset/kaif-chat-rendering-stability.md`, this bug and `testcases/reports/2026-11-25_steer_presentation.md` now describe the user-entry → trailing-Working order instead of retaining Working inside the original assistant.

## Isolated build-25 evidence — 2026-11-25 20:11 +03:00

Hygiene: full extension 621 passed / 1 skipped; typecheck and root lint green; VSIX static audit and Extension Host smoke pass.
Functional run: on packaged build 25, selecting `check-kimi-code-docs` during a held turn delivered exactly one `/skill:check-kimi-code-docs` entry into the active model request, with no queue and no second empty KIMI header. A held turn with AUTO STEER OFF and a queued skill showed `1 в очереди`, while `/skill:experience` was absent from the model request. The owner-required steering-entry → trailing-Working order is covered by the component regression; the live UI showed the same presentation path.

REAL WORLD: accumulated — the owner's build-22 steering screenshot remains the original observation; data and machine — isolated Windows VS Code 1.123.0 with packaged build 25; path — immediate Steer and queue in Second Side Bar. The isolated real product is verified. The owner's accumulated main profile has build 25 installed but its running Extension Host has not been restarted, so this bug is not DONE.

## Decisions made without the owner

Kept the empty steering assistant in the timeline for event compatibility and changed only its presentation boundary. Did not redesign steering delivery, optimistic user identity or queue behavior. The trailing indicator is presentation-only and disappears when real content arrives.

## Links

- `bugs/16_steer_avatar_precedes_user_bubble.md`
- `bugs/19_tool_cards_hide_working_state.md`
- `apps/vscode/webview-ui/src/stores/chat.store.ts`
- `apps/vscode/webview-ui/src/stores/event-handlers.ts`
- `apps/vscode/webview-ui/src/components/ChatArea.tsx`
- `apps/vscode/webview-ui/src/components/ChatMessage.tsx`
