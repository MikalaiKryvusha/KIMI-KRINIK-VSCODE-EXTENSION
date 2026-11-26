# Research 59 — KIMI KRINIK 1.0.0 release-blocker remediation

> **Created:** 2026-11-27
> **Parent:** owner's order to analyze, plan, fix, test and close the named 1.0.0 blockers; `reports/KAIF_AUDIT/2026-11-26_kimi_krinik_1_0_0_SUMMARY.md`; `researches/54_chat_pipeline_reliability.md`
> **Status:** evidence synthesized; no production code changed · [TESTED: 2026-11-27 · current-source/official-URL recon, kaif-core manifest and scoped requirements lint checked; no product functional run claimed]
> **Outbound:** `plans/04_EPIC_release_blocker_remediation.md`; phase 1 operational plan `plans/05_epic04_phase1_steering_attention.md`

## 1. Requirements and heaviness

The owner's verbatim order is:

> «Проводим по всем анализ кода, пишем план починки и приемки исправления тестами.
> Фиксим. Тестируем. Закрываем как исправленное, если тесты проходят. Если тесты не проходят - чиним дальше.»

The working scope is every blocker named in the preceding release assessment: `bugs/44`, `bugs/45`, `bugs/46`, the five Act findings, `bugs/25` and `bugs/11`. Cosmetic backlog items are not silently added. Publication itself is outside this epic and still requires the release gates and owner authorization.

This is heavy by at least four independent criteria: it touches runtime, webview stores, settings, audio and packaging; it depends on SDK/browser behavior; it exceeds one focused session; it changes user-visible release behavior. Each defect nevertheless keeps its own smallest red-before-fix boundary and existing bug document.

## 2. Existing project evidence

### 2.1 Prior art to reuse, not duplicate

- `researches/54_chat_pipeline_reliability.md` establishes two-ID reconciliation, honest `running | queued | blocked` outcomes, durable acceptance instead of dequeue, and the rule that uncertain delivery is not automatically resent.
- `plans/01_EPIC_chat_pipeline_reliability.md` already owns the outbound chat architecture. This epic references that track for `bugs/11` and the accepted-queue Act finding rather than inventing a second chat redesign.
- The independent audit verified all five Act mechanisms through real public modules, stores or components. Packaged-VSIX observations remain owed.
- `bugs/46` already inspected the MP3 sources and ruled out a missing initial word in the Russian recording. Its next step is measurement, not uniform audio padding.
- EXP-0015 requires an unmocked public provider/SDK observation for context delivery. EXP-0016 requires measuring visible text rather than assistant container counts. EXP-0022 requires turn identity across adapter boundaries. EXP-0024 requires reading the running build before isolated acceptance.

The status lines in research 54 and plans 01/02 still say implementation has not started. Their bodies are historical planning evidence; current bug documents and source show that substantial identity, optimistic-turn, queue and replay work has since landed. Those status lines must be synchronized without rewriting the history of the plans.

### 2.2 Current code facts

| Blocker | Current observed mechanism | Required observation before closure |
|---|---|---|
| Context blocked retry | `ContextWindowController` delivers `Promise<void>` and commits `said` after any resolved delivery; `SessionRuntime` discards `session.steer()`'s result (`context-window-control.ts:124-142`, `session-runtime.ts:108-115`) | Two equivalent blocked observations cause two submissions; a later accepted result commits once; real public runtime path |
| Accepted queued resubmission | An accepted `queued` response discards the optimistic turn and restores the sendable queue item while `queueSteerInFlight` remains set; a later terminal clears it and can advance the same item through `streamChat` (`chat.store.ts:402-435`, `602-695`) | Completion before durable start produces no second model request; later durable start yields exactly one |
| Secondary primary default | `saveConfig` writes `defaultModel` and primary thinking before persisting `secondaryModel` (`config.handler.ts:44-74`) | Global B plus resumed A persists secondary S without changing primary model/effort |
| Sound defaults | Manifest defaults are Voice/Voice/Voice/Off; shared defaults are Glass/Voice/Alert/Chime (`apps/vscode/package.json:95-115`, `shared/sounds.ts:15-20`) | Deep equality plus a fresh Extension Host default read; persisted user choices unchanged |
| Model picker Enter | The dialog-level handler chooses the active row for every bubbled Enter, including provider and favorite buttons (`ModelPickerDialog.tsx:88-103`, `117-176`) | Enter on each nested control performs only that control's action; search/list Enter still selects |
| Completion attention | The candidate gates terminal completion on `activeTurnIds`, active prompts, pending steers and exclusive work (`session-runtime.ts:569-618`, `657-663`) | Immediate and queued steering produce zero completion while active and exactly one at idle on the real webview/audio path |
| Transient steering error | Runtime terminal errors are always emitted; the store separately handles non-terminal warnings and inline errors. The owner's red frame has no captured identity (`session-runtime.ts:599-617`, `chat.store.ts:394-435`) | Capture the exact payload and DOM insertion/removal before changing a transition; genuine errors remain visible |
| Clipped attention audio | Every notification creates a fresh `Audio` and immediately calls `play()` without readiness state or queue (`webview-ui/src/lib/sounds.ts:29-40`) | First and warmed playback timelines plus audible output where the harness permits; EN/RU/ZH and rejection controls |
| Assistant disappearance | Previous replay and Markdown identity fixes landed, but the owner reported a fresh disappearance on the accumulated profile (`bugs/25`) | Frame-level visible-text trace on the actual path, with running build established first |
| Steering delivery | Optimistic identity and honest SDK results exist, but the owner's exactly-once turn-boundary criterion remains open (`bugs/11`) | Immediate display and exactly one durable submission across running, queued, blocked, fallback, completion and reload |

