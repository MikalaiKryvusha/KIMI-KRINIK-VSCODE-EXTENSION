# Test run report — Epic 04 Phase 2: five Act findings and packaged acceptance

**Created:** 2026-11-27 11:13 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK 1.0.0 builds 53–55, final win32-x64 build 55

## 1. Work

Close Epic 04 Phase 2: `context-blocked-retry`, `queue-accepted-resubmission`, `secondary-primary-default`, `sound-default-manifest` and `model-picker-enter-bubbling`. Basis: `plans/04_EPIC_release_blocker_remediation.md` Phase 2, `plans/06_DONE_epic04_phase2_act_findings.md`, the five audit cards and their red-before public regressions. Phase 2 exit requires green affected suites and observations on packaged paths.

## 2. Contour

Windows 11, Node 24.15.0, VS Code 1.123.0, Vitest public runtime/store/handler/component boundaries and real packaged win32-x64 VSIX installations. Fresh Extension Host covers sound defaults. The isolated CDP profile covers real keyboard, context, queue and secondary paths with a fake provider. Context blocking uses an isolated `UserPromptSubmit` hook that blocks only the control prompt twice. Accepted queued uses manual compaction quiescence. Secondary uses distinct session A, global B and secondary S.

REAL WORLD: accumulated — the owner's main profile, saved settings and sessions; data and machine — his Windows machine; path — installed KIMI KRINIK extension. Build 55 is installed on main and isolated with matching source/installed extension and webview hashes. The running main Extension Host was not reloaded, so accumulated-main behavior remains a later release gate and no production DONE is claimed here.

## 3. Runs

| # | Moment | Command / user path | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-27 02:37–03:11 +03:00 | Public runtime/controller and status-pills regressions from `testcases/reports/2026-11-27_phase2_context_queue.md` | red before both fixes; 76/76 targeted, full 670/1, typecheck/lint/build-53 audit and host smoke green |
| 2 | 2026-11-27 09:23–09:27 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/bridge-handler.test.ts apps/vscode/test/webview/control-panel-settings.test.tsx` | two secondary-only checks red before fix; 73/73 green afterward, typecheck/lint pass |
| 3 | 2026-11-27 09:39–09:44 +03:00 | Manifest/shared Vitest plus fresh packaged Extension Host on builds 53/54 | build 53 red Voice/Voice/Voice/Off; build 54 prints Glass/Voice/Alert/Chime; affected 69/69 and package audit green |
| 4 | 2026-11-27 09:52–10:08 +03:00 | Model-picker keyboard Vitest, full `apps/vscode/test`, typecheck, lint and build-55 audit | favorite/provider red before fix; model picker 11/11, full 676/1, typecheck/lint and VSIX audit green |
| 5 | 2026-11-27 09:59–10:03 +03:00 | Real build-55 model picker: favorite Enter, provider Enter, search + ArrowDown + Enter | only native favorite/filter actions; current/dialog unchanged; ordinary active-row selection preserved |
| 6 | 2026-11-27 10:38–10:41 +03:00 | Positive smoke → `/clear` → `/import large-context.md` (810,000 chars) → seed prompts with the first two control submissions blocked | durable wire records exactly two blocked control completions, then one completed accepted control; later ordinary seed adds no new control submission |
| 7 | 2026-11-27 10:55–10:59 +03:00 | Seed turn → held manual `/compact` → OFF queue Q1 → lightning → compaction release → Q1 release | accepted Q1 stays visible with no lightning; final provider count is exactly three (seed + compaction + Q1), Q1 occurs once, durable start removes queue |
| 8 | 2026-11-27 11:03–11:12 +03:00 | Create global B in another session → resume A=`testkit-model` → select secondary S=`kimi-code/k3` → fresh isolated restart | A and effort max stay unchanged during save; global B remains `kimi-code/kimi-for-coding`; S persists; fresh initialization displays K2.8 Preview |
| 9 | 2026-11-27 10:05:54 +03:00 | `pnpm --filter kimi-code-kaif test:extension-host --version 1.123.0` | build-55 fresh host opens webview, registers 10 commands and retains correct sound defaults |

Harness-only corrections were observed and excluded from product verdicts: fake model requires `node --experimental-transform-types`; CDP `browser.close()` did not close the accumulated isolated VS Code process, so actual `Ctrl+Shift+W` was used and the old PID disappearance was checked; read-only tools do not pause in manual mode; manual compaction needs an existing turn. No product code was changed for these stand findings.

## 4. Checks

Hygiene: every finding has a named red-before regression. Final full extension is 49 files, 676 passed / 1 skipped; extension/webview typecheck, root lint, build-55 static/package audit, entry import smoke and fresh Extension Host smoke pass. Existing queue restoration, saved sound choices, deliberate primary saves, mouse/search/Arrow controls and genuine errors remain covered.

Functional run: PASS for all five scoped packaged mechanisms. Real build-55 keyboard actions were read from DOM and a WebP screenshot. Context durable wire contains blocked/blocked/completed for three control submissions and no accepted resend. Queue guest shows accepted Q1 until durable start and exactly one Q1 provider submission after previous completion. Secondary guest preserves resumed A/global B/thinking and starts fresh on B. Build-54 fresh host supplies Glass/Voice/Alert/Chime.

| Case | Status | Observation |
|---|---|---|
| Context blocked retry | pass | two `reason:"blocked"`, one subsequent `reason:"completed"`; no post-acceptance resend |
| Accepted queued resubmission | pass | one Q1 request after compaction completion; accepted row visible, lightning hidden, durable queue removal |
| Secondary-only primary default | pass | resumed A/testkit + effort max unchanged; global B and S persisted; fresh restart shows B |
| Fresh sound defaults | pass | build-54 real configuration API returns Glass/Voice/Alert/Chime |
| Model-picker Enter | pass | favorite/provider only native actions; search/list selection control remains |
| Final artifact integrity | pass | build-55 source/main/isolated hashes match |
| Accumulated running main | not verified | no main reload by R7; later release gate |

## 5. Found

none within the scoped Phase 2 mechanisms after the packaged runs. The earlier stand defects were corrected as stand defects, not hidden as product passes. `bugs/25`/`bugs/11`, accumulated-main acceptance and final release hardening remain outside this Phase 2 verdict.

## 6. Traces

- `testcases/reports/2026-11-27_phase2_context_queue.md`
- `testcases/reports/2026-11-27_phase2_secondary_primary.md`
- `testcases/reports/2026-11-27_phase2_sound_defaults.md`
- `testcases/reports/2026-11-27_phase2_model_picker.md`
- `.tmp/k5-vscode/phase2-guest-summary.json` — derived blocked/completed IDs, hook counts, exactly-once Q1 and selected secondary/default fields
- `.tmp/k5-vscode/context-hook-log.jsonl` and session `session_4143f2fd-671d-4714-92c8-a264565e4faf` durable wire
- `.tmp/k5-vscode/55-accepted-queue-final.webp` and `.tmp/k5-vscode/55-provider-enter.webp` — opened and read
- `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix` — build 55

## 7. Verdict

pass — Epic 04 Phase 2's five mechanisms and packaged-path exit gate are satisfied on builds 54/55 with red-before regressions and final full hygiene. Accumulated running-main acceptance remains an explicit later gate; this report does not authorize release or publication.

[TESTED: 2026-11-27 · real packaged fresh-host, keyboard, blocked-context, accepted-queue and secondary-only paths; evidence above]
