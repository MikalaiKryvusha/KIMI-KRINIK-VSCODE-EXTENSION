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

## What's done (the short tail — older entries live in PROJECT_HISTORY.md)

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
| K5 live acceptance and release | 🔧 in progress | bugs/01–03/06/07, isolated startup, Second Side Bar, languages, sound preview and ON/OFF steering pass; quotas, closure, B5/B6 dialog, media-reject and rollback remain; publishing only on the owner's `AUTH:` |
| K6 README | 🔧 started | the new pink robot is in EN/RU/ZH README; feature tables still contain 🚧 rows that must close before release |

Verification commands (root `AGENTS.md`): `pnpm lint` · `pnpm --filter kimi-code-kaif run typecheck` ·
`pnpm exec vitest run --reporter=agent apps/vscode/test`. Last full run (2026-11-24 12:14 +03:00, Windows): 556 passed, 1 skipped; typecheck, lint and extension + webview builds green. K2.6 has 2/2 mid-flight scenarios and agent-core typecheck green. The full engine file is 121/123; the two unrelated pre-existing failures are documented in `bugs/04` and `bugs/05`, not hidden as a baseline. Context-window evidence is in `testcases/reports/2026-11-24_kaif_kimi_context_alive.md`; experience, attribution, testrun and KAIF budget checks are green.
A red test here is a signal again — there is no accepted baseline of failures.

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

- [ ] B5–B12 of `Claude_Help_for_Kimi.md` that no phase owns yet.
- [ ] `KAIF/framework/hooks` bugs/156 (one sequential Stop): commit, rebuild `dist`, then `node .kaif/kaif-core.mjs update --source D:/work/ai_sandbox/KAIF/dist` here.

## ❓ Awaiting human review (interviews / homework)

- ❓ `GOAL.md` was assembled from the owner's recorded words (`researches/52` §1); the owner confirms it.
- ❓ B9: one changelog mechanism (changesets or the hand-written `CHANGELOG.md`) and the `major` level.
- ❓ B10: the settings namespace `kimi.*` shared with the official extension.

## Where to continue next session

[OWNER] «тестируй всё, что можешь протестировать на стенде, полируй, доводи до хорошего состояния … На этом мы тут чат закроем, я перезапускаю VS Code с установленным тобою KIMI KRINIK 1.0.0, и я создам новую сессию прямо в нём» · 2026-11-24 10:00 +03:00 (чат)

Stand-first route is complete through C17, C24–C26 and the sound contour. Main commit `8ac5df733` is pushed and `mikalai-kryvusha.kimi-code-kaif@1.0.0` is installed in the owner's main VS Code. The next session runs inside KIMI KRINIK on the owner's real profile and uses Windows mouse/keyboard automation and screenshots for the remaining real-world acceptance.

[AI] FORCE-CLOSED: 2026-11-24 12:48 +03:00 — the window reached 90%; no new task, build, test suite or judge starts. Full suite (556/1), typecheck, lint and judge VERIFIED were completed before the forced closure.

⚠️ Force-closed 2026-11-24 12:48 +03:00: ceremonies skipped (judge pass, bonsai trim, README, showcase linters) — the first `/skill:end-chat-soft` pays this debt.

Standing falsehood: прежнее «ни один проектный хук не запустился» → исправлено в `STATUS.md`, `EXPERIENCE.md` EXP-0004 и `bugs/KAIF/04_context_window_alive_dormant.md`; ранняя ошибка изоляции CDP исправлена в K5 report/TC и launcher; корневой `.kaif/kaif.json` восстановлен и не имеет diff. Прежнее «глаза робота отличаются геометрией» оказалось неверным: совпадал размер и `rounded`, исправлено в коде KimiLogo/ChatMessage.

KNOWLEDGE: responsive/brand parity is in `researches/53_control_panel_parity.md`; live K5 observations/WebP and the remaining matrix are in `testcases/reports/2026-11-24_k5_live_acceptance.md` and `testcases/TC_K5_live_acceptance.md`; voice facts are in `HOUSE_RULES.md` and `D:/work/ai_sandbox/tools/silero_tts/VOICE_RULES.md`; the resource-resolver lesson is `EXPERIENCE.md` EXP-0007.

1. Start the next chat with `/skill:resume` inside the installed KIMI KRINIK 1.0.0 on the owner's accumulated profile; read `testcases/TC_K5_live_acceptance.md` and the K5 report first. Continue C08, C11–C12 and C18–C23: real quotas, active compaction/closure, rejected media, effort/stop, extended status, real-event sound/replay and rollback. No row gets DONE from hygiene alone.
2. For C23 inspect the Swarm reminder exit/reconcile contract before filing a defect: `packages/node-sdk/src/sdk-rpc-client-v2.ts:2572` documents reminder behavior. Read `packages/agent-core-v2/AGENTS.md` before any engine change. The observed historical enter reminder alone is not proof of a bug.
3. Use Windows mouse/keyboard automation and regular PC screenshots per `HOUSE_RULES.md` R2. The ignored local harness and evidence are under `.tmp/k5-vscode*`; inspect before reuse. The committed isolated startup route is `pnpm --filter kimi-code-kaif test:extension-host --version 1.123.0`. No test process is left running by this closing ritual.
4. Investigate `bugs/04_frozen_prompt_windows_path.md` and `bugs/05_pre_post_compact_hook_log_empty.md` separately; both reproduce on the original engine service and are not K2.6 regressions.
5. Release/publication remains a separate gated step. Do not decide B9/B10 or publish without the owner's required word.

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md` and `KIMI CODE LOGO/GPT ROBOT REFERENCES/`; do not sweep them into a commit.

## Open bugs

- 🔴 `bugs/04_frozen_prompt_windows_path.md` — pre-existing Windows cwd/listing failure reproduced on the original engine service.
- 🔴 `bugs/05_pre_post_compact_hook_log_empty.md` — pre-existing empty Pre/PostCompact payload list reproduced on the original engine service.
- 🔧 `bugs/KAIF/04` / upstream #204 — local dormant-state diagnostic fix is red-to-green and live activation is observed; keep open until an origin update absorbs it.
- 🔴 `bugs/152` (KAIF origin) — the extension can stay on «Starting Kimi Code…»; not reproduced; check B10 when it recurs.
- 🟠 `bugs/151` (KAIF origin) — follow-up steer race; store-level fixes in place, live acceptance left.

Автономный дневной цикл начат 2026-11-24 03:39 +03:00 и завершён мягким закрытием по измеренной границе контекста 2026-11-24 07:32 +03:00. Вопросы владельцу не отправлялись; релиз не публиковался. `[OWNER] «Работай автономно в дневном цикле … На всё ДА, РАЗРЕШАЮ», «закроешь, не сейчас, а когда чат переполниматься» · 2026-11-24 03:39 +03:00 (чат)`
