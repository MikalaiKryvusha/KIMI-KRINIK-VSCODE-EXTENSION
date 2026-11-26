# Test run report — same-turn completion recovery (bug 44, build 51)

**Created:** 2026-11-27 02:27 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK 1.0.0 build 51, win32-x64 VSIX

## 1. Work

Close the independent skeptic's `bugs/44` finding: an accepted running result and a deferred terminal can belong to the same turn. Clearing the deferral without re-arming terminal deduplication lost genuine completion. Basis: `plans/05_epic04_phase1_steering_attention.md`, the public `SessionRuntime` and the same-turn owner contract.

## 2. Contour

Windows 11, Node 24.15.0, VS Code 1.123.0, packaged build 51 on an isolated profile, testkit held main and compaction models. Main was not reloaded. Guest bridge and native audio were captured in the product execution world.

REAL WORLD: accumulated — the owner's main profile and existing sessions; data and machine — his Windows machine; path — immediate/queued steering and `/compact`. The same-turn recovery was verified at the public runtime boundary and build-51 immediate/queued sequences on the isolated product, not on the accumulated main profile; DONE is not claimed.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-27 02:21 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts -t "later same-turn terminal"` | red before fix: deferred terminal was cleared and the later same-turn terminal was suppressed by dedup, yielding zero completions |
| 2 | 2026-11-27 02:21 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts` | 53/53 pass after re-arming only the deferred terminal's dedup key |
| 3 | 2026-11-27 02:22 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test` and `pnpm lint` | 667 passed / 1 skipped; lint exit 0 |
| 4 | 2026-11-27 02:22 +03:00 | `pnpm --filter kimi-code-kaif run typecheck` and `pnpm --filter kimi-code-kaif package:platform --target win32-x64` | typecheck 0; build 51 packaged and audited |
| 5 | 2026-11-27 02:25 +03:00 | build-51 immediate `.tmp/k47-*` guest probes and releases | no intermediate completion/audio; one final `stream_complete(1)` and play attempt |
| 6 | 2026-11-27 02:27 +03:00 | build-51 `/compact` + follow-up, compaction/final releases | no completion/audio before queued `TurnBegin(2)`; one final `stream_complete(2)` and play attempt |
| 7 | 2026-11-27 02:20 +03:00 | actual RU Preview second click and `node .tmp/k47-wait-audio-end.mjs` | RU warmed-second playback also ends at 2.4225 s |

## 4. Checks

Hygiene: 53/53 runtime tests, full extension 667/1, typecheck, root lint and build-51 static audit pass. The new same-turn regression was red before the fix and now passes.

Functional run: build-51 immediate and accepted-queued paths both produced zero completion/audio while work remained and exactly one at genuine idle. No error events occurred. RU first and warmed-second previews both start at zero and end at 2.4225 s.

| Case | Status | Observation |
|---|---|---|
| Deferred terminal and accepted result share one turn | pass | later same-turn terminal produces exactly one completion |
| Other terminal deduplication | pass | only the deferred key is re-armed |
| Immediate build 51 | pass | one final completion and play attempt |
| Accepted queued build 51 | pass | no host completion before queued start; one final completion |
| RU warmed-second preview | pass | starts at zero and ends at source duration |
| Accumulated main profile and audible output | not verified | explicit remaining boundary, not inferred |

## 5. Found

- Fixed the skeptic's same-turn finding: accepted running registration now re-arms dedup only when that exact terminal was deferred by the current steering request. A later genuine terminal is no longer swallowed.
- No weakening or error suppression was added. Other terminal keys remain deduplicated.
- The missing RU warmed-second observation was performed; the checklist now matches the evidence. Audible output and accumulated main remain open.

## 6. Traces

- `apps/vscode/test/session-runtime.test.ts` — `allows a later same-turn terminal after acceptance to complete`.
- `apps/vscode/src/runtime/session-runtime.ts` — conditional deferred-key re-arm.
- `.tmp/k47-verify-summary.mjs` and `.tmp/k47-wait-audio-end.mjs` — build-51 sequence and RU warmed evidence.
- `testcases/reports/2026-11-27_steer_completion_attention_build49.md`, `2026-11-27_steer_transient_error_build50.md`, `2026-11-27_attention_audio_first_play.md`.

## 7. Verdict

partial — the independent lifecycle finding and the RU evidence gap are closed with all hygiene green and build-51 immediate/queued observations. Accumulated main-profile and audible-output acceptance remain open.
