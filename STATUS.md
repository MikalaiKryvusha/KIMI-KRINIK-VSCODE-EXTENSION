# KIMI KRINIK — Current Status

> This file is read by the AI agent before every task. Update it on every significant change of state.
> It is the PRIMARY handoff between sessions: a new agent session starts with empty context and must be
> able to get productive from this file alone. Write accordingly — concrete, with file paths and commands.
> 🧠 Prime thinking principle — `PHILOSOPHY.md` (SIMPLICITY: KISS + Occam). Read your working framework
> in `AGENT_GUIDE.md`.
>
> ⚠️ **STATUS is a SUMMARY of NOW, not a chronicle.** A status file that only ever grows turns into
> the project's history book, and the agent that came for a quick "where are we" drowns in it
> (field: a 2 300-line STATUS — "an abyss, not a summary"). The rules that keep it a summary:
>
> - **Every line passes two tests:** *"if I remove this line, will the next agent make a mistake?"*
>   and *"does a newcomer still read the whole file in one sitting?"* Soft target: **~200 lines**
>   (one-two screens of substance) — the guard is a warning, not a wall, but crossing it means a
>   trim is overdue.
> - **Closed work is MOVED OUT, not accumulated:** when a phase/session's entry is no longer "now",
>   move it VERBATIM into `PROJECT_HISTORY.md` (the chronicle — that is what it is for).
>   `/end-chat-soft` carries a "bonsai trim" step for exactly this (`/pause` stays ceremony-free by design).
> - **Leave the file the way you'd want to find it:** fresh summary of what works, what's in
>   progress, what's next, the pitfalls, and WHERE TO LOOK for the details (plans, bugs, history) —
>   pointers, not retellings.

---

### 2026-11-25 10:50 +03:00 — CLOSING to full-work build 14 and a fresh chat
- [OWNER] «давай билд 14 установим, и этот чат закроем с передачей дел в новый чат… я буду знать, что Контроль работает» · 2026-11-25 10:48 +03:00 (чат). This chat fixed and packaged the Context Window Control delivery defect, produced full-work build 14, verified it twice in isolated VS Code, and filed the test-debt false positive as KAIF #206. Main-profile build-14 installation is the remaining action before farewell.
- [OWNER] «ты только что писал ответ, а затем он исчез - похоже на баг», «вероятно, стиринг сообщения пользователя могут как-то "ломать" ответы КИМИ в чате» · 2026-11-25 10:48 +03:00 (чат). Recorded in `bugs/11`: assistant-entry stability after steering is now an explicit acceptance requirement; cause is unproven. Next chat must compare DOM removals with steer/turn/replay events before editing the store.
- KNOWLEDGE: the fixed control delivery path is `session.steer()` in `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`; adapter-boundary lesson is `EXPERIENCE.md` EXP-0015; the new steering symptom is in `bugs/11`; full run evidence is `testcases/reports/2026-11-25_context_window_steer_delivery.md`; old completed 04:27–05:09 entries moved verbatim to `PROJECT_HISTORY.md`.

### 2026-11-25 10:25 +03:00 — owner ordered full-work build 14; packaged and live-verified
- [OWNER] «Собери билд 14 СО ВСЕМИ НАРАБОТКАМИ ЗА ВЧЕРА и С СЕГОДНЯШНИМ ФИКСОМ КОНТРОЛЯ!!!!» · 2026-11-25 10:18 +03:00 (чат). Build 14 contains all current main-tree work through post-build-19 plus the bug-28 `session.steer()` fix; it supersedes minimal build 13 as the recommended artifact.
- Six-target VSIX static audit, 598 passed / 1 skipped, typecheck and root lint are green. Fresh isolated VS Code installed manifest 14 and delivered the 80% soft-closure prompt at 84% through the real active-turn provider path, with no controller errors. Artifact: `apps/vscode/artifacts/vsix/kimi-code-win32-x64-build14.vsix`; SHA-256 `a0813b1072b2e90e671438675877ad0a21d40769b7af8bfef3a6f00ca4c8e3cc`. Report updated: `testcases/reports/2026-11-25_context_window_steer_delivery.md`.
- The main profile is still on build 12 and has not been modified. Next acceptance is build 14 installation, a full VS Code restart and a fresh chat; `bugs/28` stays 🔧 until that accumulated-profile observation.
- Follow-up runs at 10:32–10:38 repeated extension 598 / compaction 123 / OAuth 44 and the build-14 functional path, all green. `test-after-code` still falsely reported 162 files as not run because its direct-interpreter heuristic does not recognize Vitest; `bugs/KAIF/05` / upstream #206 filed with `cleared: []` reproduction. At 10:46 the hook's own waiver recorded that direct standalone execution is invalid for these TS/Vitest modules and historical scratch harnesses; `test debt: none`. No manual state edit.

