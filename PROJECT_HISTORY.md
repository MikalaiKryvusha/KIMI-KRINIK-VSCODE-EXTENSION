# KIMI KRINIK — Project History (the chronicle)

> The APPEND-ONLY chronicle of how this project lived and grew: closed sessions, shipped phases,
> releases, big decisions in the order they happened. This is where `STATUS.md` sheds its past —
> STATUS stays a short live summary of NOW; everything finished moves HERE (the "bonsai trim" step
> of `/end-chat-soft`).
>
> **Not required reading.** This file is NOT part of `/resume`'s canon set and not in the
> before-every-task minimum — open it only when you actually need the archaeology: how a decision
> came to be, what an old phase contained, when something shipped.
>
> **Chronicle rules (ADR discipline):**
> - **Append-only, newest on top.** A recorded entry is never edited to say something else —
>   history that can be rewritten is not history. Corrections come as NEW entries that reference
>   and supersede the old one.
> - An entry moves here VERBATIM from `STATUS.md` when its work closes — move, don't rewrite;
>   the entry already carries its dates, counters and file pointers.
> - Entries mention versions and dates freely — a chronicle legitimately speaks of old versions,
>   and the update machinery's stale-claims scan knows to leave this file alone.
> - When the file grows unwieldy, split by era: keep the newest era here, move older ones to
>   `PROJECT_HISTORY_<era>.md` files, and leave a one-line index at the top of this file
>   (the pattern large changelogs use).
>
> Living document — never DONE-tagged.

---

## Entries (newest first)

### 2026-11-24 17:45 +03:00 — previous handover record
⚠️ Force-closed 2026-11-24 17:45 +03:00: ceremonies skipped (judge pass, bonsai trim, README, showcase linters) — the first /skill:end-chat-soft pays this debt. The follow-up test-after-code waiver was also refused by the active closure hook, so the final selector fix and its real-product verification were NOT run in this chat; do not call them done.

UI-CUT: 2026-11-24 14:42 +03:00 — isolated current VSIX accepted: no header percentage, «Панель Управления», «Думаю...», «Запрос...», exact ON/OFF descriptions and VS Code-derived darker queue/todos backgrounds read in DOM and WebP 31–36. Two changesets are written. At the measured 80% boundary no new checks start; final closure begins with full suite 558/1, lint/typecheck/package green and test processes stopped. The main work remains Phase 0 of the chat-pipeline plan.

[OWNER] «а этот чат закрывай, пока работу в KIMI KRINIK откладываем. Много багов» · 2026-11-24 13:05 +03:00 (чат); «тогда работаем внутри KIMI KRINIK, а фиксы - запускай и тестируй в изолированном окружении VS Code» · 2026-11-24 13:06 +03:00 (чат)

Main commit `8ac5df733` is pushed and `mikalai-kryvusha.kimi-code-kaif@1.0.0` is installed in the owner's main VS Code. This chat adds uncommitted UI edits, bug documents and the chat-pipeline research/plans; no steering implementation changed. Current main work is Phase 0 of `plans/01_EPIC_chat_pipeline_reliability.md`.

[AI] FORCE-CLOSED: 2026-11-24 12:48 +03:00 — the window reached 90%; no new task, build, test suite or judge starts. Full suite (556/1), typecheck, lint and judge VERIFIED were completed before the forced closure.

Force-closed debt paid 2026-11-24 14:22 +03:00: judge pass, README/voice checks, status review and showcase linters completed. Fable judge is VERIFIED WITH CAVEATS: scenario-lint is SKIPPED and the independent README semantic recheck was interrupted; no steering implementation is claimed done.

Standing falsehood: ранняя «latest build is NOT installed» → исправлено в `STATUS.md` по выводу владельца: `node .tmp/owner-install.mjs` успешно установил текущий VSIX. Более раннее «Phase 0 production code stays unchanged» относилось только к characterization и не описывает последующий lifecycle-фикс; это разграничено в `bugs/22`. Последний usage suite 4/5 не назван зелёным.

KNOWLEDGE: the optimistic clientId flow and invariants now live in `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`; reusable lifecycle/localization/voice lessons are `EXPERIENCE.md` EXP-0008–0010; KIMI FORK working/queue parity evidence is `researches/55_kimi_fork_working_queue_parity.md`; the remaining two-client and broader lifecycle matrix is `testcases/TC_chat_pipeline_reliability.md`.

