# Audit 001 · Family: accepted queued steer is resubmitted

**Mechanism:** an engine-accepted queued item is returned to the sendable local queue and can be sent again by terminal queue advancement before its durable start arrives.
**Already guarded by:** repeat-click suppression and running/rejected queue paths; the accepted-queued/terminal ordering is unguarded.
**Occurrences:** F1.

## F1 — Completion after accepted queued response can issue a second model submission

**Quote:** `apps/vscode/webview-ui/src/stores/chat.store.ts:629` — `if (response.submission.state === "queued" && !draining) {`.

**Failure scenario:** lightning-submit Q1 while a turn is active; the engine accepts `state: "queued"`. The store restores Q1 locally. A terminal event before matching TurnBegin clears the in-flight marker and advances the queue; if the narrow busy probe is false, Q1 goes through ordinary `streamChat` in addition to the original `steerChat`.

**Severity:** Act — duplicate user action and model request; medium likelihood depending on acknowledgement/start ordering.

**Baseline:** known: 20, with a new accepted-queued/terminal mechanism.

kaif-fp: apps/vscode/webview-ui/src/stores/chat.store.ts :: accepted-queue-terminal-resubmission :: v2.10

**Dedup attestation:** accepted-queued/completion searches found bugs 20/22 and general contracts but no requeue path. Existing webview tests use running or rejected outcomes.

**Fix sketch:** distinguish engine-accepted queued items from sendable local entries and exclude the accepted item from automatic selection until durable promotion. Do not resolve acceptance uncertainty with a timer or idle probe; keep visible queued presentation.

**Fix accepted when:** `accepted queued steer is not resent when the previous turn completes first` completes the current turn without matching TurnBegin, answers busy=false and asserts no streamChat for Q1; supplying the later durable start yields exactly one final submission. Run `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/status-pills.test.tsx -t "accepted queued steer is not resent when the previous turn completes first"`. Today's real-store probe produced one steerChat followed by one ordinary streamChat for Q1.

**Do not touch:** immediate queue removal, repeat-click suppression, original-index restoration for ok:false/blocked/rejected outcomes and whole-batch draining after a genuine sending window.

**Meta:** links bugs 20/22, EXP-0012 and `researches/54_chat_pipeline_reliability.md` (“Do not auto-resend uncertainty”). Skeptic reproduced through the real store; packaged-VSIX timing remains to be covered after the fix.