### 2026-11-25 10:07 +03:00 — bug 28 fixed on isolated build 13; main profile still on build 12
- [OWNER] «Я нашел тебя утром с на 100% щзаполненным окном контекста чата.... Не сработала фича контроля. Баг в core функционале.» · 2026-11-25 09:28 +03:00 (чат). The real wire had no control prompt: build 12 called the skills-only API with an empty skill list, which the engine rejects. KAIF was intentionally dormant under built-in ownership, not a second active guard.
- The runtime now uses public `session.steer()`. Both regressions were red before and green after; main has 598 passed / 1 skipped, typecheck and lint green. Packaged builds 20 and 13 each delivered the 80% soft-closure prompt at 84% through a real active-turn provider request in isolated VS Code. Report: `testcases/reports/2026-11-25_context_window_steer_delivery.md`.
- Owner-requested minimal artifact: `apps/vscode/artifacts/vsix/kimi-code-win32-x64-build13.vsix` = build 12 + only this fix and build number 13; SHA-256 `7610a4c6d2251a272046f3cb4036ed58a4e5e15fa401a0e2c9a428a5e67abbb1`. It is not installed on the main profile; the current loaded build 12 remains unprotected until a full VS Code restart with the fixed VSIX.
- Build-13 caveats: its inherited build-12 `usage-status-bar` assertion remains red (587 passed, 1 skipped, 1 failed), and its nested-worktree lint stops only at `jsPlugins` ordering after clean oxlint. No unrelated source, test or baseline was changed. `bugs/28` stays 🔧 pending accumulated main-profile acceptance.

### 2026-11-25 05:15 +03:00 — held first prompt also stable on build 19
- A delayed first prompt produced no assistant removals and final `K23 multiline response` remained visible; `.tmp/k5-vscode/60-k25-delayed-first.webp` was read. Original main-profile variant remains the only unobserved path, so `bugs/25` stays 🔧.

### 2026-11-25 04:18 +03:00 — full isolated media matrix passes
- ON image-only delivered one PNG with zero text; OFF video-only queued and delivered one MP4 with zero text. Thumbnail/viewer and replayed video use identical URIs. `bugs/13` and `bugs/14` now have image/video, text+media and media-only evidence.
- Only accumulated main-profile acceptance remains for both. Report: `testcases/reports/2026-11-25_media_only_video.md`.

### 2026-11-25 04:08 +03:00 — isolated PNG delivery closed for ON/OFF queue and replay
- `bugs/13`: ON steering raw request carried exactly one PNG; thumbnail/viewer matched before and after replay. `bugs/14`: OFF immediately showed text + «+ медиа» and dequeue carried exactly one PNG. Replay restored two entries/two thumbnails for two sends.
- Video-only and accumulated main-profile paths remain unverified; both bugs stay 🔧. Report: `testcases/reports/2026-11-25_media_queue_steer.md`.

### 2026-11-25 03:58 +03:00 — status correction: isolated evidence is not main-profile DONE
- Corrected premature DONE tags for `bugs/16`, `bugs/18` and `bugs/19`; all three are 🔧 isolated-verified with their original main-profile paths pending. Their scoped run reports remain valid, while completion claims and filenames were corrected everywhere they stood.
- `bugs/23` stays DONE as a research-only payload-integrity question; `bugs/05` stays DONE as a harness defect. Production chat fixes require the accumulated-profile acceptance boundary.

