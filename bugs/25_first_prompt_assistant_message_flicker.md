# Bug 25 — Chat feed briefly shows and then removes a Kimi message on the first prompt

**Status:** 🔧 replay flicker reproduced and fixed on isolated build 19; original main-profile first-prompt variant remains unverified
**Version/build:** KIMI KRINIK 1.0.0 build 12 · `6fea8307b` · owner's accumulated VS Code profile · **When/context:** 2026-11-24 23:50 +03:00, first message of a new session
**Severity:** S2
**Fixing:** after the owner-requested context-ring color change; before further backlog work
**Fix accepted when (observable):** sending the first message does not flash the conversation or transiently show an assistant entry; every real assistant message remains visible in the same position through reconciliation, completion and reload.

## Symptom

[OWNER] «когда я тебе это сообщение отправил первое - в полотне чато что-то резко моргнуло. словно какое-то сообщение от КИМИ появилось и тут же исчезло - баг» · 2026-11-24 23:46 +03:00 (чат)

The whole chat feed flickered immediately after the first prompt. The owner perceived a short-lived Kimi message that appeared and disappeared. Whether this was an optimistic assistant placeholder, a durable event reconciliation, or another render path is not yet known.

## Repro

1. Open a new KIMI KRINIK session on the owner's accumulated profile.
2. Send the first prompt.
3. Observe the chat feed frame by frame until the durable assistant response settles.
4. Reload the session and compare the persisted entries with the transient sequence.

The symptom is owner-observed once; deterministic reproduction and frame-level evidence are still missing.

## Forensics

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

## Decisions made without the owner

Classified as S2 because a disappearing response can hide product output and interrupt work. Kept the cause open because the single visual observation cannot distinguish reconciliation from replay or viewport movement.

## Links

- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/22_first_send_stuck_in_steering_queue.md`
- `plans/03_sticky_viewport_prompt.md`
