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

### 2026-11-25 04:45 +03:00 — B12 complete: planName and side panel/editor backgrounds
- Managed userLevelName reaches `usage.planName` through the public auth facade; optional user-info failure does not hide real quota failures.
- Real side panel and New Tab both compute `rgb(25, 26, 27)`; editor containers are transparent over the same body background, so no sideBar/editor mismatch was reproduced. WebP read.
- B5–B8/B11 and B12 are complete; B9/B10 remain owner decisions. Report: `testcases/reports/2026-11-25_b12_backgrounds.md`.

### 2026-11-25 04:39 +03:00 — managed plan names reach the usage tooltip
- `KimiAuthFacade` now exposes the toolkit's managed user-info path with the same runtime auth resolution as quota. The extension fills `planName` from `userLevelName`; user-info failure is optional and does not hide quota data or its real errors.
- Affected handler tests, SDK/extension typechecks and full suite 597 passed, 1 skipped, 0 failed; root lint 0. B12 editor-background verification remains separate; B9/B10 stay with the owner.

### 2026-11-25 04:30 +03:00 — nonblocking subagent boundary confirmed
- Official docs and local contracts prove `Agent(run_in_background=true)` returns a task ID immediately, supports concurrent background subagents and delivers results automatically. `AgentSwarm` runs concurrently but waits for its aggregated report, so it is parallel-but-blocking, not nonblocking.
- Nested tasks must settle, task-management tools are required, and completion arrives as a notification/steered turn. No live subagent was launched because the project forbids unauthorized launches. Evidence: `researches/56_nonblocking_subagents.md`.

### 2026-11-25 04:27 +03:00 — root AGENTS.md translated to English without rule changes
- Translated all project principles, maps, verification, testing, workflow and review contracts into English; no Han-script prose remains. Condensed wording only to satisfy the existing size guard, without raising the limit.
- `pnpm lint` exits 0: root `AGENTS.md` is 22986/23200 bytes and all 174 references resolve. Full extension suite remains 597 passed, 1 skipped, 0 failed.

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
- ⚠️ Force-closed 2026-11-24 23:39 +03:00: ceremonies skipped (judge pass, bonsai trim, README, showcase linters) — the first /skill:end-chat-soft pays this debt.
- Standing falsehood: apparent build 4–6 live failures were invalid because the isolated process stayed at PID 44644 → corrected in `bugs/20_queue_steer_duplicate_submission.md` and the fresh-process report. No uncorrected artifact is known.
- KNOWLEDGE: the final build and acceptance limits are in this file and `testcases/reports/2026-11-24_chat_lifecycle_audio_build_12.md`; the CDP process lesson is `EXPERIENCE.md` EXP-0011; later owner-approved work is `ideas/02_control_panel_skill_picker.md` and `ideas/03_extension_general_settings.md`; root `AGENTS.md` English translation and nonblocking-subagent research remain recorded below.

### 2026-11-24 23:15 +03:00 — build 12 packaged, isolated acceptance passed, installed on the main-profile disk
- Fixed the duplicate optimistic fallback, stale/current composer restoration, selected-item queue race and Steer media renderer. Runtime/host now preserve `PromptSubmissionResult`; queued prompts correlate at later turn start. Fresh-process build 6 passed the OFF selected-item queue case and WebP 40 was read.
- Packaged 12 prerecorded event MP3 files in EN/RU/ZH with localized project identity and no owner name. RU uses Eugene; ZH uses the phonetic «这是基米·克里尼克». Glass uses MP3 and logs playback rejection. The owner listened and accepted all three voice languages. `bugs/17` is DONE; `bugs/12`, `bugs/13`, `bugs/15`, `bugs/20`, `bugs/22` and `bugs/24` await main-profile build-12 acceptance.
- RU copy now uses «Рассуждение», «При приближении к переполнению…», final full stops and `Glass / Стекло / 玻璃`; queue ping runs three iterations. New defaults are approval Glass, question Voice, error Alert, completion Chime; existing persisted choices remain preserved.
- Control Panel places context controls after all visibility checkboxes (build 10 WebP 42). `bugs/15` replay no longer emits internal hook bodies as assistant text; real-profile confirmation pending.
- Verification: affected contracts and typecheck green; final package/static audit green. Full extension suite 586 passed, 1 skipped, 1 pre-existing failure at `usage-status-bar.test.tsx:57`. Report: `testcases/reports/2026-11-24_chat_lifecycle_audio_build_12.md`.
- Main-profile `package.json` reads build 12 and source/installed dist hashes match. Full VS Code restart is still required before any real-profile fix claim. NEXT: restart, read `v1.0.0 (11)` and repeat the owner ON/OFF queue/composer/media/hook smoke. Sticky last message is the next separate task after this acceptance.
- Harness correction: Playwright `browser.close()` on a CDP connection only disconnected, so apparent build 4–6 failures were invalid. Raw CDP Browser.close plus PID/log-session verification is now required; details in `bugs/20`.
- [OWNER] The changeset author-confirmation step is removed from `.agents/skills/gen-changesets/SKILL.md`; the inherited skill is from the upstream Kimi monorepo, not KAIF. Required changesets are still generated without that extra approval gate.