### 2026-11-25 03:51 +03:00 — active-response user sends verified on isolated build 19; main profile pending
- 106 runtime/settings/chat-store contracts pass. Current isolated ON steering, OFF queue/dequeue and running→idle batch paths show no `Internal error occurred.`; direct invalid reentrant prompt remains guarded and the first turn continues.
- Historical owner log is preserved in `bugs/18_reentrant_prompt_internal_error.md`; official extension unchanged. Report: `testcases/reports/2026-11-25_reentrant_send_contract.md`.

### 2026-11-25 03:45 +03:00 — Windows compaction harness repaired; bugs/05 DONE
- `bugs/04`: real Windows temp paths now select win32 path mapping and host-native expected resolution; cwd/listing case passes. Linux row remains unrun because WSL is not installed and Docker is unavailable, so bug 04 stays open.
- `bugs/05`: both hooks were already invoked; unquoted Node path under Program Files emptied the logger output. Quoting executable/script produced ordered PreCompact/PostCompact payloads. DONE.
- Full compaction 123/123, agent-core typecheck and root lint green. No production source changed. Report: `testcases/reports/2026-11-25_windows_compaction_harness.md`.

### 2026-11-25 03:26 +03:00 — steering avatar/user order verified on isolated build 19; main profile pending
- Immediate, two-consecutive and replayed steering on isolated build 19 preserve base → steer one → steer two → assistant response. Clean replay offsets were 14/61/71/87 with no avatar inversion, error or Retry; three WebP frames were read.
- Report: `testcases/reports/2026-11-25_steer_avatar_order.md`. Current lifecycle already had the fix; no product change was needed.

### 2026-11-25 03:11 +03:00 — tool-card Working state verified on isolated build 19; main profile pending
- Isolated build 19 showed «Работаю…» below ReadFile while the next model step was held, within visible bounds. It disappeared on genuine completion and stayed absent after history replay. No additional product change was needed.
- Report: `testcases/reports/2026-11-25_tool_working_build_19.md`. Two-client replay remains in the broader lifecycle matrix.

### 2026-11-25 02:58 +03:00 — multiline queue/Steer integrity confirmed; bugs/23 DONE
- Exact owner sample passed AUTO STEER OFF queue/dequeue and ON running-turn Steer on isolated build 19. Both provider bodies matched the UTF-8 source including the blank line; final bubbles retained it. Only the intentional queue preview is compact; no product change was needed.
- Report: `testcases/reports/2026-11-25_multiline_queue_steer.md`. `ideas/01` was also tagged DONE in this backlog revision; other partial bugs remain open.

### 2026-11-25 02:37 +03:00 — extension suite and root lint fully green
- Corrected the `usage-status-bar` test to read the actual separator wrapper rather than the label's immediate parent; product behavior was already correct.
- Full extension: 48 files, 597 passed, 1 skipped, 0 failed. `pnpm lint` exits 0. Historical reports retain their earlier counts/failures; current state has no accepted test failure.

### 2026-11-25 02:29 +03:00 — deleted non-KAIF skill references cleaned; root lint green
- Removed repository-workflow references to deleted `write-tui`, `gen-docs`, `gen-changesets`, `review-pr`, `sync-changelog` and local `use-kimi-code` artifacts from AGENTS/PR/docs paths. Other-agent guides now point to the running KAP guide instead of an installed skill.
- Kept public engine documentation for generic `~/.agents/skills` directories: that is supported product behavior, not a deleted repository-owned skill.
- `pnpm lint` exits 0 (12 AGENTS files, 173 references resolve); `pnpm run build` in `docs/` completes for EN/ZH. No generated docs output entered the diff.

### 2026-11-25 02:14 +03:00 — replay flicker reproduced and fixed on isolated build 19
- `bugs/25`: build-18 session replay showed one zero-assistant/response-absent frame (~21 ms). Reset, history events and completion marking now use one state transaction; live attention/queue wrappers do not run for replay.
- Regression was red before the fix; 65 affected checks, typecheck and VSIX audit pass. Build-19 real history navigation stayed at one assistant container on every frame and ended with the restored response. Original main-profile first-prompt route remains open; isolated instant first prompt did not reproduce it.
- Report: `testcases/reports/2026-11-25_atomic_replay_build_19.md`. NEXT: non-KAIF reference cleanup/root lint, then the known usage selector; main-profile acceptance of builds 17–19 remains pending.

