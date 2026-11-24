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

### 2026-11-24 18:13 +03:00 — build 1 installed in the main profile; force-closed
- Action Menu now renders `v1.0.0 (N)`. `apps/vscode/package.json` owns `buildNumber`; every non-dry-run `package:platform` invocation increments it once before building, and the host passes it through `ExtensionConfig`.
- Fresh `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix` is build 1. `code --install-extension ... --force` installed it into the owner's main profile; installed `package.json` reads `buildNumber: 1`, and installed extension/webview SHA-256 values exactly match the new dist files. Post-restart rendering is not yet observed.
- Verification: new targeted tests 26/26, extension + webview typecheck and root lint green; package/static audit green. Full suite: 573 passed, 1 skipped, 1 failed at the previously documented `apps/vscode/test/webview/usage-status-bar.test.tsx:57` parent-selector assertion (`border-t` is on the separator wrapper); not called green.
- NEXT: the owner restarts VS Code and checks `v1.0.0 (1)` plus the Language dialog in Action Menu. The next chat first observes that real-profile smoke, then fixes the usage-status-bar selector and reruns the full suite. Generate the build-number changeset before a PR; no release/publication is authorized.
- Pre-existing `.kaif/kaif.json` modification and untracked `.kaif/kimi-refresh.json`, `.vscode-test/`, `Claude_Help_for_Kimi.md`, `KIMI CODE LOGO/GPT ROBOT REFERENCES/` are not part of this change.
- ⚠️ Force-closed 2026-11-24 18:13 +03:00: ceremonies skipped (judge pass, bonsai trim, README, showcase linters) — the first /skill:end-chat-soft pays this debt.
- Standing falsehood: none — the earlier expected-current-UI installation claim was corrected above and in the 17:45 entry.
- KNOWLEDGE: build identity is sourced from the extension manifest and was checked through the installed package and byte-identical dist hashes; the recipe and remaining UI observation are recorded here.

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

The extension builds, `pnpm lint` is green and `apps/vscode/test` is fully green on Windows. The 1.0.0 scope, phases and
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
| K5 live acceptance and release | ⏸ paused | bugs/11–15 are release-blocking owner findings from the real profile; earlier isolated ON/OFF steering passes did not cover the failing races/media/hook rendering; publishing only on the owner's `AUTH:` |
| K6 README | 🔧 started | the new pink robot is in EN/RU/ZH README; feature tables still contain 🚧 rows that must close before release |

Verification commands (root `AGENTS.md`): `pnpm lint` · `pnpm --filter kimi-code-kaif run typecheck` ·
`pnpm exec vitest run --reporter=agent apps/vscode/test`. Last full run (2026-11-24 14:42 +03:00, Windows): 558 passed, 1 skipped; typecheck, lint and extension + webview builds green. K2.6 has 2/2 mid-flight scenarios and agent-core typecheck green. The full engine file is 121/123; the two unrelated pre-existing failures are documented in `bugs/04` and `bugs/05`, not hidden as a baseline. Context-window evidence is in `testcases/reports/2026-11-24_kaif_kimi_context_alive.md`; experience, attribution, testrun and KAIF budget checks are green.
A red test here is a signal again — there is no accepted baseline of failures.

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

- [ ] B5–B12 of `Claude_Help_for_Kimi.md` that no phase owns yet.
- [ ] `KAIF/framework/hooks` bugs/156 (one sequential Stop): commit, rebuild `dist`, then `node .kaif/kaif-core.mjs update --source D:/work/ai_sandbox/KAIF/dist` here.

## ❓ Awaiting human review (interviews / homework)

- ❓ `GOAL.md` was assembled from the owner's recorded words (`researches/52` §1); the owner confirms it.
- ❓ B9: one changelog mechanism (changesets or the hand-written `CHANGELOG.md`) and the `major` level.
- ❓ B10: the settings namespace `kimi.*` shared with the official extension.