## What's done (the short tail — older entries live in PROJECT_HISTORY.md)

### 2026-11-24 17:45 +03:00 — lifecycle and UI fixes delivered; installation claim corrected at 18:07
- `bugs/22`: first/queued/steered messages now create immediate optimistic entries with stable `clientId` through store, bridge, runtime and events; durable events reconcile without duplicates and host-idle dequeue needs no lightning. Isolated VSIX: first Send appears before acknowledgement and remains one user entry/one model request.
- `bugs/20`: queue lightning removes immediately and restores exact index on failure; ten activations produce one `steerChat`. `bugs/17`: attention voice starts exactly once with «Николай, это Кими Криник» on Glass/browser routes. `bugs/19`: live tool events restore «Работаю…»; two-client replay is unverified.
- `ideas/01`: language selection is a dialog with selected-first order (English before Russian, Chinese last); Action Menu shows only localized `Language` / `Язык` / `语言`. Delete is localized. Quota/context headings are bold with separator borders/gaps.
- Lifecycle full suite: 48 files, 571 passed, 1 skipped; typecheck, lint, build and Extension Host smoke green. Final usage suite is 4/5: `usage-status-bar.test.tsx:57` reads the immediate parent instead of the separator wrapper; not called green.
- The 17:35 `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix` passed Extension Host smoke, but the owner's 18:07 restart showed that the expected current UI was not active. The earlier claim of a successful current installation is retracted; fresh packaging and installation are required.

### 2026-11-24 13:51 +03:00 — owner findings filed; chat pipeline research and repair ladder ready
- Real-profile acceptance found six open defects: `bugs/11` immediate/lost steering, `bugs/12` obsolete composer restoration, `bugs/13` steering attachments and thumbnails, `bugs/14` missing visible queue, `bugs/15` visible internal hook output and `bugs/16` assistant avatar above the user's steering bubble. No pipeline implementation changed.
- `researches/54_chat_pipeline_reliability.md` synthesizes Claude documentation/bundle 2.1.331, local `app-client`, current SDK and the owner requirements. `plans/01_EPIC_chat_pipeline_reliability.md` defines the two-ID lifecycle and Phases 0–4; `plans/02_epic01_characterize_chat_pipeline.md` details only the red-contract phase. Requirements and attribution linters pass; scenario-lint is SKIPPED (no scenario blocks).
- Context Window descriptions, header percentage, VS Code-derived dark cards and Russian labels were edited with red-to-green targeted checks and observed in the current isolated VSIX. Full extension: 558 passed, 1 skipped; lint, typecheck, build/package and voice-lint green. `HOUSE_RULES.md` R3 records the owner's user-facing explanation style.
- [OWNER] «тогда работаем внутри KIMI KRINIK, а фиксы - запускай и тестируй в изолированном окружении VS Code» · 2026-11-24 13:06 +03:00 (чат). Future fixes are developed inside KIMI KRINIK and run in isolated VS Code.

