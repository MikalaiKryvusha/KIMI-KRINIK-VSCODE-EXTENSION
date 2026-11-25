# Bug 18 — Sending during an active response surfaces a generic internal error

**Status:** 🔧 current ON/OFF/fallback contracts and isolated build-19 paths pass; original main-profile path pending
**Version/build:** KIMI KRINIK 1.0.0 and official `moonshot-ai.kimi-code-0.9.0` · owner's accumulated VS Code profile · **When/context:** 2026-11-24 15:24:10 +03:00, owner chat sends; reported during chat-pipeline characterization
**Severity:** S2
**Fixing:** this session as owner debt; include the contract in the chat-pipeline characterization before implementation
**Fix accepted when (observable):** with a response active, a new Send never produces the generic `Internal error occurred.` path: AUTO STEER ON delivers through steer exactly once and AUTO STEER OFF shows the ordinary queue; the original response continues, no duplicate prompt is launched, and the behavior remains correct after the running→idle transition in isolated VS Code.

## Symptom

The owner sent a chat message and received a toast saying only `Internal error occurred.` The owner observed the same visible error in KIMI KRINIK and the official extension.

## Repro

1. Start a response and keep it active.
2. Submit another ordinary `streamChat` request for the same session before the active response finishes.
3. Read the runtime log and the visible toast.

The owner path is reproduced by the existing runtime-level reentrant-prompt case; the exact webview state that chose `streamChat` instead of steer/queue still needs its own regression.

## Expected result

`GOAL.md` requires ON to steer and OFF to queue during a running turn. A stale UI state or timing boundary must not turn a valid user Send into an unexplained internal error or a duplicate prompt.

## Actual result

The current user paths no longer reproduce the generic toast: AUTO STEER ON uses steering, OFF shows the queue, and running→idle fallback/batch tests preserve one submission. Direct reentrant `streamChat` remains guarded and covered as a low-level control, not a valid webview send route.

## Forensics

- `apps/vscode/src/runtime/session-runtime.ts:191-207` rejects a reentrant `prompt()` when `isBusy`, emitting `ALREADY_GENERATING_MESSAGE`; `hasActiveWork` makes it non-terminal.
- `apps/vscode/test/kimi-runtime.test.ts:972-1000` already proves the low-level guard and confirms the first turn continues.
- `apps/vscode/test/settings-store.test.ts:574-601` confirms the generic warning and unchanged streaming state.
- The official installed `moonshot-ai.kimi-code-0.9.0-win32-x64/dist/extension.js` contains the same `A response is already being generated for this session.` guard. The owner supplied the official-extension observation; a matching official output-log line has not been found, so that log path is not claimed as evidence.
- The fresh KIMI KRINIK log shows an active first request, a rejected second `streamChat`, then completion of the first request. This proves the direct rejection mechanism, not yet which stale state/race selected the wrong outbound path.

## Root cause / Hypotheses

The immediate cause of the generic toast is confirmed: the runtime's reentrant-prompt guard fires and the webview hides the useful detail behind a generic message. The triggering outbound-state mismatch is a chat-pipeline defect related to `bugs/11` and `bugs/14`; it is not evidence of a provider failure.

## Original failure evidence

At 2026-11-24 15:24:10 +03:00 the KIMI KRINIK output log recorded:

```text
Session runtime error: Error: A response is already being generated for this session.
[bridge] id=296_1795523050193 method=streamChat ok=true durationMs=21
```

The UI mapped that event to `Internal error occurred.` while the earlier `streamChat` remained active until 15:24:19.

## Resolution

The optimistic lifecycle, full `PromptSubmissionResult` propagation, stale-state fallback and visible queue now cover the valid user routes that previously reached the reentrant guard. The low-level guard and its non-terminal warning test remain intact.

## STATUS: ISOLATED VERIFIED (2026-11-25 03:51 +03:00) — main-profile acceptance pending

Hygiene: 106 runtime/settings/chat-store checks pass, including the low-level active-response guard, unchanged streaming state, ON/OFF routing and exactly-once fallback. Full extension suite remains 597 passed, 1 skipped, 0 failed; root lint exits 0.
Functional run: current isolated build 19 ON consecutive steering and OFF queue/dequeue paths completed without `Internal error occurred.`; build 17 genuine running→idle batch also delivered without the generic error. Evidence: `testcases/reports/2026-11-25_steer_avatar_order.md`, `testcases/reports/2026-11-25_multiline_queue_steer.md`, `testcases/reports/2026-11-25_queue_batch_build_17.md`, and `testcases/reports/2026-11-25_reentrant_send_contract.md`.

The official extension was not modified.

## Decisions made without the owner

Kept this as a separate owner-facing defect although it shares the outbound-state mechanism with `bugs/11` and `bugs/14`: the generic error is a distinct observed symptom and acceptance case. Phase 0 remains documentation/tests-only while this owner debt is characterized.

## Links

- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/14_steer_queue_not_added.md`
- `apps/vscode/src/runtime/session-runtime.ts`
- `apps/vscode/test/kimi-runtime.test.ts`
- `apps/vscode/test/settings-store.test.ts`
- `C:/Users/krinik/AppData/Roaming/Code/logs/20261124T151151/window1/exthost/output_logging_20261124T151155/2-KIMI KRINIK.log`
