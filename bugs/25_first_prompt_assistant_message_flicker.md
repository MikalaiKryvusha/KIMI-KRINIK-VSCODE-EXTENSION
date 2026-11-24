# Bug 25 — Chat feed briefly shows and then removes a Kimi message on the first prompt

**Status:** 🔴 OPEN
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

No screenshot, recording, DOM sequence or fresh log excerpt was captured for the transient entry. Build 12 was active on the owner's main profile. The current prompt path creates an optimistic user/assistant pair and later reconciles it by `clientId`; that path is an investigation lead, not a confirmed cause.

## Root cause / Hypotheses

1. Unverified: optimistic assistant entry replacement or removal during durable-event reconciliation.
2. Unverified: replay/loading state briefly replaces the live message list.
3. Unverified: viewport layout movement makes a persistent entry appear to vanish.

## Fix plan

Capture the first-send sequence with fresh webview events, DOM mutations and a screen recording on a new session. Identify the entry's `clientId` and lifecycle before changing code. Add the smallest regression at the public store/component boundary that demonstrates the observed disappearance, then preserve one stable visible entry through reconciliation and reload.

## Decisions made without the owner

Classified as S2 because a disappearing response can hide product output and interrupt work. Kept the cause open because the single visual observation cannot distinguish reconciliation from replay or viewport movement.

## Links

- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/22_first_send_stuck_in_steering_queue.md`
- `plans/03_sticky_viewport_prompt.md`
