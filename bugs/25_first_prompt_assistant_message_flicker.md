# Bug 25 — Chat feed briefly shows and then removes a Kimi message on the first prompt

**Status:** 🔴 OPEN — owner observed another message-specific disappearance during the build-45 release-preparation closure; the running main build is not inferred
**GitHub issue:** https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues/2
**Version/build:** KIMI KRINIK 1.0.0 builds 12 and 19; recurrence during the build-45 closure with the main running build unverified · **When/context:** original first prompts and 2026-11-26 17:06 +03:00, ordinary progress messages during closure
**Severity:** S2
**Fixing:** after the owner-requested context-ring color change; before further backlog work
**Fix accepted when (observable):** sending the first message does not flash the conversation or transiently show an assistant entry; every real assistant message remains visible in the same position through reconciliation, completion and reload.

## Symptom

[OWNER] «когда я тебе это сообщение отправил первое - в полотне чато что-то резко моргнуло. словно какое-то сообщение от КИМИ появилось и тут же исчезло - баг» · 2026-11-24 23:46 +03:00 (чат)
[OWNER] «сразу как я тебе первое сообщение resume отправил - в полотне чата твоё какое-то сообщение появилось и мгновенно исчезло. Баг присутвтствует.» · 2026-11-25 16:41 +03:00 (чат)

[OWNER] «только что ты написал сообщение и оно исчезло» · 2026-11-25 23:07 +03:00 (chat)

2026-11-25 23:08 +03:00 — the current accumulated main-profile wire contains both real progress text parts of turn 31, including the tooltip/sticky plan at 23:04:50 and the sticky cause at 23:06:22. Turn 31 then completed, while the following sticky-padding turn 32 was prompt-only and ended without a step. The text therefore reached the engine/UI event stream; its disappearance is not a missing model generation. The optimistic-steer store path does not obviously remove the original assistant, so no new fix is claimed yet. The next packaged check must observe this exact progress-text → prompt-only steer sequence with DOM mutations.

The whole chat feed flickered immediately after the first prompt. The owner perceived a short-lived Kimi message that appeared and disappeared. Whether this was an optimistic assistant placeholder, a durable event reconciliation, or another render path is not yet known.

2026-11-25 23:24 +03:00 — a deterministic public-store sequence for visible progress → SteerInput → original completion → prompt-only TurnBegin exposed a separate identity defect: TurnBegin no longer matched the already-reconciled user and appended a third assistant. `reconcileOptimisticTurn` now matches a known clientId regardless of its prior optimistic flag; the regression is red before and green afterward, with chat-store 33/33. The original visible progress remained in the store even in the broken sequence, so this duplicate-turn fix is relevant hygiene but is not yet claimed as the disappearance fix. Real packaged DOM observation remains required.

2026-11-25 23:34 +03:00 — the owner's steering-race hypothesis reproduced deterministically at the public store boundary. With an original turn 0 and an optimistic steering assistant already appended, a late turn-0 ContentPart was written into the steering assistant; turn-0 completion also finalized that wrong assistant. The SDK had supplied turnId all along, but the event adapter discarded it. ContentPart now carries optional additive turnIndex metadata, and ContentPart/stream completion select the owning assistant with legacy fallback for events without an index. Adapter and store regressions were red before and green afterward: 65/65. This is the confirmed routing race, but the owner's rendered disappearance is not called verified-fixed until the packaged held-response → steer DOM run.

2026-11-26 00:36 +03:00 — packaged build 33 real isolated run: a fresh fake model emitted `K5 first chunk`, the user steered while the original turn was held, and MutationObserver kept that first chunk in the same assistant ID before and after steer; the late response remained visible with no disappearance frame. No original-text loss reproduced on the real packaged path. Accumulated main-profile observation remains open.

## Recurrence during release-preparation closure — 2026-11-26 17:06 +03:00

[OWNER] «ну вот опять - ты сейчас одно сообщение написал, оно побыло несколько секунд. Затем исчезло, и появилось другое , а потом и оно исчезло.» · 2026-11-26 17:06 +03:00 (chat)

The owner then corrected the second part: «а, нет, чторое не исчезло … но первое исчезло», followed by «вот опять исчезло сообщение». The durable sequence therefore is: the first progress message appeared briefly and disappeared; the later closure message remained; a subsequent disappearance was reported without identifying its text.

This is a fresh owner-observed recurrence on the accumulated main profile, during ordinary progress reporting rather than only the first prompt. The current running build and the precise render path are not established. Do not call the earlier replay/Markdown fixes sufficient and do not infer the cause from the closure itself. The next session must capture frame-level DOM mutations for these specific progress messages before changing code.

## Repro

1. Open a new KIMI KRINIK session on the owner's accumulated profile.
2. Send the first prompt.
3. Observe the chat feed frame by frame until the durable assistant response settles.
4. Reload the session and compare the persisted entries with the transient sequence.

The symptom is owner-observed on builds 12 and 19; deterministic reproduction and frame-level evidence of the original first-prompt path are still missing.

## Forensics

2026-11-25 16:41 +03:00 — the owner sent `resume` as the first message of this session on the accumulated main profile and immediately saw a Kimi message appear and vanish. Build 19 was installed with exact extension/webview hashes before this session; this reopens the original first-prompt path after the isolated non-reproductions below. The session wire contains no completion before the first visible text: `resume` at 16:41:11, first step at 16:41:15, first text at 16:41:29. An early current-turn `stream_complete` is therefore not the observed cause.