### 2026-11-25 01:43 +03:00 — owner UI findings verified on isolated build 18
- Context ring interpolates blue→yellow at 60–70% and yellow→red-orange at 70–80%, retaining endpoints outside the range. Exact 60/65/70/75/80% checks pass; the live low-usage ring is blue.
- `bugs/26`: sound selector stays editable with per-event Off and global Sound OFF. Live RU cycle Off → Glass re-enabled volume; main-profile acceptance pending.
- `bugs/27`: explicit MAX/XHigh choices now persist above the model's delivered default. Isolated MAX survived a full VS Code restart, compact RU showed МАКС, the menu showed full words, and the real request body carried `thinking.effort="max"`. EN/RU/ZH label cases pass; main-profile acceptance pending.
- Queue addition now runs one pulse/one second; the real build-18 DOM exposes one animation iteration. Full suite 595 passed, 1 skipped, 1 pre-existing usage selector failure; root lint reaches only the documented dead docs reference. Report: `testcases/reports/2026-11-25_ui_controls_build_18.md`.
- NEXT: owner-flagged `bugs/25` first-prompt feed flicker, then the documented non-KAIF reference cleanup so root lint can exit 0. Builds 17–18 remain isolated; main profile remains build 12.


### 2026-11-25 00:41 +03:00 — whole-batch queue steering verified on isolated build 17
- [OWNER] «юзер мог накидать в очередь большую пачку сообщеений, болье двух. И ожидаемое поведение при появляении окна - ВСЕ они улетают в запросы в этом окне» · 2026-11-25 00:05 +03:00 (чат). `bugs/20` now guards stale terminal ordering, host-accepted `QueueBatchReady`, sequential steering of the remainder and failure restoration.
- Fresh-process isolated build 17 passed the real OFF three-item queue path: one lightning selected the first item, then all three reached one active model request in order; final UI has four user bubbles including the base prompt, one assistant response, empty queue and no error. Main-profile build-17 acceptance is still pending; the owner's current main installation remains build 12.
- Hygiene: 121 affected checks, typecheck and VSIX audit pass; full suite 589 passed, 1 skipped, 1 pre-existing `usage-status-bar` selector failure. Root lint passes code checks and stops only on the previously documented deleted non-KAIF skill link in `docs/AGENTS.md`. Report: `testcases/reports/2026-11-25_queue_batch_build_17.md`.
- NEXT: implement the owner-approved context-ring interpolation (blue through 60%, blue→yellow 60–70%, yellow→red-orange 70–80%, then constant red-orange) and one queue-button pulse instead of three; then return to `bugs/25` first-prompt feed flicker.


### 2026-11-24 23:39 +03:00 — FORCE-CLOSED by owner; build 12 installed, non-KAIF skill removal is mid-flight
- Build 12 is packaged and installed on the main-profile disk; source/installed dist SHA-256 values match. The main process still needs a full restart before real-profile acceptance.
- 2026-11-24 23:54 +03:00 — [OWNER] reproduced twice on main-profile build 12: with AUTO STEER OFF and two queued messages, one lightning activation on the first submitted both. `bugs/20` is OPEN again; this real-path failure takes priority over the context-ring color change, which is parked after only a test-import edit.
- 2026-11-24 23:50 +03:00 — [OWNER] «сборка 12 вроде работает стабильнее по чату», «тебе быстро мои стиринг сообщения доходят» (чат). Recorded as positive main-profile steering evidence in `bugs/11` and `bugs/22`; the remaining acceptance matrix stays open. The owner also reported a first-prompt chat-feed flash and disappearing assistant message, filed as `bugs/25_first_prompt_assistant_message_flicker.md`.
- Owner ordered all non-KAIF skills removed. `.agents/skills/` and `skills/use-kimi-code/` are deleted; stale AGENTS/PR/docs workflow references were cleaned on 2026-11-25 and `pnpm lint` now exits 0. Generic user-level `.agents/skills` documentation remains because the engine supports those directories.
- NEXT FIRST: main-profile acceptance of the current isolated fixes; the separate `usage-status-bar` selector remains the last known full-suite failure. Do not start the later ideas before this integrity cut.
- Standing falsehood: apparent build 4–6 live failures were invalid because the isolated process stayed at PID 44644 → corrected in `bugs/20_queue_steer_duplicate_submission.md` and the fresh-process report. No uncorrected artifact is known.
- KNOWLEDGE: the final build and acceptance limits are in this file and `testcases/reports/2026-11-24_chat_lifecycle_audio_build_12.md`; the CDP process lesson is `EXPERIENCE.md` EXP-0011; later owner-approved work is `ideas/02_control_panel_skill_picker.md` and `ideas/03_extension_general_settings.md`; root `AGENTS.md` English translation and nonblocking-subagent research remain recorded below.

