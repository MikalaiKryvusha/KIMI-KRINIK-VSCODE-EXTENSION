# Test run report — completion attention only at genuine idle (bug 44, build 49)

**Created:** 2026-11-27 01:26 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK 1.0.0 builds 47–49, win32-x64 VSIX

## 1. Work

`bugs/44` / KIMI KRINIK issue #1: accepted immediate and queued steering must not emit completion attention while work continues. Only the final idle waiting-for-input boundary may emit it. Basis: the owner's completion contract, `plans/05_epic04_phase1_steering_attention.md` and the public `SessionRuntime` event stream.

## 2. Contour

Windows 11, Node 24.15.0, Vitest/jsdom, VS Code 1.123.0, packaged win32-x64 builds 47/48/49 installed on main and isolated profiles, testkit fake model with held main and compaction lanes. The main self-hosting window was not reloaded. Every isolated launch used a new PID; build identity was read in the Action Menu.

REAL WORLD: accumulated — the owner's main profile and the isolated profile's accumulated fake-model configuration; data and machine — the owner's Windows machine and real session lifecycle; path — public runtime regressions and packaged VS Code guest DOM/bridge/audio. Build 49 was observed only on the isolated profile. The owner's accumulated main profile and audible speaker output were not verified and remain a stop for DONE.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-27 00:30 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts -t "before an accepted steering turn starts"` | red before the first fix: terminal 1 emitted `stream_complete` after accepted turn 2 but before its start |
| 2 | 2026-11-27 00:55 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts -t "steering submission"` | two red before defer: terminal while `session.steer()` was pending emitted completion for accepted and blocked outcomes |
| 3 | 2026-11-27 01:17 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts -t "host completion"` | two red before host gating: `/compact` completion was emitted while queued/blocked steering was pending |
| 4 | 2026-11-27 01:18 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts` | 52/52 pass after all three mechanisms were fixed |
| 5 | 2026-11-27 01:19 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test` | 664 passed / 1 skipped |
| 6 | 2026-11-27 01:19 +03:00 | `pnpm --filter kimi-code-kaif run typecheck` and `pnpm lint` | both exit 0 |
| 7 | 2026-11-27 01:19 +03:00 | `pnpm --filter kimi-code-kaif package:platform --target win32-x64` and `pnpm --filter kimi-code-kaif package:verify --target win32-x64` | build 49 packaged and audited; 44 files, entry import smoke passed |
| 8 | 2026-11-27 00:47 +03:00 | build-47 isolated `node .tmp/k5-cdp.mjs eval …`, `.tmp/k47-*` guest probes and fake-model release | immediate steering emitted premature completion/audio and another at final idle; fix was incomplete |
| 9 | 2026-11-27 01:06 +03:00 | build-48 immediate `.tmp/k47-*` probes and release | immediate path passed: no intermediate completion/audio, one at idle |
| 10 | 2026-11-27 01:14 +03:00 | build-48 `/compact` + follow-up + compaction release | queued path failed: host completion/audio preceded the follow-up `TurnBegin` |
| 11 | 2026-11-27 01:22 +03:00 | build-49 immediate `.tmp/k47-*` probes, release and `node .tmp/k5-vscode-ui.mjs capture 202-build49-immediate` | zero completion/audio during work; exactly one `stream_complete(turnIndex=1)` and one `Audio.play` at idle |
| 12 | 2026-11-27 01:23 +03:00 | build-49 `/compact` + follow-up, compaction release, `node .tmp/k47-wait-queued-start.mjs`, final release and `… capture 203-build49-queued` | zero completion/audio through queued `TurnBegin`; exactly one `stream_complete(turnIndex=2)` and one `Audio.play` at idle |

The isolated fake-model launcher required Node's documented `node --experimental-transform-types .tmp/k5-fake-model.mjs` because its TypeScript entry uses parameter properties. The first plain-Node launch failed before the stand started; this was a stand defect, not a product result.

## 4. Checks

Hygiene: 52/52 runtime tests, full extension 664/1, typecheck, root lint, build-49 static audit and entry import smoke pass. Six regressions were added: accepted-before-start, pending accepted, pending blocked, same-turn control, host accepted queued and host blocked. The three red groups above were observed before their corresponding fixes.

Functional run: real packaged guest DOM, bridge events and native `Audio`/`AudioContext` instrumentation were read. WebP images `202-build49-immediate.webp` and `203-build49-queued.webp` were opened and inspected. `Audio.play` is an event-attempt observation, not proof of audible output: synthetic notifications received `NotAllowedError`, while the earlier real Glass control did play to `ended`.

| Case | Status | Observation |
|---|---|---|
| Accepted running result, old terminal before new start | pass | no completion before new start; one final completion |
| Terminal while accepted steering is pending | pass | no intermediate `stream_complete` or `Audio` |
| Terminal while blocked steering is pending | pass | deferred genuine completion is released once as `finished`, not SDK `completed` |
| Same-turn steering control | pass | one completion at genuine idle |
| Host `/compact` completion while queued steering is pending | pass | no host completion/audio before queued `TurnBegin`; one at final idle |
| Host `/compact` completion while blocked steering is pending | pass | completion released without a fabricated `turnIndex` |
| Immediate build 49 | pass | `StepInterrupted → StepBegin → SteerInput → ContentPart(1) → stream_complete(1)`; zero intermediate audio, one final play attempt |
| Queued build 49 | pass | `CompactionEnd → TurnBegin(2) → ContentPart(2) → stream_complete(2)`; zero intermediate audio, one final play attempt |
| Audible speaker output | blocked | synthetic `turnComplete` play attempts reject with `NotAllowedError`; no audible claim |
| Accumulated main profile | not verified | build 49 is installed there but its running Extension Host was not reloaded or observed |

## 5. Found

- Fixed in `bugs/44`: accepted running IDs were registered only on `turn.started`; pending steer requests were invisible to terminal gating; `completeHostAction` emitted unconditionally.
- Separate evidence for `bugs/45`: a transient `internal` / `terminal:false` error with detail `A response is already being generated for this session.` was captured around one session start. Its owning transition is still under investigation and was not suppressed.
- Autoplay rejection is distinct from clipped first-word playback and from completion-event correctness. It is recorded for `bugs/46`, not treated as an audible failure or success.

## 6. Traces

- `apps/vscode/test/session-runtime.test.ts` — six new regressions and same-turn control.
- `apps/vscode/src/runtime/session-runtime.ts` — accepted ID registration, pending/deferred completions and host gating.
- `.tmp/k47-audio-setup.mjs`, `.tmp/k47-event-setup.mjs`, `.tmp/k47-verify-summary.mjs`, `.tmp/k47-wait-queued-start.mjs` — temporary guest instrumentation.
- `.tmp/k5-vscode/model-requests.json` — held main and compaction request states.
- `.tmp/k5-vscode/202-build49-immediate.webp`, `.tmp/k5-vscode/203-build49-queued.webp` — opened and read visual evidence.
- `bugs/44_steer_turn_complete_attention.md`.

## 7. Verdict

partial — the documented isolated immediate and queued event sequences pass on build 49, and all hygiene is green. DONE still waits for the accumulated main-profile boundary and the audible-output caveat to be resolved or explicitly accepted by the owner.
