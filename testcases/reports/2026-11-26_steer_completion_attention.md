# Test run report — completion attention only at actual idle (bug 44)

**Created:** 2026-11-26 20:05 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK 1.0.0 build 46, win32-x64 VSIX

## 1. Work

`bugs/44` / KIMI KRINIK issue #1: accepted immediate and queued steering must not emit completion attention while work continues. Only the final idle waiting-for-input boundary may emit it. Basis: the owner's completion contract and the public `SessionRuntime` event stream.

## 2. Contour

Windows 11, Node 24.15.0, Vitest/jsdom, VS Code 1.123.0, packaged build 46 installed on main and isolated profiles, testkit fake model. Runtime regressions cover two active turns and a queued accepted steer.

REAL WORLD: accumulated — main profile and existing isolated fake-model configuration; data and machine — the owner's Windows machine and real session lifecycle; path — public runtime events and packaged Extension Host. Real state was used where available; guest-DOM steering was not observed and is not claimed.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-26 19:28 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts -t "suppresses completion"` | red before fix: both cases emit completion while the next turn/queued steer remains |
| 2 | 2026-11-26 19:29 +03:00 | same targeted command after `activeTurnIds` gating | 2/2 pass |
| 3 | 2026-11-26 19:30 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts apps/vscode/test/event-adapter.test.ts apps/vscode/test/webview/chat-store.test.ts apps/vscode/test/webview/attention.test.ts apps/vscode/test/webview/sounds.test.ts` | 121/121 pass |
| 4 | 2026-11-26 19:31 +03:00 | `pnpm --filter kimi-code-kaif run typecheck` and `pnpm exec vitest run --reporter=agent apps/vscode/test` | typecheck 0; 658 passed / 1 skipped |
| 5 | 2026-11-26 19:34 +03:00 | `pnpm --filter kimi-code-kaif package:platform --target win32-x64` and `… package:verify --target win32-x64` | build 46 packaged and audited, entry import smoke passes |
| 6 | 2026-11-26 19:34 +03:00 | `code --install-extension apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix --force` (main and isolated paths) and `pnpm --filter kimi-code-kaif test:extension-host --version 1.123.0` | build 46 installed; Extension Host smoke passes with webview opened |
| 7 | 2026-11-26 20:05 +03:00 | guest-DOM steering probes (`.tmp/k46-*`) | blocked: CDP exposes only the outer guest target, with no composer in the accessible DOM; no product verdict inferred |

## 4. Checks

Hygiene: targeted 121/121, full extension 658/1, typecheck, root lint, VSIX static audit and Extension Host smoke pass. The two new regressions were red before the fix.

Functional run: the packaged build opened and installed on both profiles. The intended steering/audio sequence was not observed because the accessible guest DOM did not expose the composer. No completion-audio observation is claimed.

| Case | Status | Observation |
|---|---|---|
| Immediate steer, original turn ends while next is active | pass | No `stream_complete` until the second turn is idle |
| Accepted queued steer waits for its turn | pass | No `stream_complete` until the queued turn starts and finishes |
| Ordinary single-turn completion | pass | Existing completion behavior remains |
| Full extension and typecheck | pass | 658/1, typecheck 0, lint 0 |
| Packaged Extension Host | pass | Build 46 installs and webview opens on VS Code 1.123.0 |
| Real steering/audio sequence | blocked | Guest target exposes no composer in accessible DOM; a fresh session/harness must finish this acceptance |

## 5. Found

- `bugs/44_steer_turn_complete_attention.md` — premature terminal completion was emitted for each turn without considering subsequent active turns. Candidate fix is committed for further live acceptance, not DONE.
- Harness-only limitation: `page.frames()`, direct guest attachment, `Runtime.evaluate` and `DOM.getDocument` did not expose the composer. No product failure is inferred from this tooling limitation.

## 6. Traces

- `apps/vscode/test/session-runtime.test.ts` — immediate and queued steering regressions
- `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix`
- `bugs/44_steer_turn_complete_attention.md`

## 7. Verdict

partial — the mechanism and packaged installation pass their checks; real guest-DOM steering/audio acceptance remains open.
