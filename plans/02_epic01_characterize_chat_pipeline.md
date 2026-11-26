# Plan 02 — Epic 01 phase 0: characterize the outbound chat pipeline

> **Created:** 2026-11-24
> **Parent:** `plans/01_EPIC_chat_pipeline_reliability.md` — «Phase 0 — Characterization and red contracts»
> **Status:** historical phase-0 plan; related contracts landed incrementally through bug documents, with no standalone phase closure claimed; current execution is tracked by `plans/04_EPIC_release_blocker_remediation.md`
> **Outbound:** red evidence and the final case matrix feed Phase 1, whose operational plan is written afterward
> **Verification:** [TESTED: 2026-11-24 · suite paths and phase anchors checked; requirements/attribution lint and fable-judge VERIFIED WITH CAVEATS — scenario-lint SKIPPED, red contracts not executed yet]

## 1. Goal vector

**Achieve.** Convert every owner-observed steering, queue, media, avatar and hook defect into the smallest executable contract at the real owning boundary.

**Maintain.** Preserve the production implementation during this phase and distinguish existing contractual behavior from behavior that must change by owner requirement.

**Avoid.** False green from mocked `{ok:true}`, a rewritten assertion fitted to current behavior, or a broad implementation started without a failing reproduction.

## 2. Acceptance criteria

- Every `bugs/11`–`bugs/16` row maps to at least one failing test with the expected assertion and owning file.
- `running`, `queued` and `blocked` have different expected runtime/host outcomes; unconditional `SteerInput` is demonstrated as incorrect for non-running states.
- A deferred steer proves that no optimistic bubble exists before acknowledgement in the original store.
- Reverse-order completion demonstrates stale composer/media mutation; queue and exactly-once fallback have their own red cases.
- `turn.started.promptId` and replay attributes have red propagation contracts.
- Avatar order, clickable media and hidden hook output have red rendering contracts.
- The run report records commands, original-code failure signatures and explicitly untested dimensions. Production files are unchanged in this phase.
- The full suite is not declared green or committable while new contracts are intentionally red. Phase 1 starts by turning them green.

## 3. Test basis and existing artifacts

Use existing suites only:

- `apps/vscode/test/session-runtime.test.ts`
- `apps/vscode/test/bridge-handler.test.ts`
- `apps/vscode/test/event-adapter.test.ts`
- `apps/vscode/test/replay-adapter.test.ts`
- `apps/vscode/test/webview/chat-store.test.ts`
- `apps/vscode/test/webview/chat-message.test.tsx`
- `apps/vscode/test/webview/status-pills.test.tsx`
- `testcases/TC_K5_live_acceptance.md` C09/C10/C19 and `bugs/11`–`bugs/16`

No new production abstraction is introduced in this phase. New test documentation goes to `testcases/TC_chat_pipeline_reliability.md`; run evidence goes to `testcases/reports/2026-11-24_chat_pipeline_characterization.md`.

## 4. Steps

### 4.1 Freeze the current-path inventory

- [ ] Quote `plans/01_EPIC_chat_pipeline_reliability.md` §4 «Инвентарь старого пути» and check every row against `chat.store.ts`, `chat.handler.ts`, `session-runtime.ts`, `event-adapter.ts`, `replay-adapter.ts` and the shared legacy event types.
- [ ] Record the current public shapes: `PromptSubmissionResult`, `SteerChat` params/result, `SteerInput`, `TurnBegin`, queue item and media conversion.
- [ ] Write `testcases/TC_chat_pipeline_reliability.md` with positive smoke first, then state/race/media/replay dimensions and explicitly excluded cases.
- [ ] Verification: every bug 11–16 has requirement → test ID → owning suite → expected original failure; no uncovered owner symptom.

### 4.2 Pin honest SDK result and identity contracts

Anchor: meta-plan Phase 1 — «SessionRuntime.steer возвращает PromptSubmissionResult … TurnBegin и replay получают promptId».