## Where we are now

The extension builds and typecheck is green; the latest full extension run has 598 passed, 1 skipped and 0 failures. The 1.0.0 scope, phases and
acceptance live in the KAIF origin repository: `D:/work/ai_sandbox/KAIF/plans/147_EPIC_kimi_krinik_1_0_0.md` and `plans/148`–`154`.
Routine pushes of this branch go under the standing authorization of `AGENT_GUIDE.md` → Git workflow; a release, a rename and any
external publication wait for the owner's `AUTH:`.

| Phase | State | Note |
|---|---|---|
| K0 baseline and contracts | 🔧 in progress | KAIF deployed; inventory and red tests for K1–K4 left |
| K1 UI convergence | ✅ hygiene | Control Panel, Working, secondary-model robot, combined picker, status pills and session header are committed and full-suite green; live Extension Host acceptance is in K5 |
| K2 behavior controls | ✅ hygiene | independent Context Window Control, KAIF handoff and in-flight Auto Compact OFF cancellation are committed and verified; live flip acceptance is in K5 |
| K3 localization and theme | ✅ hygiene | three languages and the theme tokens; live acceptance in K5 |
| K4 sound settings | ✅ hygiene | the window, B8 terminal guard and B5/B6 command/temp-file safety are verified; live sound acceptance is in K5 |
| K5 live acceptance and release | 🔧 main-profile restart pending | build 12 is installed on disk; corrected lifecycle/audio/UI paths have isolated evidence, but real-profile acceptance and publication remain open; publishing only on the owner's `AUTH:` |
| K6 README | 🔧 started | the new pink robot is in EN/RU/ZH README; feature tables still contain 🚧 rows that must close before release |

Verification commands (root `AGENTS.md`): `pnpm lint` · `pnpm --filter kimi-code-kaif run typecheck` ·
`pnpm exec vitest run --reporter=agent apps/vscode/test`. Last full run (2026-11-25 10:20 +03:00, Windows): 598 passed, 1 skipped, 0 failures; root lint, typecheck and build-14 package/static audit green. K2.6 has 2/2 mid-flight scenarios and agent-core typecheck green. The full engine compaction file is 123/123 on Windows; `bugs/05` is DONE and `bugs/04` awaits only its unrun Linux row. Current context-window evidence is in `testcases/reports/2026-11-25_context_window_steer_delivery.md`; experience, attribution, testrun and KAIF budget checks are green.
A red test here is a signal again — there is no accepted baseline of failures.

## 🤖 Autonomous backlog pool (no human / no special hardware needed)



## ❓ Awaiting human review (interviews / homework)

- ❓ `GOAL.md` was assembled from the owner's recorded words (`researches/52` §1); the owner confirms it.
- ❓ B9: one changelog mechanism (changesets or the hand-written `CHANGELOG.md`) and the `major` level.
- ❓ B10: the settings namespace `kimi.*` shared with the official extension.

## Where to continue next session

