# Bug 19 — Tool cards leave no visible working state

**Status:** ✅ DONE — current isolated build 19 passes active tool, completion and replay observations
**Version/build:** KIMI KRINIK 1.0.0 · owner's accumulated VS Code profile · **When/context:** 2026-11-24 16:02 +03:00, recurring owner observation during active agent turns
**Severity:** S2
**Fixing:** after the immediate duplicate-steer fix in `bugs/20`; verify in isolated VS Code
**Fix accepted when (observable):** after one or more completed tool cards, while the agent's response is still active, the visible conversation continues to show «Работаю…» after the latest activity; the indicator disappears only when the response actually settles, and replayed history does not show a false active state.

## Symptom

The owner repeatedly sees a tool card such as `ReadFile` followed by a large blank area and no working/progress/result state, making the agent appear idle even though work continues.

## Repro

1. Start a response that invokes at least one tool and then continues with another model step.
2. Keep the turn active after the tool card/result arrives.
3. Inspect the conversation below the latest tool card.

## Expected result

The active response always retains a visible «Работаю…» indicator after the latest activity until the turn settles. The owner explicitly selected the KIMI FORK / Claude Code behavior.

[OWNER] «я за то, чтобы писать Работаю... в таких случая. Как это делает KIMI FORK и Claude Code» · 2026-11-24 16:02 +03:00 (чат)

## Actual result

Current build 19 shows «Работаю…» after the completed ReadFile card while the next model step is held. The indicator disappears on genuine completion and remains absent after replay.

## Forensics / hypotheses

- `ChatMessage.tsx:300-307` renders `WorkingIndicator` only when its `isStreaming` prop is true and no inline error/compaction state suppresses it.
- `ChatArea.tsx:37` passes that prop only to the last assistant message when the store's global `isStreaming` is true.
- `event-handlers.ts` clears global streaming on `stream_complete`, runtime errors and `StepInterrupted`, not on `ToolResult`.
- The owner screenshot alone does not distinguish an incorrect false streaming state, a last-message/timeline problem or a viewport issue. The live event sequence must be captured before naming the root cause.

## Resolution

The current lifecycle already preserves global streaming after ToolResult and passes it to the last assistant message. The original defect did not reproduce on the current build; no additional product change was needed.

## ✅ STATUS: DONE (2026-11-25 03:11 +03:00)

Hygiene: existing WorkingIndicator and chat lifecycle checks remain green in the full extension suite (597 passed, 1 skipped, 0 failed); root lint exits 0.
Functional run: fresh isolated build 19, scripted ToolCall → ToolResult → held next step. «Работаю…» was present with visible bounds top 169.58 / bottom 194.08 in a 522 px viewport and WebP `.tmp/k5-vscode/53-k19-tool-working.webp`. After release `statusText=null`; after real history replay `statusText=null` with the same tool card/response present. Report: `testcases/reports/2026-11-25_tool_working_build_19.md`.

Two-client replay is outside this bug's original acceptance and remains in the broader lifecycle matrix.

## Decisions made without the owner

Accepted the existing KIMI FORK / Claude Code «Работаю…» presentation as the required behavior because the owner selected it explicitly. The technical cause remains unclaimed.

## Links

- `apps/vscode/webview-ui/src/components/ChatArea.tsx`
- `apps/vscode/webview-ui/src/components/ChatMessage.tsx`
- `apps/vscode/webview-ui/src/components/WorkingIndicator.tsx`
- `apps/vscode/webview-ui/src/stores/event-handlers.ts`
- `bugs/20_queue_steer_duplicate_submission.md`