### 2026-11-24 12:33 +03:00 — responsive/brand UI, C17 and sound contour ✅ full suite / live VSIX
- C17 is live-pass: workspace voice decline/allow, machine priority, phrase cleanup and ENOENT logging. C24–C26 cover the pink response robot, reference composer parity, wheel+fade, wide no-scroll, scrollable Action menu, About RPC, language order and checked-control colors. Bugs 08/09 are DONE.
- Bug 10 is DONE: latest-write volume, serialized host updates, global Sound enabled, Triple 880/660/990, packaged glass.opus and Russian Eugeny. Live VSIX: latest volume 100, OFF creates no audio, neutral tracks. Full extension: 556 passed, 1 skipped; typecheck and lint green.
- At the measured 80% context boundary no new heavy task starts. Remaining real-world rows: C08, C11–C12 and C18–C23, including real-event sound/replay, quotas, active compaction/closure, rejected media, effort/stop, extended status and rollback. The next session must run inside KIMI KRINIK on the owner's real profile.

### 2026-11-24 07:32 +03:00 — B5/B6 and live K5 milestone ✅ hygiene / partial acceptance
- `5c7b8ece5` secured attention voice commands with machine-only configuration, command-bound workspace approval, temp-file cleanup and logged failures; `695d3f51a` made the VSIX Extension Host smoke independent of inherited Electron Node mode; `87c26cf13` fixed the packaged header robot path. All three are pushed.
- Bugs 01–03 are DONE after real VSIX acceptance; bugs 06/07 are DONE with red-to-green guards and live evidence. Languages, sound preview, Control Panel, ON/OFF steering and active-session Swarm controls were observed through CDP/WebP. K5 remains partial; see `testcases/TC_K5_live_acceptance.md` and `testcases/reports/2026-11-24_k5_live_acceptance.md`.

### 2026-11-24 02:34 +03:00 — in-flight Auto Compact OFF ✅ engine integration and full hygiene
- `AgentFullCompactionService` now subscribes to `loopControl` changes and aborts only an active automatic operation when `autoCompact` becomes false. Cancellation is observed before the deferred provider response; an active manual compaction completes and applies its summary. No new automatic starts or overflow recovery occur; manual `/compact` remains available.
- K2.6 red-to-green: the immediate-cancellation assertion failed before the subscription, both mid-flight scenarios and agent-core typecheck pass. Root lint and extension 527/1 pass. The full engine file has 121/123 passes; the two unrelated failures (Windows path in the frozen prompt and an empty Pre/PostCompact hook log) reproduce identically with the new subscription removed. Report: `testcases/reports/2026-11-24_inflight_auto_compact_off.md`.

### 2026-11-24 02:10 +03:00 — live status pills and session header ✅ full hygiene
- `StatusPills` uses real queue/file-change stores, `session.listBackgroundTasks()` polling, the last `SetTodoList` display and the compaction viewer; polling errors are visible and old tasks clear on session change. `BottomToolbar` is fully replaced. The header shows `session_title` from summary/meta events and the KIMI KRINIK robot.
- Two host expectations were red before implementation, then 73 host tests passed; 38 affected webview checks passed. Full suite 527 passed, 1 skipped; typecheck, lint and both builds green after replacing one new `sort()` with `toSorted()`. Live Second Side Bar acceptance remains K5. Report: `testcases/reports/2026-11-24_status_pills_header.md`.

## Where we are now

The extension builds and typecheck is green; the latest full extension run has 597 passed, 1 skipped and 0 failures. The 1.0.0 scope, phases and
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
`pnpm exec vitest run --reporter=agent apps/vscode/test`. Last full run (2026-11-25 02:36 +03:00, Windows): 597 passed, 1 skipped, 0 failures; root lint, typecheck and build-19 package/static audit green. K2.6 has 2/2 mid-flight scenarios and agent-core typecheck green. The full engine compaction file is 123/123 on Windows; `bugs/05` is DONE and `bugs/04` awaits only its unrun Linux row. Context-window evidence is in `testcases/reports/2026-11-24_kaif_kimi_context_alive.md`; experience, attribution, testrun and KAIF budget checks are green.
A red test here is a signal again — there is no accepted baseline of failures.

## 🤖 Autonomous backlog pool (no human / no special hardware needed)


- [ ] `KAIF/framework/hooks` bugs/156 (one sequential Stop): commit, rebuild `dist`, then `node .kaif/kaif-core.mjs update --source D:/work/ai_sandbox/KAIF/dist` here.

## ❓ Awaiting human review (interviews / homework)