1. Execute `plans/02_epic01_characterize_chat_pipeline.md`: turn `bugs/11`–`bugs/16` into red contracts at the existing runtime/store/adapter boundaries. Production code stays unchanged in Phase 0; do not commit the intentionally red suite.
2. Phase 1 then propagates `PromptSubmissionResult` and `promptId` before optimistic UI is implemented. Read `researches/54` and the meta-plan anchors before each step; do not infer a pass from earlier C09/C10 text-only scenarios.
3. After Phases 0–4 pass in isolated VS Code, resume C08, C11–C12 and C18–C23. The isolated startup route is `pnpm --filter kimi-code-kaif test:extension-host --version 1.123.0`; inspect `.tmp/k5-vscode*` before reuse and leave no test process running.
4. For C23 inspect `packages/node-sdk/src/sdk-rpc-client-v2.ts:2572`; read `packages/agent-core-v2/AGENTS.md` before any engine change. Investigate bugs/04 and 05 separately from K2.6.
5. Release/publication remains a separate gated step. Do not decide B9/B10 or publish without the owner's required word.

### 2026-11-24 19:07 +03:00 — build 3 live steering smoke failed; owner-flagged bugs are the current work
- [AI] AUTO STEER OFF text queue insertion passed: three follow-ups became visible queue rows. Lightning on the first row also sent the second (`bugs/20`); after the batch the composer restored the first sent text (`bugs/12`).
- [AI] AUTO STEER ON sent one message twice on one Enter, reproduced on a second message (`bugs/22`); sent text also reappeared in the composer (`bugs/12`). Steering attachments have no visible media (`bugs/13`).
- [AI] The running UI showed threshold labels 70 / 75 / 80 / 90 % and the current ON/OFF descriptions for Auto Compact and Steer. Current `Code.exe` processes started 18:54:42–18:54:48, so build 3 is loaded on the real path; the earlier wait-for-restart instruction is corrected below and in the build-3 report.
- Current work: capture these real-profile observations, write minimal red regressions, fix the confirmed lifecycle boundaries, then run targeted/full hygiene and isolated installed-VSIX functional checks. The earlier isolated queue/lightning pass is not a real-path closure.

### 2026-11-24 18:46 +03:00 — build 3 verified in isolated VS Code and installed on the main-profile disk
- [OWNER] Action Menu shows all three translations with the active interface language first: `Language / Язык / 语言`, `Язык / Language / 语言`, `语言 / Language / Язык`. ZH Control Panel is `控制面板`; the ZH/RU failure toasts were localized too. Contract lives in `ideas/01_language_selection_modal.md`.
  [OWNER] «Да, именно так» · 2026-11-24 18:32 +03:00 (чат)
- Real installed build 3 VSIX: all three labels, `控制面板` and `v1.0.0 (3)` were clicked/read in isolated VS Code 1.123.0; WebP 39 was inspected. Main-profile installed `package.json` reads build 3 and source/installed dist SHA-256 values match. Report: `testcases/reports/2026-11-24_build_3_trilingual_menu.md`.
- Correction 2026-11-24 19:07 +03:00: the main VS Code process has now restarted; current `Code.exe` start times are 18:54:42–18:54:48. The owner is exercising build 3 on the real path. The earlier PID 15080 / restart-pending state no longer applies.
- Hygiene: targeted 57/57, typecheck and root lint green; package/static audit green. Standard Extension Host smoke on build 3 activated the extension, registered 10 commands and opened the webview with host exit 0. Full suite remains 573 passed, 1 skipped, 1 known failure at `usage-status-bar.test.tsx:57`. No push was made for builds 2–3 or the new branch-rule/docs edits.
- NEXT: finish the owner-flagged steering/queue fixes above. The real-profile `v1.0.0 (3)`, active-first trilingual label and `控制面板` smoke remains unread here. Keep `bugs/23` as a separate exact ON/OFF multiline-payload investigation; do not infer payload loss from the intentionally clamped queue preview.

