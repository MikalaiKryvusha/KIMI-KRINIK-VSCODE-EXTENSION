# Bug 16 — Assistant avatar appears above the user's steering bubble

**Status:** 🔴 OPEN
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

The assistant avatar introduces a container that includes the later user steering bubble, reversing the visible ownership/order boundary.

## Forensics / hypotheses

- `apps/vscode/webview-ui/src/stores/event-handlers.ts:562-570` appends `SteerInput` as an item inside the current assistant message's steps.
- `apps/vscode/webview-ui/src/components/ChatMessage.tsx:258-287` renders the assistant avatar before all step items, including `steer`.
- This structural ordering is confirmed by the code. The redesign must also preserve chronological order across multiple steers and replay.

## Fix plan

Include this case in the chat-pipeline research. Represent steering as a separate user entry or otherwise split the assistant container at the steering boundary, with stable message identity and no duplicate optimistic/replayed entries. Add immediate and replay rendering regressions with avatar order assertions and isolated-VS-Code screenshots.

## Decisions made without the owner

Filed separately from delivery because this defect persists in the presentation model even when steering delivery succeeds. No pipeline code was changed in this report.

## Links

- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/13_steer_attachments_and_thumbnails.md`
- `apps/vscode/webview-ui/src/components/ChatMessage.tsx`
