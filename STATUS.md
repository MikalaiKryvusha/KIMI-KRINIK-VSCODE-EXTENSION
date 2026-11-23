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
| K4 sound settings | 🔧 in progress | the window is done; B5/B6/B8 not re-checked against it |
| K5 live acceptance and release | 🔲 todo | `plans/153`; publishing only on the owner's `AUTH:` |
| K6 README | 🔧 started | the new pink robot is in EN/RU/ZH README; feature tables still contain 🚧 rows that must close before release |

Verification commands (root `AGENTS.md`): `pnpm lint` · `pnpm --filter kimi-code-kaif run typecheck` ·
`pnpm exec vitest run --reporter=agent apps/vscode/test`. Last full run (2026-11-24 00:39 +03:00, Windows): 505 passed, 1 skipped, 0 failed; typecheck, lint and extension + webview builds green. The context-window red-to-green selftest and fresh official Kimi run are recorded in `testcases/reports/2026-11-24_kaif_kimi_context_alive.md`; experience, attribution, testrun and KAIF budget checks are green.
A red test here is a signal again — there is no accepted baseline of failures.

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

- [ ] B5–B12 of `Claude_Help_for_Kimi.md` that no phase owns yet.
- [ ] `KAIF/framework/hooks` bugs/156 (one sequential Stop): commit, rebuild `dist`, then `node .kaif/kaif-core.mjs update --source D:/work/ai_sandbox/KAIF/dist` here.

## ❓ Awaiting human review (interviews / homework)

- ❓ `GOAL.md` was assembled from the owner's recorded words (`researches/52` §1); the owner confirms it.
- ❓ B9: one changelog mechanism (changesets or the hand-written `CHANGELOG.md`) and the `major` level.
- ❓ B10: the settings namespace `kimi.*` shared with the official extension.

## Where to continue next session

[AI] PARKED: 2026-11-24 00:44 +03:00 — the previous chat was urgently force-closed after KAIF context control was activated and observed in a fresh official Kimi session. Start the next chat in official `moonshot-ai.kimi-code` (not KIMI FORK or KIMI KRINIK for the autonomous context-controlled path). The user-level engine config now has `[loop_control] auto_compact = false`. The local `--alive` diagnostic fix and delivered issue #204 are included in this handover; UI work resumes from the checklist below.

⚠️ Force-closed 2026-11-24 00:44 +03:00: мягкое закрытие прервано словом владельца; повторное судейство остановлено, bonsai trim и README/showcase ceremonies не выполнялись — первый `/skill:end-chat-soft` оплачивает этот долг.
Standing falsehood: прежнее «ни один проектный хук не запустился» → исправлено в `STATUS.md`, `EXPERIENCE.md` EXP-0004 и `bugs/KAIF/04_context_window_alive_dormant.md`; отдельная коррекция дана в чате.

KNOWLEDGE: independent Context Window Control and the one-authority handoff are in `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`; the false total-hook-failure diagnosis, exact forensics and live activation are in `bugs/KAIF/04_context_window_alive_dormant.md` and EXP-0004; the voice route is in `HOUSE_RULES.md` R1 and EXP-0003; secondary model's checkpoint and the owner's new UI/persistence requirements are in this file.

1. K5 preparation: drive all new controls and `bugs/01`–`03` in a real Extension Host before calling them tested or DONE. Claude sessions here get no KAIF skills or hooks; the owner declined adding `claude-code` for now.

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md` and `KIMI CODE LOGO/GPT ROBOT REFERENCES/`; do not sweep them into a commit.

## Open bugs

- 🟠 `bugs/01`–`03` — fixes and red-to-green guards are committed; live Extension Host acceptance remains before DONE.
- 🔧 `bugs/KAIF/04` / upstream #204 — local dormant-state diagnostic fix is red-to-green and live activation is observed; keep open until an origin update absorbs it.
- 🔴 `bugs/152` (KAIF origin) — the extension can stay on «Starting Kimi Code…»; not reproduced; check B10 when it recurs.
- 🟠 `bugs/151` (KAIF origin) — follow-up steer race; store-level fixes in place, live acceptance left.

Автономный дневной цикл разрешён с 2026-11-24 00:52 +03:00 по заказанному скоупу KIMI KRINIK 1.0.0. Для этого запуска сигнал хука переполнения контекста — явное условие остановки: довести текущий микрошаг до рабочего состояния и запустить `/skill:end-chat-soft`. Релиз в этом цикле не выполняется; его делают позже в новом чате. `[OWNER] «я бы хотел тебя оставить работать автономно над KIMI KRINIK 1.0.0 по скоупу тех фичей, что я заказал», «завершить работы сам, когда сработает хук переполнения контекста», «релиз сделаем потов, в новом чате» · 2026-11-24 00:52 +03:00 (чат)`

Вопросы и запросы владельцу в этом запуске не отправляются: он не сможет ответить. На работу над KIMI KRINIK 1.0.0 получено полное разрешение; пункты, действительно требующие владельца, фиксируются в документах, а цикл продолжается другой задачей. `[OWNER] «вообще никаких запросов не делай, я не смогу ответить. На всё даю разрешение, ДА, разрешаю работать тебе над KIMI KRINIK 1.0.0» · 2026-11-24 00:54 +03:00 (чат)`
