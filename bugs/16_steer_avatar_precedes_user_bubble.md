# Bug 16 — Assistant avatar appears above the user's steering bubble

**Status:** 🔧 immediate/consecutive/replay order verified on isolated build 19; original main-profile path pending
**GitHub issue:** https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues/23
**Version/build:** KIMI KRINIK 1.0.0 · current working tree after `8ac5df733` · owner's accumulated VS Code profile · **When/context:** 2026-11-24 13:33 +03:00, owner live steering acceptance
**Severity:** S2
**Fixing:** as part of the chat-pipeline research and redesign; verify in isolated VS Code
**Fix accepted when (observable):** on immediate steering, replay and multiple consecutive steers, every user bubble precedes the assistant avatar and response section that follows it; no assistant avatar or step connector appears above a later user message.

## Symptom

The owner's screenshot shows the pink KIMI avatar and assistant step dot above the user's steering bubble, while the assistant reasoning section is below that bubble.

## Repro

1. Start an assistant response and send a steering message while it is running.
2. Inspect the vertical order of the user bubble, assistant avatar and reasoning section immediately and after replay.

## Expected result

The user steering bubble is a separate user entry in the conversation flow. The assistant avatar introduces only the assistant section below that entry.

## Actual result

The current lifecycle creates separate user entries for immediate and consecutive steering. On build 19 the visible and replayed order is base user → steer one → steer two → assistant avatar/response; no assistant avatar introduces a container above a later user bubble.

## Forensics / hypotheses

- `apps/vscode/webview-ui/src/stores/event-handlers.ts:562-570` appends `SteerInput` as an item inside the current assistant message's steps.
- `apps/vscode/webview-ui/src/components/ChatMessage.tsx:258-287` renders the assistant avatar before all step items, including `steer`.
- This structural ordering is confirmed by the code. The redesign must also preserve chronological order across multiple steers and replay.

## Resolution

The current optimistic `clientId` lifecycle and atomic replay already provide the required separate user sections. The original defect did not reproduce on the current build; no additional product change was needed.

## STATUS: ISOLATED VERIFIED (2026-11-25 03:26 +03:00) — main-profile acceptance pending

Hygiene: existing optimistic reconciliation and chat component checks remain green in the full extension suite (597 passed, 1 skipped, 0 failed); root lint exits 0.
Functional run: fresh isolated build 19, two consecutive steering messages. Immediate WebP `.tmp/k5-vscode/54-k16-two-steers.webp` showed base/one/two before KIMI. A clean second series and real replay returned text offsets base=14, one=61, two=71, response=87, with no active indicator, error or Retry. WebP `.tmp/k5-vscode/55-k16b-clean-order.webp` and `.tmp/k5-vscode/56-k16b-replay-order.webp` were opened and read. Report: `testcases/reports/2026-11-25_steer_avatar_order.md`.

## Decisions made without the owner

Filed separately from delivery because this defect persists in the presentation model even when steering delivery succeeds. No pipeline code was changed in this report.

## Links

- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/13_steer_attachments_and_thumbnails.md`
- `apps/vscode/webview-ui/src/components/ChatMessage.tsx`