### 2026-11-24 18:13 +03:00 — build 1 installed in the main profile; force-closed
- Action Menu now renders `v1.0.0 (N)`. `apps/vscode/package.json` owns `buildNumber`; every non-dry-run `package:platform` invocation increments it once before building, and the host passes it through `ExtensionConfig`.
- Fresh `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix` is build 1. `code --install-extension ... --force` installed it into the owner's main profile; installed `package.json` reads `buildNumber: 1`, and installed extension/webview SHA-256 values exactly match the new dist files. Post-restart rendering is not yet observed.
- Verification: new targeted tests 26/26, extension + webview typecheck and root lint green; package/static audit green. Full suite: 573 passed, 1 skipped, 1 failed at the previously documented `apps/vscode/test/webview/usage-status-bar.test.tsx:57` parent-selector assertion (`border-t` is on the separator wrapper); not called green.
- 2026-11-24 18:25 +03:00 owner screenshots still show `v1.0.0` and `Русский / English / 中文`. Forensics: main `Code.exe` PID 15080 was created at 17:57:52, before the new installed `webview.js` timestamp 18:11:41; it has no alternate `--extensions-dir`, and its on-disk package is build 1. The main process therefore has not restarted since installation. A full exit of all VS Code windows followed by a new launch is still required; do not claim live acceptance before reading the new UI.
- NEXT: after the full main-process restart, check `v1.0.0 (1)` plus the Language dialog in Action Menu. The next chat first observes that real-profile smoke, then fixes the usage-status-bar selector and reruns the full suite. Generate the build-number changeset before a PR; no release/publication is authorized.
- Pre-existing `.kaif/kaif.json` modification and untracked `.kaif/kimi-refresh.json`, `.vscode-test/`, `Claude_Help_for_Kimi.md`, `KIMI CODE LOGO/GPT ROBOT REFERENCES/` are not part of this change.
- ⚠️ Force-closed 2026-11-24 18:13 +03:00: ceremonies skipped (judge pass, bonsai trim, README, showcase linters) — the first /skill:end-chat-soft pays this debt.
- Standing falsehood: none — the earlier expected-current-UI installation claim was corrected above and in the 17:45 entry.
- KNOWLEDGE: build identity is sourced from the extension manifest and was checked through the installed package and byte-identical dist hashes; the recipe and remaining UI observation are recorded here.

### 2026-11-24 01:48 +03:00 — combined model + effort picker ✅ full hygiene
- `ModelPicker` combines model and effort in one readable button; quick current-provider list, thinking tiers/on/off, cache note, full search, provider filters, keyboard navigation and shared persisted favorites. `InputArea` keeps attachment, permission, behavior/mode buttons, robot, quota, settings and stop/send in place; the old `ThinkingButton` is removed.
- Five component scenarios plus the bridge context-size assertion are green; full suite 519 passed, 1 skipped; typecheck, lint and both builds green. EN/RU/ZH strings, README and third-party attribution updated. Live Second Side Bar layout and interaction remain K5. Report: `testcases/reports/2026-11-24_model_picker.md`.

### 2026-11-24 01:26 +03:00 — permission defaults ✅ real SDK and full hygiene
- Control Panel Auto / Manual / YOLO now persists canonical `defaultPermissionMode`; new chats clear the old session override and use that default, with legacy `kimi.yoloMode` only as fallback. Main model and reasoning effort remain the defaults for new chats and restart; restored sessions keep their own approval metadata.
- Real SDK proof: a second harness reloaded Auto from disk and a fresh session reported `permission: "auto"` despite legacy YOLO true. Red-to-green: 8 new expectations failed before implementation, 114 targeted tests passed after. Full: 514 passed, 1 skipped; typecheck, lint and both builds green. Live VS Code restart remains K5. Report: `testcases/reports/2026-11-24_permission_defaults.md`.

### 2026-11-24 00:33 +03:00 — KAIF Kimi context control ✅ live activation, local diagnostic fix
- Official Kimi Code CLI 2.7.2 created `session_1e622498-786b-45e0-b5f4-af8e0532ec2e`; its real output showed UserPromptSubmit hooks. `--alive` exited 0, `--measure` read the session's real `wire.jsonl` (30,750 of 891,289 = 3%), and `.kaif/context-window.json` recorded the session.
- Added `[loop_control] auto_compact = false` to `C:/Users/krinik/.kimi-code/config.toml`; `kimi doctor config` is green. For autonomous context-controlled work use a NEW chat in official `moonshot-ai.kimi-code`; KIMI KRINIK live acceptance is still pending, and built-in ownership makes the KAIF hook dormant.
- `bugs/KAIF/04` / upstream issue #204: Kimi `--alive` now reports Auto Compact ON and built-in ownership as explicit dormant states instead of falsely claiming that no hooks ran. Selftest covers both and is green. Correction: the previous session's claim that the dispatcher ran no hooks was false; SessionStart had written `.kaif/kimi-refresh.json` at this session's start.