- ❓ `GOAL.md` was assembled from the owner's recorded words (`researches/52` §1); the owner confirms it.
- ❓ B9: one changelog mechanism (changesets or the hand-written `CHANGELOG.md`) and the `major` level.
- ❓ B10: the settings namespace `kimi.*` shared with the official extension.

## Where to continue next session

CURRENT: build 12 is installed on the main-profile disk and byte-identical to its final dist; builds 17–19 are isolated-only. Fully restart VS Code, read `v1.0.0 (12)`, then repeat ON/OFF queue, duplicate, composer, media and hook-output checks before marking `bugs/12`, `bugs/13`, `bugs/15`, `bugs/20`, `bugs/22` or `bugs/24` DONE. `bugs/17` is DONE after the owner's three-language listening verdict. The full extension suite and root lint are green; `bugs/19` two-client replay, original first-prompt `bugs/25`, broader lifecycle matrix, sticky last message and release/publication remain later work. No release/publication without separate owner `AUTH:`.

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

- 🔧 `bugs/19_tool_cards_hide_working_state.md` — active/completion/replay pass on isolated build 19; original main-profile path pending.
- 🔧 `bugs/18_reentrant_prompt_internal_error.md` — ON/OFF/fallback contracts and isolated paths pass; original main-profile path pending.
- 🔧 `bugs/16_steer_avatar_precedes_user_bubble.md` — immediate/consecutive/replay order passes on isolated build 19; original main-profile path pending.

- 🔧 `bugs/27_effort_persistence_and_localization.md` — isolated build-18 restart/wire/labels pass; main-profile acceptance pending.
- 🔧 `bugs/26_sound_off_disables_dropdown.md` — isolated build-18 Off → Glass pass; main-profile acceptance pending.
- 🔧 `bugs/25_first_prompt_assistant_message_flicker.md` — replay flash reproduced/fixed on isolated build 19; original main-profile first-prompt variant remains unverified.
- 🔧 `bugs/22_first_send_stuck_in_steering_queue.md` — exactly-once/result contracts implemented; main-profile build-12 acceptance pending.
- 🔧 `bugs/24_glass_preview_silent.md` — real packaged MP3 playback passed in isolation; main-profile build-12 acceptance pending.
- 🔧 `bugs/20_queue_steer_duplicate_submission.md` — whole-batch delivery verified on fresh isolated build 17; main-profile acceptance pending.
- 🔴 `bugs/11_steer_delivery_and_immediate_display.md` — steering bubbles wait for acknowledgement and some sends are lost at a state transition.
- 🔧 `bugs/12_steer_composer_restores_previous_text.md` — stale/latest composer contracts fixed; main-profile build-12 acceptance pending.
- 🔧 `bugs/13_steer_attachments_and_thumbnails.md` — isolated build-19 full image/video and media-only delivery/viewer/replay pass; main-profile acceptance pending.
- 🔧 `bugs/14_steer_queue_not_added.md` — isolated text+image/video and media-only immediate queue/dequeue/replay passes; main-profile acceptance pending.
- 🔧 `bugs/15_hook_results_visible_in_chat.md` — replay hook rendering fixed; main-profile build-12 confirmation pending.
- 🔧 `bugs/04_frozen_prompt_windows_path.md` — Windows harness fixed and full file 123/123; Linux CI row remains unrun (WSL not installed, Docker unavailable).
- 🔧 `bugs/KAIF/04` / upstream #204 — local dormant-state diagnostic fix is red-to-green and live activation is observed; keep open until an origin update absorbs it.
- 🔴 `bugs/152` (KAIF origin) — the extension can stay on «Starting Kimi Code…»; not reproduced; check B10 when it recurs.
- 🟠 `bugs/151` (KAIF origin) — follow-up steer race; store-level fixes in place, live acceptance left.

Автономный дневной цикл начат 2026-11-24 03:39 +03:00 и завершён мягким закрытием по измеренной границе контекста 2026-11-24 07:32 +03:00. Вопросы владельцу не отправлялись; релиз не публиковался. `[OWNER] «Работай автономно в дневном цикле … На всё ДА, РАЗРЕШАЮ», «закроешь, не сейчас, а когда чат переполниматься» · 2026-11-24 03:39 +03:00 (чат)`
