# Test run report — no transient steering error (bug 45, build 50)

**Created:** 2026-11-27 01:49 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK 1.0.0 build 50, win32-x64 VSIX

## 1. Work

`bugs/45` / issue #31: accepted immediate and queued steering must not display a transient red error. Genuine failures must remain visible with their real text and recovery action. Basis: `plans/05_epic04_phase1_steering_attention.md` §4.3 and the real BridgeHandler entry point.

## 2. Contour

Windows 11, Node 24.15.0, VS Code 1.123.0, packaged build 50 on an isolated profile, testkit held main and compaction models. The main self-hosting window was not reloaded. Guest bridge events, DOM mutations and native audio were captured in the product execution world.

REAL WORLD: accumulated — the owner's main profile has real steering history; data and machine — his Windows machine; path — Second Side Bar immediate/queued steering. The fix was verified on the isolated packaged product with controlled model state, not on the accumulated main profile; DONE is not claimed.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-27 01:40 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/bridge-handler.test.ts -t "ordinary prompt preflight|genuinely idle"` | red before fix: steering during ordinary preflight returned `{ok:false}`; idle control passed |
| 2 | 2026-11-27 01:43 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/bridge-handler.test.ts` | 39/39 pass |
| 3 | 2026-11-27 01:43 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test` and `pnpm lint` | 666 passed / 1 skipped; lint exit 0 |
| 4 | 2026-11-27 01:43 +03:00 | `pnpm --filter kimi-code-kaif run typecheck` and `pnpm --filter kimi-code-kaif package:platform --target win32-x64` | typecheck 0; build 50 packaged and statically audited |
| 5 | 2026-11-27 01:46 +03:00 | build-50 immediate `.tmp/k47-*` guest probes and release | no error event/frame during or after steering; one final completion |
| 6 | 2026-11-27 01:46 +03:00 | build-50 `/compact` + follow-up, compaction/final releases and `… capture 204-build50-steering-no-error` | no error event/frame through queued start or final idle |
| 7 | 2026-11-27 01:48 +03:00 | new conversation + `/compact` on empty history and `… capture 205-build50-genuine-error` | genuine `compaction.unable` remains visible with Retry and real Glass playback |

## 4. Checks

Hygiene: 39/39 bridge-handler tests, full extension 666/1, typecheck, root lint and build-50 package audit pass. The new regression was red before the change and now passes; the genuinely idle control remains `{ok:false}`.

Functional run: immediate and accepted queued build-50 sequences produced zero error events and zero red DOM frames. The genuine empty-history `/compact` error remained inline with `No messages to compact in current history.` and `Retry`; WebP 204/205 were opened and inspected.

| Case | Status | Observation |
|---|---|---|
| Ordinary prompt in preflight followed by steering | pass | handler waits for `runtime.prompt` to establish busy state, then accepts steering |
| Genuinely idle steering | pass | `{ok:false}` preserved |
| Immediate accepted steering | pass | no transient `internal` or other error |
| Accepted queued steering during `/compact` | pass | no transient error through queued start or final idle |
| Genuine failure control | pass | persistent `compaction.unable` with real detail and Retry |
| Accumulated main profile | not verified | build 50 is installed there; running main Extension Host was not reloaded |

## 5. Found

- Fixed `bugs/45`: an ordinary `streamChat` was still in preflight, `steerChat` saw `isBusy=false` and returned `{ok:false}`, then the fallback collided with the original prompt and emitted `internal`, `terminal:false`, `A response is already being generated for this session.` The handler now waits for the original turn; no error rendering was suppressed.
- Remaining: accumulated main-profile acceptance is not verified, so `bugs/45` is not DONE.

## 6. Traces

- `apps/vscode/test/bridge-handler.test.ts` — preflight regression and idle control.
- `apps/vscode/src/handlers/chat.handler.ts` — per-view preflight tracking and readiness handoff.
- `.tmp/k5-vscode/user/logs/20261127T010618/window1/exthost/output_logging_20261127T010619/1-KIMI KRINIK.log` — original `id=71`, early `steerChat id=73`, fallback `id=74` evidence.
- `.tmp/k5-vscode/204-build50-steering-no-error.webp`, `.tmp/k5-vscode/205-build50-genuine-error.webp`.
- `bugs/45_steer_transient_error_flash.md`.

## 7. Verdict

partial — the isolated accepted immediate/queued and genuine-failure paths pass with all hygiene green. Accumulated main-profile acceptance remains open.
