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

### 2026-11-25 17:16 +03:00 — build 22 fixes live chat rendering; main-profile restart pending
- [OWNER] «сразу как я тебе первое сообщение resume отправил - в полотне чата твоё какое-то сообщение появилось и мгновенно исчезло. Баг присутвтствует.», «опять ты высрал какой-то технический теккст в чат» (чат). `bugs/25` now also covers live Markdown remounts, and `bugs/15` covers the previously unverified live `hook.result` projection. Both are verified on isolated build 22, not yet on the restarted main profile.
- [OWNER] «давай время сообщений пользователя писать слева от них, вот тут», «а в стики сообщении вверху не делать пустое место на всю ширину пузыря только ради кнопки сворачинвания», «в стики пузыре нужно текст выше поднять, по оптическому центру тяжести чтобы вертикально текст был в пузыре выровнен» (чат). `plans/03` records and implements all three.
- Verification: component regressions red before and green after; full extension 610 passed / 1 skipped, typecheck and root lint green. Real VSIX control build 20 showed hook text; builds 21/22 kept it in model input but out of every observed UI snapshot. Build-22 DOM trace has no response removals; sticky geometry and WebP pass.
- Build 22 is installed on the main profile through direct VS Code CLI: manifest `buildNumber: 22`. The running Extension Host still needs a VS Code restart before accumulated-profile acceptance. Do not publish.

### 2026-11-25 16:08 +03:00 — SOFT CLOSURE: build 19 ready; owner authorization pending
- Done: `bugs/29` preflight ownership guard; `bugs/28` is DONE after the real 70% warning on the accumulated main profile; `plans/03` sticky prompt with animated chevron, expand/collapse, media and localized send time. Build 19 is the release candidate with the complete packaged changelog.
- Verification: full extension 607 passed / 1 skipped, typecheck and root lint green, six-target static/import verification passed. README covers all delivered differences in EN/RU/ZH. Main-profile 70% and 75% context warnings are observed. `bugs/11` is parked after three non-reproductions; no DONE claim.
- [OWNER] «вот это в ДИДМИ продукта зачем? ... ЗАЧЕМ МНЕ ЭТа ИНФОРМАЦИЯ? ... ✅ работает без KAIF», «вот это тоже нахуй все такое поудаляй из ридми · 🚧 приёмка на основном профиле» (чат). Removed KAIF badges/integration/credits and every 🚧 acceptance marker from README in all three languages. Product documentation now describes only KIMI KRINIK behavior.
- `release-notes/1.0.0/changelog.{en,ru,zh}.md` is ready with the neutral factual title `KIMI KRINIK 1.0.0`. Independent semantic review is resolved and voice/link checks are green.
- [OWNER] «разрешаю установить» · 2026-11-25 16:33 +03:00 (chat). Option B is selected: build-19 installation on the main profile is authorized; publication is not authorized. Install and verify the running build before any further acceptance.
- Process correction: the owner requires the newest fixed builds on his working profile by default, not only on isolated stands. This is now standing authorization in `HOUSE_RULES.md` R5; release publication remains separately gated.
- Closure debt: final Desktop E2E smoke passed 1/1 (`core-turn.spec.ts`, 46.3s), full extension 607/1, typecheck/lint/build and voice/link checks green. Final judge and final commit/push are recorded below after execution. The earlier force-closed README/judge debts were paid in this chat.
- [OWNER] challenged an unsupported multiline dash: the comparison cells now say `standard Markdown whitespace` instead of claiming the feature is absent. KAIF and all acceptance markers were removed by the owner's direct instruction. <!-- attribution-ok: pre-existing entry from HEAD; this change does not alter its claim -->

## Where we are now

The current release candidate is `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix`, SHA-256 `80550889127f4e4ba9b6138f9863c5d7160a2af380168875718111503fae723b`. The extension has 610 passed / 1 skipped and 0 failures. Build 22 is installed on the main profile: manifest `buildNumber: 22`. The previous build-19 installation also required direct VS Code CLI because test-electron had reported success without replacing older files. No GitHub Release exists.