### 2.3 New hypothesis exposed by current-source recon

The bug-44 tests emit `turn.started` for an immediate steering turn before ending the previous turn. `SessionRuntime.steer()` does not add a returned running `turnId` to `activeTurnIds`; that set is updated only on `turn.started`. If the old terminal arrives after accepted running steering but before the new start event, `waitingForInput` can become true after settling the original prompt. This is a hypothesis, not a confirmed product defect. Phase 1 must test that exact ordering at the public runtime boundary before changing the candidate.

## 3. Industry sweep

### 3.1 Media playback is an asynchronous observable boundary

[MDN's `HTMLMediaElement.play()` contract](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) states that the returned promise resolves when playback has started and rejects when playback cannot start. It also warns that permission or startup delay means callers must not assume an immediate response. The implication is not “wait a fixed second”; it is to observe `play`, `playing`, readiness, rejection and `currentTime`, and to distinguish a rejected whole playback from a clipped beginning.

[MDN's autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), already recorded in bug 46, separates autoplay permission failures from readiness. A `NotAllowedError` normally rejects the entire play attempt, so it cannot by itself explain hearing every word except the first.

Anti-pattern: adding uniform leading silence to source files before proving that the playback pipeline is the losing stage. It changes every recording, delays notification and cannot repair a rejected promise.

### 3.2 Keyboard activation belongs to the focused control

The [WAI-ARIA button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) says Enter activates the focused button. [MDN's `stopPropagation()` contract](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) distinguishes stopping event propagation from cancelling the native default action. Therefore a dialog-level list handler must not reinterpret Enter from a nested provider/favorite button as list selection. The preferred fix is target-scoped handling that preserves native button activation, not globally suppressing keyboard behavior.

Anti-pattern: preventing every Enter default or stopping every dialog key event. That can fix the accidental model change while breaking the focused button, search selection or accessibility.

### 3.3 Durable acceptance, identity and no blind retry

Research 54 quotes the [Agent SDK TypeScript reference](https://code.claude.com/docs/en/agent-sdk/typescript): a message still listed as queued enters the conversation whether or not it receives a response, so resending delivers twice. It also quotes [Ably's optimistic-update guidance](https://ably.com/docs/ai-transport/features/optimistic-updates) and the inspected Claude bundle for client-generated correlation IDs reconciled with durable IDs.

The current accepted-queue mechanism violates the same boundary: an engine acceptance is converted back into sendable local intent before durable promotion. The correction must preserve accepted state until the engine start arrives, while a proven `blocked` result remains retryable.

Anti-pattern: using a timer or a narrow busy probe to resolve acceptance uncertainty. The engine result and durable prompt identity are the authorities.

## 4. Findings → implications for this epic

1. **Fix the smallest owning boundary.** Context delivery returns a submission outcome; accepted queue state remains distinct from sendable local queue state; secondary-only persistence bypasses primary setters; manifest defaults mirror the shared constant; keyboard handling respects the event target.
2. **Characterize races at their public boundaries.** New regressions use `SessionRuntime`, the real chat store and the real model-picker component, not private helpers or implementation trivia.
3. **Do not infer live correctness from the bug-44 candidate suite.** Add the accepted-running-before-start ordering and then perform immediate and queued guest-DOM/audio acceptance.
4. **Identify the red frame before fixing bug 45.** Suppressing all transient errors would hide genuine failures and violate the requirement.
5. **Measure audio before modifying it.** Readiness-first playback is a candidate only after the first/warmed timeline supports it; source MP3 edits require separate content evidence.
6. **Measure visible content for bugs 25/11.** Counting containers or green replay tests cannot close an owner-observed disappearance or exactly-once delivery gap.
7. **Preserve old paths.** Existing sessions without IDs, deliberate primary changes, persisted sound choices, replay silence, genuine errors, queue restoration and normal single-turn completion remain control cases.
8. **Close only on evidence.** A DONE rename requires the bug's own acceptance criterion, separate Hygiene and Functional run lines, a run report and the real-world boundary. A red or unobserved core path remains open.

## 5. Phase shape and gates

- **Phase 1 — steering and attention:** bug 44 live acceptance, bug 45 identity/fix, bug 46 measurement/fix. This follows the owner's most recent symptoms and `STATUS.md` without delaying later deterministic Act work behind speculative edits.
- **Phase 2 — five Act correctness fixes:** context retry, accepted queue, secondary default, sound defaults and keyboard Enter, each with red-before public-interface regression and packaged-path verification.
- **Phase 3 — message visibility and steering delivery:** bugs 25 and 11 after the Phase 2 queue correction, avoiding two competing edits to the same race.
- **Phase 4 — release-candidate hardening:** full extension suite, typecheck, root lint, one final universal+target VSIX set, isolated and accumulated-profile acceptance, independent judge. Publication is excluded.

Every phase ends with its own run report, updated bug documents, committed verified pieces and `/skill:fable-judge`. The next operational plan is written only after the previous phase closes.

## 6. Open forks for the owner

None blocks Phase 1. The owner already defined the visible behavior and ordered implementation. The permanent one-second audio pause remains explicitly undecided until measurement, as recorded in bug 46; this is an engineering measurement question, not a request to reopen the owner's sound design.