CURRENT: start with `/skill:resume` in the fresh chat on main-profile build 14. First confirm the loaded build and Context Window Control ON, then reproduce the owner-reported assistant-response disappearance during steering in `bugs/11` with DOM and turn/replay evidence. Verify a real threshold closure on the accumulated profile before marking `bugs/28` DONE. After those owner-flagged paths, resume ON/OFF queue, duplicate, composer, media and hook-output acceptance of `bugs/12`, `bugs/13`, `bugs/15`, `bugs/20`, `bugs/22` and `bugs/24`. Builds 17–20 remain isolated-only. Main source has 598 passed / 1 skipped and root lint green; `bugs/19` two-client replay, original first-prompt `bugs/25`, broader lifecycle matrix, sticky last message and release/publication remain later work. No release/publication without separate owner `AUTH:`.

Standing falsehood: the claims that builds 4–6 had failed live were false because the old isolated process never restarted → corrected in `bugs/20_queue_steer_duplicate_submission.md` and the fresh-process result in `testcases/reports/2026-11-24_chat_lifecycle_audio_build_12.md`.

KNOWLEDGE: the outbound result/queue lifecycle and packaged-audio flow live in `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`; the CDP process-identity lesson is `EXPERIENCE.md` EXP-0011; all three voice languages and the current sound contract are in `GOAL.md` criterion 7 and `bugs/17_DONE_attention_voice_missing_identity.md`; the complete evidence index is `testcases/reports/2026-11-24_chat_lifecycle_audio_build_12.md`.