## ❓ Awaiting human review

- `interviews/interview_001_kimi_krinik_1_0_0_release.md` Q1 — installation and publication decision. The owner has not answered.
- `GOAL.md` owner confirmation, B9 changelog mechanism and B10 shared `kimi.*` namespace remain open organizational questions, not reasons to start new work during closure.

## Where to continue next session

1. Restart VS Code so the running Extension Host loads installed build 22. On the accumulated main profile verify no live `clock-now` / `KAIF knowledge` text, no disappearing assistant text on the first prompt, timestamps left of user bubbles, and compact/expanded sticky layout. Evidence and cases: `testcases/reports/2026-11-25_chat_rendering_build_22.md`. Do not publish without separate owner `AUTH:`.
2. Publish only with explicit owner `AUTH:` and only after green real-world acceptance: tag `v1.0.0`, attach `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix`, use `release-notes/1.0.0/changelog.{en,ru,zh}.md`, then open and read the published page.
3. If the answer is still absent, do not install or publish. Next clear work is real VSIX preflight verification for `bugs/29`, then accumulated-profile acceptance of `bugs/12`, `bugs/13`, `bugs/15`, `bugs/20`, `bugs/22` and `bugs/24` when the owner prioritizes it.
4. `bugs/11` stays parked by the owner's Pareto direction; resume only with new deterministic evidence. Do not start `ideas/02` before 1.0.0 is released. `ideas/03` is the next development cut after the release path.

## Open bugs

- 🔧 `bugs/29_preflight_error_deletes_unrelated_history.md` — deterministic regressions and full suite pass; real VSIX preflight path pending.
- 🔴 `bugs/11_steer_delivery_and_immediate_display.md` — repeated owner symptom, three isolated non-reproductions; parked with evidence, not DONE.
- 🔧 `bugs/19_tool_cards_hide_working_state.md`, `bugs/18_reentrant_prompt_internal_error.md`, `bugs/16_steer_avatar_precedes_user_bubble.md` — isolated paths pass; original main-profile paths pending.
- 🔧 `bugs/25_first_prompt_assistant_message_flicker.md`, `bugs/15_hook_results_visible_in_chat.md` — isolated build-22 live and replay fixes pass; accumulated main-profile running-build acceptance pending.
- 🔧 `bugs/27_effort_persistence_and_localization.md`, `bugs/26_sound_off_disables_dropdown.md`, `bugs/22_first_send_stuck_in_steering_queue.md`, `bugs/24_glass_preview_silent.md`, `bugs/20_queue_steer_duplicate_submission.md` — isolated fixes pass; accumulated main-profile acceptance pending.
- 🔧 `bugs/12_steer_composer_restores_previous_text.md`, `bugs/13_steer_attachments_and_thumbnails.md`, `bugs/14_steer_queue_not_added.md` — isolated paths pass; accumulated main-profile acceptance pending.
- 🔧 `bugs/04_frozen_prompt_windows_path.md` — Windows 123/123; Linux CI row unrun because WSL/Docker are unavailable.
- 🔧 `bugs/KAIF/04` / upstream #204 and `bugs/KAIF/05` / upstream #206 — framework-local issues remain open until origin updates absorb them.
- 🔴 `bugs/152` (KAIF origin) — «Starting Kimi Code…» not reproduced; 🟠 `bugs/151` — follow-up steer race, live acceptance left.

KNOWLEDGE: build-22 live rendering and sticky evidence is in `testcases/reports/2026-11-25_chat_rendering_build_22.md`; `EXP-0016` records the container-vs-content/live-vs-replay lesson. Real threshold delivery is in `bugs/28_DONE_context_window_control_empty_skills_rejected.md`; sticky requirements are in `plans/03_sticky_viewport_prompt.md`; preflight ownership is in `bugs/29_preflight_error_deletes_unrelated_history.md`.

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md`, `KIMI CODE LOGO/GPT ROBOT REFERENCES/` and `interviews/decisions/`; do not sweep them into a commit.