## Where to continue next session

FORCE-CLOSED: 2026-11-24 17:45 +03:00 — a VSIX was packaged, but the owner's later restart disproved the expected-current-UI installation claim. Next session starts by fixing the parent selector in `apps/vscode/test/webview/usage-status-bar.test.tsx:57` (use the separator wrapper), then runs full `apps/vscode/test`, lint/typecheck and a real-profile first-Send/queue/language smoke. `bugs/19` still needs two-client replay acceptance; `bugs/11`–`16` and `bugs/18` still need the broader lifecycle contracts in `plans/02_epic01_characterize_chat_pipeline.md`. `bugs/17`, `bugs/20`, `bugs/22` and `ideas/01` have implementation evidence but their DONE handoff/documentation is not fully committed yet. No release/publication without separate owner `AUTH:`.

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

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md` and `KIMI CODE LOGO/GPT ROBOT REFERENCES/`; do not sweep them into a commit.

## Approved features

- 🔧 `ideas/01_language_selection_modal.md` — owner approved one Language button in Action Menu with English → Русский → 中文 moved into a separate dialog; implementation and VSIX acceptance in progress.

## Open bugs

- 🔴 `bugs/20_queue_steer_duplicate_submission.md` — repeated lightning clicks lack immediate feedback and each starts another steer; the owner requires an optimistic response, not a disabled-only fix.
- 🔴 `bugs/19_tool_cards_hide_working_state.md` — completed tool cards can leave no visible «Работаю…» while the turn remains active.
- 🔴 `bugs/18_reentrant_prompt_internal_error.md` — owner hit the generic send error in both extensions; the fresh KIMI KRINIK log proves a second ordinary prompt hit the active-response guard.
- 🔴 `bugs/17_attention_voice_missing_identity.md` — both attention voice routes pass raw event text without the required owner/project opening.
- 🔴 `bugs/11_steer_delivery_and_immediate_display.md` — steering bubbles wait for acknowledgement and some sends are lost at a state transition.
- 🔴 `bugs/12_steer_composer_restores_previous_text.md` — an older steering message reappears in the composer after a newer send.
- 🔴 `bugs/13_steer_attachments_and_thumbnails.md` — steering attachments are not delivered and steer bubbles lack clickable media thumbnails.
- 🔴 `bugs/14_steer_queue_not_added.md` — the follow-up queue is not visibly added; exact state combination needs reproduction.
- 🔴 `bugs/15_hook_results_visible_in_chat.md` — internal hook results render as assistant chat text; the replay rendering path is confirmed.
- 🔴 `bugs/16_steer_avatar_precedes_user_bubble.md` — steering is nested inside assistant steps, placing the avatar above the user's bubble.
- 🔴 `bugs/04_frozen_prompt_windows_path.md` — pre-existing Windows cwd/listing failure reproduced on the original engine service.
- 🔴 `bugs/05_pre_post_compact_hook_log_empty.md` — pre-existing empty Pre/PostCompact payload list reproduced on the original engine service.
- 🔧 `bugs/KAIF/04` / upstream #204 — local dormant-state diagnostic fix is red-to-green and live activation is observed; keep open until an origin update absorbs it.
- 🔴 `bugs/152` (KAIF origin) — the extension can stay on «Starting Kimi Code…»; not reproduced; check B10 when it recurs.
- 🟠 `bugs/151` (KAIF origin) — follow-up steer race; store-level fixes in place, live acceptance left.

Автономный дневной цикл начат 2026-11-24 03:39 +03:00 и завершён мягким закрытием по измеренной границе контекста 2026-11-24 07:32 +03:00. Вопросы владельцу не отправлялись; релиз не публиковался. `[OWNER] «Работай автономно в дневном цикле … На всё ДА, РАЗРЕШАЮ», «закроешь, не сейчас, а когда чат переполниматься» · 2026-11-24 03:39 +03:00 (чат)`
