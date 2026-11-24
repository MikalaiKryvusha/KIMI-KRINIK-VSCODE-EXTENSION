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
| K5 live acceptance and release | 🔧 in progress | isolated VSIX startup, Second Side Bar, bugs/02/03/06/07 pass; accumulated-profile and remaining controls/races/sound still open; publishing only on the owner's `AUTH:` |
| K6 README | 🔧 started | the new pink robot is in EN/RU/ZH README; feature tables still contain 🚧 rows that must close before release |

Verification commands (root `AGENTS.md`): `pnpm lint` · `pnpm --filter kimi-code-kaif run typecheck` ·
`pnpm exec vitest run --reporter=agent apps/vscode/test`. Last full run (2026-11-24 05:23 +03:00, Windows): 535 passed, 1 skipped; typecheck, lint and extension + webview builds green. K2.6 has 2/2 mid-flight scenarios and agent-core typecheck green. The full engine file is 121/123; the two unrelated pre-existing failures are documented in `bugs/04` and `bugs/05`, not hidden as a baseline. Context-window evidence is in `testcases/reports/2026-11-24_kaif_kimi_context_alive.md`; experience, attribution, testrun and KAIF budget checks are green.
A red test here is a signal again — there is no accepted baseline of failures.

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

- [ ] B5–B12 of `Claude_Help_for_Kimi.md` that no phase owns yet.
- [ ] `KAIF/framework/hooks` bugs/156 (one sequential Stop): commit, rebuild `dist`, then `node .kaif/kaif-core.mjs update --source D:/work/ai_sandbox/KAIF/dist` here.

## ❓ Awaiting human review (interviews / homework)

- ❓ `GOAL.md` was assembled from the owner's recorded words (`researches/52` §1); the owner confirms it.
- ❓ B9: one changelog mechanism (changesets or the hand-written `CHANGELOG.md`) and the `major` level.
- ❓ B10: the settings namespace `kimi.*` shared with the official extension.

## Where to continue next session

[AI] IN PROGRESS: 2026-11-24 05:23 +03:00 — B5/B6 and the harness fix are pushed. Bug 07 is fixed and live-verified on a rebuilt VSIX; finish its judge/commit/push and continue the remaining K5 matrix. Do not close the chat now; start soft closure only when the context-overflow hook fires.

Standing falsehood: прежнее «ни один проектный хук не запустился» → исправлено в `STATUS.md`, `EXPERIENCE.md` EXP-0004 и `bugs/KAIF/04_context_window_alive_dormant.md`; отдельная коррекция дана в чате.

KNOWLEDGE: permission defaults, model picker, live status/title flow and in-flight cancellation are in `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`; live K5 observations and WebP paths are in `testcases/reports/2026-11-24_k5_live_acceptance.md`; the one-step Extension Host route is in `HOUSE_RULES.md`; closed harness and resource defects are in `bugs/06_DONE_extension_host_electron_node_mode.md` and `bugs/07_DONE_header_robot_resource_path.md`.

1. K5: drive all new controls, B5/B6 and `bugs/01`–`03` in a real Extension Host before calling them tested or DONE. Claude sessions here get no KAIF skills or hooks; the owner declined adding `claude-code` for now.
2. Investigate `bugs/04_frozen_prompt_windows_path.md` and `bugs/05_pre_post_compact_hook_log_empty.md` separately; both reproduce on the original engine service and are not K2.6 regressions.
3. Continue the remaining 1.0.0 release-readiness items without changing the pending B9/B10 owner decisions.

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md` and `KIMI CODE LOGO/GPT ROBOT REFERENCES/`; do not sweep them into a commit.

## Open bugs

- 🟠 `bugs/01`–`03` — fixes and red-to-green guards are committed; live Extension Host acceptance remains before DONE.
- 🟠 B5/B6 in `Claude_Help_for_Kimi.md` — machine-only config, command-bound workspace approval, temp-file cleanup and failure logging are green; live Extension Host acceptance remains in K5.
- 🔴 `bugs/04_frozen_prompt_windows_path.md` — pre-existing Windows cwd/listing failure reproduced on the original engine service.
- 🔴 `bugs/05_pre_post_compact_hook_log_empty.md` — pre-existing empty Pre/PostCompact payload list reproduced on the original engine service.
- 🔧 `bugs/KAIF/04` / upstream #204 — local dormant-state diagnostic fix is red-to-green and live activation is observed; keep open until an origin update absorbs it.
- 🔴 `bugs/152` (KAIF origin) — the extension can stay on «Starting Kimi Code…»; not reproduced; check B10 when it recurs.
- 🟠 `bugs/151` (KAIF origin) — follow-up steer race; store-level fixes in place, live acceptance left.

Текущий автономный дневной цикл начат 2026-11-24 03:39 +03:00 по скоупу KIMI KRINIK 1.0.0. Вопросы и запросы разрешений не отправляются; цикл идёт к заявленному функционалу и релизной готовности. Чат закрывается не сейчас, а автоматически по сигналу переполнения контекста. `[OWNER] «продолжай делать KIMI KRINIK 1.0.0. Работай автономно в дневном цикле. Без вопросов и запросов разрешений - я не смогу тебе дать на них ответы. На всё ДА, РАЗРЕШАЮ. Стремимся сделать заявленный функционал, и прийти к релизу. закроей чат автоматически по переполнению контекста чата», «закроешь, не сейчас, а когда чат переполниматься. А сейчас, пожалуйста, заложи в автономноый дневной луп» · 2026-11-24 03:39 +03:00 (чат)`