1. Fully restart the main VS Code process, then read `v1.0.0 (11)` in Action Menu and confirm the current UI is actually loaded.
2. Repeat ON/OFF Enter, two-item queue/lightning, composer-clearing, media thumbnail/viewer and resumed-hook-output checks. Use `testcases/reports/2026-11-24_chat_lifecycle_audio_build_12.md` for the observed baseline and exact limitations.
3. Keep `bugs/12`, `bugs/13`, `bugs/15`, `bugs/20`, `bugs/22` and `bugs/24` open until those real-profile observations. Fix the separate `usage-status-bar` selector without claiming the current full suite was green.
4. Take the sticky-last-message feature as the next separate task after acceptance. Two-client replay, `bugs/16`, `bugs/18`, `bugs/23` and the remaining K5 matrix stay explicit follow-ups.
5. After KIMI KRINIK 1.0.0 is completed and released, implement the owner-approved `ideas/02_control_panel_skill_picker.md`; keep the KAIF translation work in its linked upstream idea 39.
6. ✅ Root `AGENTS.md` is fully translated into English without changing any rule or engineering contract; the owner does not want Chinese-language legacy in the project's working documents. Completed on 2026-11-25 with lint green at 22986/23200 bytes.
7. Owner question answered: native VS Code General Settings follow the VS Code display language (`package.nls*.json`), not the extension's own language. Implement the owner-approved `ideas/03_extension_general_settings.md` as the next development cut: the extension-owned screen follows `kimi.language`, settings keep one owning screen, and Context Window Control plus thresholds move out of Control Panel settings.
8. ✅ Nonblocking subagents researched and recorded in `researches/56_nonblocking_subagents.md`: background `Agent` is supported; `AgentSwarm` is parallel-but-blocking; nested tasks/task-management/notification boundaries are explicit.

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md` and `KIMI CODE LOGO/GPT ROBOT REFERENCES/`; do not sweep them into a commit.

## Approved features

- ✅ `ideas/01_DONE_language_selection_modal.md` — one Language button and selected-first dialog implemented, changeset recorded and EN/RU/ZH VSIX acceptance passed; tagged DONE on 2026-11-25.
  [OWNER] «настройку языка делаем кнопкой, выбор языка переносим в окно, итого целая большая секция из меню сжимается до одной кнопки» · 2026-11-24 (чат)
- ✅ `ideas/02_control_panel_skill_picker.md` — owner approved a scrollable skill picker with bold name / normal description, existing queue/Steer routing and localized metadata fallback. Deliberately deferred until KIMI KRINIK 1.0.0 is completed and released; KAIF translations remain in the linked upstream idea 39.
- ✅ `ideas/03_extension_general_settings.md` — owner approved an extension-localized General Settings page with no duplicate owners; Context Window Control and thresholds move there from Control Panel. Planned for the next development cut, not started during closure.
## Open bugs

- 🔧 `bugs/28_context_window_control_empty_skills_rejected.md` — root cause fixed and real active-turn control observed on isolated builds 20, 13 and full-work 14; main-profile build-14 acceptance pending.
- 🔧 `bugs/19_tool_cards_hide_working_state.md` — active/completion/replay pass on isolated build 19; original main-profile path pending.
- 🔧 `bugs/18_reentrant_prompt_internal_error.md` — ON/OFF/fallback contracts and isolated paths pass; original main-profile path pending.
- 🔧 `bugs/16_steer_avatar_precedes_user_bubble.md` — immediate/consecutive/replay order passes on isolated build 19; original main-profile path pending.

- 🔧 `bugs/27_effort_persistence_and_localization.md` — isolated build-18 restart/wire/labels pass; main-profile acceptance pending.
- 🔧 `bugs/26_sound_off_disables_dropdown.md` — isolated build-18 Off → Glass pass; main-profile acceptance pending.
- 🔧 `bugs/25_first_prompt_assistant_message_flicker.md` — replay flash reproduced/fixed on isolated build 19; original main-profile first-prompt variant remains unverified.
- 🔧 `bugs/22_first_send_stuck_in_steering_queue.md` — exactly-once/result contracts implemented; main-profile build-12 acceptance pending.
- 🔧 `bugs/24_glass_preview_silent.md` — real packaged MP3 playback passed in isolation; main-profile build-12 acceptance pending.
- 🔧 `bugs/20_queue_steer_duplicate_submission.md` — whole-batch delivery verified on fresh isolated build 17; main-profile acceptance pending.
- 🔴 `bugs/11_steer_delivery_and_immediate_display.md` — steering bubbles wait for acknowledgement and some sends are lost at a state transition; owner now also reports an assistant answer disappearing after steering on 2026-11-25. Reproduce first in the fresh build-14 chat.
- 🔧 `bugs/12_steer_composer_restores_previous_text.md` — stale/latest composer contracts fixed; main-profile build-12 acceptance pending.
- 🔧 `bugs/13_steer_attachments_and_thumbnails.md` — isolated build-19 full image/video and media-only delivery/viewer/replay pass; main-profile acceptance pending.
- 🔧 `bugs/14_steer_queue_not_added.md` — isolated text+image/video and media-only immediate queue/dequeue/replay passes; main-profile acceptance pending.
- 🔧 `bugs/15_hook_results_visible_in_chat.md` — replay hook rendering fixed; main-profile build-12 confirmation pending.
- 🔧 `bugs/04_frozen_prompt_windows_path.md` — Windows harness fixed and full file 123/123; Linux CI row remains unrun (WSL not installed, Docker unavailable).
- 🔧 `bugs/KAIF/04` / upstream #204 — local dormant-state diagnostic fix is red-to-green and live activation is observed; keep open until an origin update absorbs it.
- 🔧 `bugs/KAIF/05` / upstream #206 — Vitest runs pass but the default test-after-code heuristic returns `cleared: []` and falsely preserves debt; evidence and upstream report filed. The hook's documented waiver now records why direct standalone execution is invalid here; status is `test debt: none`, with no manual state edit.
- 🔴 `bugs/152` (KAIF origin) — the extension can stay on «Starting Kimi Code…»; not reproduced; check B10 when it recurs.
- 🟠 `bugs/151` (KAIF origin) — follow-up steer race; store-level fixes in place, live acceptance left.

Автономный дневной цикл начат 2026-11-24 03:39 +03:00 и завершён мягким закрытием по измеренной границе контекста 2026-11-24 07:32 +03:00. Вопросы владельцу не отправлялись; релиз не публиковался. `[OWNER] «Работай автономно в дневном цикле … На всё ДА, РАЗРЕШАЮ», «закроешь, не сейчас, а когда чат переполниматься» · 2026-11-24 03:39 +03:00 (чат)`