- [ ] In `session-runtime.test.ts`, add running/queued/blocked fixtures and require the complete result instead of unconditional `SteerInput`.
- [ ] In the owning handler suite, require the same result through `SteerChat`; preserve legacy media conversion and `runtime.isBusy` fallback coverage.
- [ ] In `event-adapter.test.ts`, require `TurnBegin.payload.promptId` from `turn.started.promptId`, including its absence for old events.
- [ ] In `replay-adapter.test.ts`, require replay correlation from `attributes.promptId/userMessageId` and content/order fallback for old records.
- [ ] Verification: run the four suites and capture the original failures; prove `queued` and `blocked` cannot be treated as successful running.

### 4.3 Pin optimistic, stale-response, queue and media contracts

Anchor: meta-plan Phase 2 — «immediate optimistic bubble, visible queue, per-ID completion, stale-response guard, media ownership, serialisation/FIFO, exactly-once fallback».

- [ ] In `chat-store.test.ts`, defer `steerChat`; require the text/image bubble and thumbnail data before the Promise resolves.
- [ ] Complete two or three requests in reverse order; require no obsolete `composerRestore`, no newer media removal and only per-ID state changes.
- [ ] Model `queued` and `blocked`; require visible queued state and failed-current restoration, not successful steering.
- [ ] Model the running→idle fallback; require one steer path, one ordinary prompt path with the same prompt ID, and exactly one final user entry.
- [ ] In `status-pills.test.tsx`, require immediate visible queue insertion and queued→running promotion without duplication.
- [ ] Verification: each new assertion fails on the original store for the intended missing behavior; existing retry and rejected-current cases remain unchanged.

### 4.4 Pin timeline, viewer and hook contracts

Anchor: meta-plan Phase 3 — «steering как отдельная user entry, avatar ниже пользователя, общие MessageMedia/MediaPreviewModal, replay по ID … скрытие hook parts».

- [ ] In `chat-message.test.tsx`, require DOM order user steering bubble → assistant avatar/response, including two consecutive steers.
- [ ] Require image/video thumbnails in the steering bubble and a click that opens the existing viewer with the same URI.
- [ ] Change the replay hook expectation intentionally: `merged hook note` reaches no visible `ContentPart`, while `Merged prompt` remains. Record the owner requirement as the reason for the changed assertion.
- [ ] Require replayed old records without IDs to preserve content/order and replayed new records to avoid optimistic/durable duplicates.
- [ ] Verification: original rendering fails avatar/media/hook assertions for the stated reason; no snapshot is rewritten blindly.

### 4.5 Record red evidence and hand Phase 1 a precise scope

- [ ] Run each targeted suite separately with `pnpm exec vitest run --reporter=agent <files>`; save exact expected/received signatures in the run report.
- [ ] Run `node .kaif/tools/kaif-testrun-lint.mjs check` and `node .kaif/tools/kaif-scenario-lint.mjs check testcases/TC_chat_pipeline_reliability.md` if the scenario form is used.
- [ ] Verify `git diff --name-only` contains only tests/docs for this phase; do not commit a red suite.
- [ ] Update `bugs/11`–`bugs/16` with reproduction forensics and `STATUS.md` with the completed characterization and the next implementation boundary.
- [ ] Run `/skill:fable-judge` over the claim «all owner symptoms now have failing contracts»; then write the Phase 1 operational plan using the observed failures.

## 5. Risks and stop rules

- A test that fails for fixture/mock reasons is a stand defect first; print the stand state and fix the fixture rather than blaming the product.
- Three failing attempts to make one reproduction deterministic trigger `/skill:bug-research`, not a fourth blind rewrite.
- Existing assertions that encode visible hook text or unconditional steering are changed only with owner-requirement justification, never weakened to match current output.
- No production behavior change, `.skip`, sleep-based synchronization or retry-until-green is allowed.
- If a contract cannot be observed at the public runtime/store/adapter boundary, stop and record the missing observation path instead of testing private implementation trivia.

## 6. Decisions made without the owner

[AI] by mandate — the owner asked for research and plans before the whole-flow repair.

- Phase 0 uses intentionally red contracts as evidence and is not treated as a committable green product cut.
- Existing suites are extended; no parallel test hierarchy or production abstraction is created for characterization.
- `PromptSubmissionResult` plus `turn.started` is the initial identity source; no SDK event contract is changed in this phase.