### 2026-11-23 late evening — K1/K2 functionality and brand assets ✅ hygiene, committed
- `80f882851` Control Panel visibility settings, Compact / Steer / Control, independent Context Window Control, KAIF ownership handoff and picker fixes; `a27da7a8c` context ring + live viewer, multiline messages and Working/logo.
- `bugs/01`–`03`: multiline rendering, attachment-toggle outside-click race and stale picker results have red-to-green component/store guards; live Extension Host acceptance is still pending.
- Auto is turquoise, Stop is a filled square; Working uses the acid-pink `#FF1A8C` face with slight top chamfers and clipped ±1 px eye travel. `krinik-robot-logo.svg` + 1024 px PNG are used in all three README sections.
- Independent Context Window Control: no `.kaif` marker or wire file required; settings + four thresholds, SDK status → self-contained `promptWithSkills(..., steerIfActive: true)`, exact boundary/once/re-arm tests. Built-in ownership and vanilla ON both make the KAIF context hook dormant; no dual delivery.

### 2026-11-24 01:04 +03:00 — secondary model ✅ component and persistence guards
- Added `SubagentModelDialog`, robot visibility, `secondaryModel` in the config/store/bridge contracts, and `src/config/secondary-model.ts` atomic validated persistence. Existing-model selection and Follow main model remove the whole old recipe; main model/effort stay untouched (`effortChanged:false`). Custom providers are excluded.
- `apps/vscode/test/secondary-model.test.ts` proves TOML selection and clearing; the robot interaction test now drives open → existing model → Follow main model and asserts both bridge payloads. A targeted `effortChanged` mutation reddened exactly the new scenario. Full verification: 506 passed, 1 skipped; typecheck, lint and both builds green. Live Extension Host acceptance remains pending; do not call this live-accepted. Report: `testcases/reports/2026-11-24_secondary_model_robot.md`.

### 2026-11-23 evening — K1–K4 features (Claude) ✅ hygiene, live run pending
- `365af86cd` Auto Compact and AUTO STEER switches (K2.1/K2.2/K2.4/K2.5/K2.7); `08a22d393` brand KIMI KRINIK (K1.4);
  `bd0f2e569`…`53bda319b` EN / 中文 / RU (K3.1–K3.6); `61fcdd449` dark tooltips and menus (K3.7/K3.8, the owner saw it live);
  `d699642de` changesets; `7ce152c44` Sound Settings window, `kimi.sounds` (K4).
- `c80785857` composer modes: permission Manual / YOLO / Auto, Plan, Goal, Swarm (K1). No live Extension Host run yet.
- `aaf2e75b7` the @ file picker clamps its selection during render: the flaky `useFilePicker` clamp test was a real defect.
- `02a18c159` the three "Windows baseline" failures were test expectations, not product defects (engine paths use `/`;
  the UNC test hit a network lookup). `apps/vscode/test` is fully green on Windows: 469 passed, 1 skipped.

### 2026-11-23 — 1.0.0 RC review, fixes and the KAIF deployment ✅
- `3e9798fee` (KIMI): extension identity `kimi-code-kaif`, automatic steer, quota rings, attention, sidebar background.
- `b42e17e46` (KIMI): engine switch `[loop_control] auto_compact = false` with tests for every automatic path.
- Claude, commits `f340e8821`…`9c8ec6aa1` and the KAIF deployment: review B1–B12 and the `UPD` journal in `Claude_Help_for_Kimi.md`; fixes B1 (CI
  filters, pnpm overrides, `flake.nix`), B2 (attention speaks the real error), B3 (`composerRestore`, retry keeps the prompt),
  B4 (media in flight are not resent or dropped), the lint ratchet of `attention.handler.ts`; KAIF 2.10 for Kimi; the README
  in EN → RU → 中文.