2026-11-25 16:52 +03:00 — re-reading the old build-19 traces found the evidence the earlier container-only verdict missed: `.tmp/k25-instant-trace.json` records `K25 response` removed and re-added around text finalization, and `.tmp/k25-fixed-summary.json` has one frame with `assistants: 1` but `hasResponse: false`. The assistant container survived while its visible response did not. This matches the owner's perceptual symptom and redirects reproduction from message-list emptiness to Markdown/text replacement.

2026-11-25 02:14 +03:00 — isolated build 18 instant first prompt did not reproduce assistant loss: MutationObserver/requestAnimationFrame kept one assistant container through optimistic, durable and completed states. Markdown text nodes were replaced internally without losing the container. Trace: `.tmp/k25-instant-trace.json`; final WebP `.tmp/k5-vscode/49-k25-instant-settled.webp`.

Session replay on build 18 did reproduce the visual class: one frame had `assistants=0` and no `K25 response`, followed by `assistants=1` about 21 ms later. `loadSession` published `messages: []` and then issued a separate store update for every replay event. This confirms a replay/loading blank frame, not the original first-prompt route.

2026-11-25 05:15 +03:00 — build-19 held first prompt also completed without assistant removal: the observer's removal list is empty, and final `K23 multiline response` remains visible. WebP `.tmp/k5-vscode/60-k25-delayed-first.webp` was opened and read.

## Root cause / Hypotheses

1. Not reproduced on isolated instant first prompt: optimistic assistant entry remained stable through durable reconciliation.
2. Confirmed on build-18 replay: reset plus per-event store updates published an empty message list and intermediate history states.
3. Unverified on the owner's original path: viewport movement or a different accumulated-profile event sequence.

## Fix

Apply initial session state, every replay event and final text completion in one Immer transaction. Live queue scheduling and attention wrappers no longer run for replay. A store subscription regression fails if any intermediate update publishes zero messages.

## Fix evidence — 2026-11-25 02:14 +03:00

Hygiene: the new empty-list regression was red before the change; chat store, attention and replay suites total 65 passed afterward, with typecheck green.

Functional run: fresh isolated build 19 replayed between two completed sessions. Frame-level readback stayed at one assistant container throughout (`1 → 1 → 1 → 1 → 1`) and ended on `K25 response`; the build-18 `0` frame was gone. `.tmp/k25-fixed-summary.json` and WebP `.tmp/k5-vscode/50-k25-atomic-replay.webp` were read. Report: `testcases/reports/2026-11-25_atomic_replay_build_19.md`.

REAL WORLD: accumulated — the owner's original build-12 first-prompt observation; data and machine — his Windows main profile; path — first prompt in Second Side Bar. The reproduced replay defect is verified only in isolated build 19; the original first-prompt/main-profile case stays open and this bug is not DONE.

TWINS: searched `messages: []`, replay loops through `get().processEvent` and `attentionSuppressed` — the single `loadSession` replay path now applies atomically; `startNewConversation` intentionally remains a real empty conversation, not a replay.

## Fix evidence — 2026-11-25 17:16 +03:00

The live first-prompt class also had a rendering cause: changing `enableEnrichment` replaced Markdown's custom component identities and remounted visible assistant paragraphs. `Markdown.tsx` now keeps those identities stable while the latest enrichment state is read through a ref; deferred file checks and all existing call sites are unchanged.

Hygiene: step and fallback regressions were red before the change and green afterward. Webview is 165/165 and the full extension suite is 610 passed / 1 skipped, with typecheck and root lint green.

Functional run: isolated build 22 completed first and multiline prompts with no assistant-response removals in `.tmp/k22-trace.json`. Build 20 had shown the old remove/re-add behavior. The build-22 screenshots were opened and read. Report: `testcases/reports/2026-11-25_chat_rendering_build_22.md`.

@guard assistant-text-finalization
THREAT: a real assistant response flashes out of the conversation when a streaming step or fallback response finishes.
PROVED-AGAINST: component rerenders from unfinished to finished text remounted the exact visible paragraph before the fix; both variants are green afterward, and isolated build 22 recorded no response removals.
GAP: the component test does not measure the owner's full accumulated-profile frame sequence; the isolated VSIX covers the real renderer and event path.
ON-REAL-PATH: isolated packaged build 22 verified; accumulated main-profile running build 22 NOT YET.

REAL WORLD: accumulated — the owner's build-12/build-19 first-prompt observations; data and machine — his Windows main profile; path — first prompt in Second Side Bar. Build 22 is installed on that profile, but its running Extension Host has not been restarted and observed. This bug is not DONE.

TWINS: searched every `enableEnrichment` call site and the old component-map dependencies. The shared Markdown fix covers normal steps, fallback content, thinking and tool text; no second component map with the old finalization dependency remains.

TWINS-MECH: a visible response can vanish through list reset, container removal, text-node replacement, renderer remount or viewport movement. The first three forms were searched and measured; viewport movement was excluded by the reproduced DOM replacement, not assumed impossible in other reports.

## Decisions made without the owner

Classified as S2 because a disappearing response can hide product output and interrupt work. Kept the cause open because the single visual observation cannot distinguish reconciliation from replay or viewport movement. Later preserved deferred enrichment through a latest-value ref instead of enabling file checks on every streaming delta, after the component tests isolated renderer identity as the remount cause.

## Links

- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/22_first_send_stuck_in_steering_queue.md`
- `plans/03_sticky_viewport_prompt.md`
