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
| K4 sound settings | 🔧 in progress | the window is done; B8's terminal guard is verified, B5/B6 remain for the next session |
| K5 live acceptance and release | 🔲 todo | `plans/153`; publishing only on the owner's `AUTH:` |
| K6 README | 🔧 started | the new pink robot is in EN/RU/ZH README; feature tables still contain 🚧 rows that must close before release |

Verification commands (root `AGENTS.md`): `pnpm lint` · `pnpm --filter kimi-code-kaif run typecheck` ·
`pnpm exec vitest run --reporter=agent apps/vscode/test`. Last full run (2026-11-24 02:28 +03:00, Windows): 527 passed, 1 skipped; typecheck, lint and extension + webview builds green. K2.6 has 2/2 mid-flight scenarios and agent-core typecheck green. The full engine file is 121/123; the two unrelated pre-existing failures are documented in `bugs/04` and `bugs/05`, not hidden as a baseline. Context-window evidence is in `testcases/reports/2026-11-24_kaif_kimi_context_alive.md`; experience, attribution, testrun and KAIF budget checks are green.
A red test here is a signal again — there is no accepted baseline of failures.

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

- [ ] B5–B12 of `Claude_Help_for_Kimi.md` that no phase owns yet.
- [ ] `KAIF/framework/hooks` bugs/156 (one sequential Stop): commit, rebuild `dist`, then `node .kaif/kaif-core.mjs update --source D:/work/ai_sandbox/KAIF/dist` here.

## ❓ Awaiting human review (interviews / homework)

- ❓ `GOAL.md` was assembled from the owner's recorded words (`researches/52` §1); the owner confirms it.
- ❓ B9: one changelog mechanism (changesets or the hand-written `CHANGELOG.md`) and the `major` level.
- ❓ B10: the settings namespace `kimi.*` shared with the official extension.

## Where to continue next session

[AI] PARKED: 2026-11-24 02:44 +03:00 — soft closure entered at the measured 80% context level. Every change through `74a76daf2` is committed and pushed. `apps/vscode/src/handlers/attention.handler.ts` is unchanged: the attempted B5/B6 write was not applied. Start the next chat in official `moonshot-ai.kimi-code` and run `/skill:resume`. A release is deliberately left for a separate new chat per the owner's word.

Standing falsehood: прежнее «ни один проектный хук не запустился» → исправлено в `STATUS.md`, `EXPERIENCE.md` EXP-0004 и `bugs/KAIF/04_context_window_alive_dormant.md`; отдельная коррекция дана в чате.

KNOWLEDGE: permission defaults, model picker, live status/title flow and in-flight cancellation are in `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`; the mid-flight assertion lesson is in `EXPERIENCE.md` EXP-0006; run reports live in `testcases/reports/`; B8's existing terminal guard is in `apps/vscode/webview-ui/src/stores/chat.store.ts:147`.

1. Finish B5/B6 in `apps/vscode/src/handlers/attention.handler.ts`: use only the machine-level `kimi.attentionVoiceCommand` (manifest `scope: "machine"` and `inspect().globalValue`), require a one-time workspace approval before spawning the `.kaif/kaif.json` command so the accepted Glass route can continue where approved, write phrase files to the temp directory, delete them on child exit/error, and catch write/spawn failures with `logError`. Update `apps/vscode/test/attention-handler.test.ts` for approval, machine-vs-workspace precedence, temp-file cleanup and write failure.
2. Run `pnpm exec vitest run --reporter=agent apps/vscode/test/attention-handler.test.ts apps/vscode/test/webview/chat-store.test.ts`, then the full verification commands above. Keep B8's `terminal === false` behavior and undefined-reason fallback.
3. K5 preparation: drive all new controls and `bugs/01`–`03` in a real Extension Host before calling them tested or DONE. Claude sessions here get no KAIF skills or hooks; the owner declined adding `claude-code` for now.
4. Investigate `bugs/04_frozen_prompt_windows_path.md` and `bugs/05_pre_post_compact_hook_log_empty.md` separately; both reproduce on the original engine service and are not K2.6 regressions.

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md` and `KIMI CODE LOGO/GPT ROBOT REFERENCES/`; do not sweep them into a commit.

## Open bugs

- 🟠 `bugs/01`–`03` — fixes and red-to-green guards are committed; live Extension Host acceptance remains before DONE.
- 🔴 B5/B6 in `Claude_Help_for_Kimi.md` — project voice-command approval and temp-file lifecycle remain; B8 is already guarded.
- 🔴 `bugs/04_frozen_prompt_windows_path.md` — pre-existing Windows cwd/listing failure reproduced on the original engine service.
- 🔴 `bugs/05_pre_post_compact_hook_log_empty.md` — pre-existing empty Pre/PostCompact payload list reproduced on the original engine service.
- 🔧 `bugs/KAIF/04` / upstream #204 — local dormant-state diagnostic fix is red-to-green and live activation is observed; keep open until an origin update absorbs it.
- 🔴 `bugs/152` (KAIF origin) — the extension can stay on «Starting Kimi Code…»; not reproduced; check B10 when it recurs.
- 🟠 `bugs/151` (KAIF origin) — follow-up steer race; store-level fixes in place, live acceptance left.

Автономный дневной цикл начат с 2026-11-24 00:52 +03:00 по заказанному скоупу KIMI KRINIK 1.0.0 и завершён по измеренному хуку переполнения на 80% в 2026-11-24 02:44 +03:00. Релиз в этом цикле не выполнялся; его делают позже в новом чате. `[OWNER] «я бы хотел тебя оставить работать автономно над KIMI KRINIK 1.0.0 по скоупу тех фичей, что я заказал», «завершить работы сам, когда сработает хук переполнения контекста», «релиз сделаем потов, в новом чате» · 2026-11-24 00:52 +03:00 (чат)`

Вопросы и запросы владельцу в этом запуске не отправляются: он не сможет ответить. На работу над KIMI KRINIK 1.0.0 получено полное разрешение; пункты, действительно требующие владельца, фиксируются в документах, а цикл продолжается другой задачей. `[OWNER] «вообще никаких запросов не делай, я не смогу ответить. На всё даю разрешение, ДА, разрешаю работать тебе над KIMI KRINIK 1.0.0» · 2026-11-24 00:54 +03:00 (чат)`
