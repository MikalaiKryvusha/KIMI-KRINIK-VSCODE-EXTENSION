# Test run report — context blocked retry and accepted queue (Phase 2 partial)

**Created:** 2026-11-27 02:45 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK 1.0.0 build 53, win32-x64 VSIX

## 1. Work

Close two Act findings: `context-blocked-retry#F1` and `queue-accepted-resubmission#F1`. Basis: their audit cards and `plans/06_DONE_epic04_phase2_act_findings.md` §4.1–4.2. The other three Act findings remain open.

## 2. Contour

Windows 11, Node 24.15.0, VS Code 1.123.0, Vitest public runtime/store boundaries, packaged build 53 installed on main and isolated profiles. Main was not reloaded.

REAL WORLD: accumulated — the owner's main profile and existing sessions; data and machine — his Windows machine; path — Context Window Control and queued steering. The fixes were verified through public runtime/store regressions and packaged installation, not through new accumulated-main or packaged guest acceptance. Functional packaged checks remain open.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-27 02:37 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts -t "retries Context Window Control"` | red before fix: two identical blocked force observations produced one submission |
| 2 | 2026-11-27 02:39 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts apps/vscode/test/context-window-control.test.ts` | 60/60 pass: blocked retries and later accepted commit pass |
| 2b | 2026-11-27 03:11 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts apps/vscode/test/context-window-control.test.ts apps/vscode/test/webview/status-pills.test.tsx` | 76/76 pass: the fourth observation drains to the next macrotask before asserting exactly three submissions |
| 3 | 2026-11-27 02:41 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/status-pills.test.tsx -t "accepted queued steer is not resent"` | red before fix: previous completion caused a second `streamChat` for Q1 |
| 4 | 2026-11-27 02:45 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/status-pills.test.tsx` | 16/16 pass: accepted Q1 is not resent; durable `TurnBegin` removes it |
| 4b | 2026-11-27 02:58 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/status-pills.test.tsx -t "drains later queued items"` | red before helper fix: accepted Q1 was selected again and Q3 was stranded |
| 4c | 2026-11-27 02:59 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/status-pills.test.tsx` | 16/16 pass: Q2 is sent and Q3 drains after the accepted prefix |
| 5 | 2026-11-27 02:45 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test` and `pnpm lint` | 670 passed / 1 skipped; lint exit 0 |
| 6 | 2026-11-27 02:45 +03:00 | `pnpm --filter kimi-code-kaif run typecheck` and `pnpm --filter kimi-code-kaif package:platform --target win32-x64` | typecheck 0; build 53 packaged and audited |
| 7 | 2026-11-27 03:07 +03:00 | `pnpm --filter kimi-code-kaif test:extension-host --version 1.123.0` | extension activates, 10 commands registered, webview opens; exit 0 |

## 4. Checks

Hygiene: 60/60 runtime+controller, 16/16 status pills, full extension 670/1, typecheck, root lint, build-52 static audit and Extension Host smoke pass. Both regressions were red before their fixes.

Functional run: no new guest scenario was executed for these two changes. Public runtime and real store probes establish the mechanisms; packaged functional acceptance is explicitly pending.

| Case | Status | Observation |
|---|---|---|
| Two identical blocked force observations | pass | two submissions; later accepted running produces the third and commits once |
| Accepted Q1 followed by previous completion | pass | no second `streamChat` for Q1 |
| Durable Q1 start | pass | visible accepted Q1 is removed from the queue |
| Accepted Q1 followed by Q2/Q3 | pass | Q2 is selected and Q3 drains through `QueueBatchReady`; accepted prefix is not reselected |
| Rejected/blocked restoration and batch controls | pass | existing status-pills suite remains green |
| Packaged functional acceptance and accumulated main | not verified | explicit remaining work |

## 5. Found

- Fixed `context-blocked-retry#F1`: `said` is committed only for accepted `running | queued`; blocked no longer suppresses later retries.
- Fixed `queue-accepted-resubmission#F1`: accepted items stay visible with `accepted:true` but are excluded from automatic selection and repeat lightning; durable `TurnBegin` removes them. The batch helper applies the same selector, so an accepted prefix cannot strand Q2/Q3.
- Open: `secondary-primary-default`, `sound-default-manifest`, `model-picker-enter-bubbling`, plus packaged acceptance for both fixed mechanisms.

## 6. Traces

- `apps/vscode/test/session-runtime.test.ts` — `retries Context Window Control after a blocked submission`.
- `apps/vscode/test/webview/status-pills.test.tsx` — `accepted queued steer is not resent when the previous turn completes first`.
- `apps/vscode/src/runtime/context-window-control.ts`, `session-runtime.ts`, `webview-ui/src/stores/chat.store.ts`, `components/QueuedMessagesPanel.tsx`.
- `plans/06_DONE_epic04_phase2_act_findings.md`.

## 7. Verdict

partial — the two mechanisms and all hygiene pass. Packaged guest and accumulated-main acceptance, plus the remaining three Act findings, are open.
