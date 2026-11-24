# Bug 20 — Queue lightning gives no immediate response and submits duplicates

**Status:** 🔴 OPEN
**Version/build:** KIMI KRINIK 1.0.0 · owner's accumulated VS Code profile · **When/context:** 2026-11-24 16:02 +03:00, owner queue steering during an active response
**Severity:** S2
**Fixing:** this session before the other open chat-pipeline contracts; verify in isolated VS Code
**Fix accepted when (observable):** the first lightning click immediately removes that queue row as accepted for processing and produces exactly one `steerChat` call across ten rapid activations; an unaccepted or rejected call restores the same item at its original index, while a later genuine retry can send it once.

## Symptom

The owner clicks the queue lightning Steer action, sees no immediate response, clicks again and later discovers that about ten identical messages were submitted.

## Repro

1. During an active response, open a queue containing at least one message.
2. Activate its lightning action repeatedly before the first RPC settles.
3. Count outgoing `steerChat` calls and watch the queue row.

## Expected result

The first activation immediately changes the visible queue so the user knows the action was accepted. Duplicate delivery is prevented internally, not by presenting a disabled button as the UX solution. Failure restores the item for a deliberate retry.

[OWNER] «должна быть не блокировка - а мгновенный отклик UI/UX на действия пользователя» · 2026-11-24 16:02 +03:00 (чат)

## Actual result

The queue row remains unchanged until the RPC resolves and every activation starts another request.

## Forensics

- `apps/vscode/webview-ui/src/components/QueuedMessagesPanel.tsx:18-22` awaits `bridge.steerChat(content)` and removes the row only for `result.ok`.
- `QueuedMessagesPanel.tsx:32-43` exposes the lightning without an in-flight guard or immediate queue projection change.
- There is no rejection handler, so a failed request has neither reliable restoration feedback nor a completed pending state.

## Root cause / Hypotheses

The component lacks an optimistic queue transition and an in-flight identity guard. The duplicate mechanism is confirmed by the event path; no engine defect is required to explain it.

## Fix plan

Add a regression at the existing `status-pills.test.tsx` user boundary. On the first activation, synchronously remove the item and issue one call; suppress repeat activation for the same in-flight item. Restore the captured item at its original index for `{ ok: false }` or rejection, then permit a genuine retry. Do not add an unconditional `SteerInput` echo or alter the official SDK in this targeted fix.

## Decisions made without the owner

Chose immediate queue removal as the optimistic response, with restoration on failure, following the owner's explicit rejection of a disabled-only answer and the existing `app-client` queue-restoration prior art in `researches/54`. This does not claim the wider optimistic/replay lifecycle is complete.

## Links

- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/14_steer_queue_not_added.md`
- `bugs/19_tool_cards_hide_working_state.md`
- `apps/vscode/webview-ui/src/components/QueuedMessagesPanel.tsx`
- `apps/vscode/test/webview/status-pills.test.tsx`

## ✅ STATUS: DONE (2026-11-24 17:45 +03:00)

The first lightning activation removes the row immediately, one in-flight item produces one call, and false/rejected outcomes restore exact index for deliberate retry. Hygiene: 8/8 status-pill tests and full extension 571 passed/1 skipped. Functional run: isolated installed VSIX removed the row immediately, host logged one `steerChat`, fake model received one steering message across ten activations.
