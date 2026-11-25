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

### 2026-11-25 16:08 +03:00 — SOFT CLOSURE: build 19 ready; owner authorization pending
- Done: `bugs/29` preflight ownership guard; `bugs/28` is DONE after the real 70% warning on the accumulated main profile; `plans/03` sticky prompt with animated chevron, expand/collapse, media and localized send time. Build 19 is the release candidate with the complete packaged changelog.
- Verification: full extension 607 passed / 1 skipped, typecheck and root lint green, six-target static/import verification passed. README covers all delivered differences in EN/RU/ZH. Main-profile 70% and 75% context warnings are observed. `bugs/11` is parked after three non-reproductions; no DONE claim.
- [OWNER] «вот это в ДИДМИ продукта зачем? ... ЗАЧЕМ МНЕ ЭТа ИНФОРМАЦИЯ? ... ✅ работает без KAIF», «вот это тоже нахуй все такое поудаляй из ридми · 🚧 приёмка на основном профиле» (чат). Removed KAIF badges/integration/credits and every 🚧 acceptance marker from README in all three languages. Product documentation now describes only KIMI KRINIK behavior.
- `release-notes/1.0.0/changelog.{en,ru,zh}.md` is ready with the neutral factual title `KIMI KRINIK 1.0.0`. Independent semantic review is resolved and voice/link checks are green.
- ❓ `interviews/interview_001_kimi_krinik_1_0_0_release.md` remains unanswered in the owner queue: A = install build 19 and publish after green acceptance, B = install only, C = do not install. The page was shown and called, then timed out. No installation or publication is authorized yet.
- Closure debt: final Desktop E2E smoke passed 1/1 (`core-turn.spec.ts`, 46.3s), full extension 607/1, typecheck/lint/build and voice/link checks green. Final judge and final commit/push are recorded below after execution. The earlier force-closed README/judge debts were paid in this chat.
- [OWNER] challenged an unsupported multiline dash: the comparison cells now say `standard Markdown whitespace` instead of claiming the feature is absent. KAIF and all acceptance markers were removed by the owner's direct instruction.

## Where we are now

Main and origin/main are synchronized before the closing commit. The release candidate is `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix`, SHA-256 `8ef5b5e37606ca9de1a6c96f97e68eb5ea8e3f8327730416a912db9b031f405d`. The extension has 607 passed / 1 skipped and 0 failures. No GitHub Release exists and no build-19 main-profile installation has been performed.

## ❓ Awaiting human review

- `interviews/interview_001_kimi_krinik_1_0_0_release.md` Q1 — installation and publication decision. The owner has not answered.
- `GOAL.md` owner confirmation, B9 changelog mechanism and B10 shared `kimi.*` namespace remain open organizational questions, not reasons to start new work during closure.

## Where to continue next session

1. Run `/skill:resume`, read the interview and the current answer. If A: install build 19 on the main profile and finish the remaining accumulated-profile acceptance. If B: install only and report without publishing. If C: leave the main profile on build 14 and stop the release path.
2. Publish only with explicit owner `AUTH:` and only after green real-world acceptance: tag `v1.0.0`, attach `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix`, use `release-notes/1.0.0/changelog.{en,ru,zh}.md`, then open and read the published page.
3. If the answer is still absent, do not install or publish. Next clear work is real VSIX preflight verification for `bugs/29`, then accumulated-profile acceptance of `bugs/12`, `bugs/13`, `bugs/15`, `bugs/20`, `bugs/22` and `bugs/24` when the owner prioritizes it.
4. `bugs/11` stays parked by the owner's Pareto direction; resume only with new deterministic evidence. Do not start `ideas/02` before 1.0.0 is released. `ideas/03` is the next development cut after the release path.

## Open bugs

- 🔧 `bugs/29_preflight_error_deletes_unrelated_history.md` — deterministic regressions and full suite pass; real VSIX preflight path pending.
- 🔴 `bugs/11_steer_delivery_and_immediate_display.md` — repeated owner symptom, three isolated non-reproductions; parked with evidence, not DONE.
- 🔧 `bugs/19_tool_cards_hide_working_state.md`, `bugs/18_reentrant_prompt_internal_error.md`, `bugs/16_steer_avatar_precedes_user_bubble.md` — isolated paths pass; original main-profile paths pending.
- 🔧 `bugs/27_effort_persistence_and_localization.md`, `bugs/26_sound_off_disables_dropdown.md`, `bugs/25_first_prompt_assistant_message_flicker.md`, `bugs/22_first_send_stuck_in_steering_queue.md`, `bugs/24_glass_preview_silent.md`, `bugs/20_queue_steer_duplicate_submission.md` — isolated fixes pass; accumulated main-profile acceptance pending.
- 🔧 `bugs/12_steer_composer_restores_previous_text.md`, `bugs/13_steer_attachments_and_thumbnails.md`, `bugs/14_steer_queue_not_added.md`, `bugs/15_hook_results_visible_in_chat.md` — isolated paths pass; accumulated main-profile acceptance pending.
- 🔧 `bugs/04_frozen_prompt_windows_path.md` — Windows 123/123; Linux CI row unrun because WSL/Docker are unavailable.
- 🔧 `bugs/KAIF/04` / upstream #204 and `bugs/KAIF/05` / upstream #206 — framework-local issues remain open until origin updates absorb them.
- 🔴 `bugs/152` (KAIF origin) — «Starting Kimi Code…» not reproduced; 🟠 `bugs/151` — follow-up steer race, live acceptance left.

KNOWLEDGE: real threshold delivery is recorded in `bugs/28_DONE_context_window_control_empty_skills_rejected.md` and `testcases/reports/2026-11-25_context_window_steer_delivery.md`; sticky presentation/research is in `plans/03_sticky_viewport_prompt.md` and `researches/57_sticky_prompt_presentation.md`; preflight ownership is in `bugs/29_preflight_error_deletes_unrelated_history.md`; completed session history moved verbatim into `PROJECT_HISTORY.md`.

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md`, `KIMI CODE LOGO/GPT ROBOT REFERENCES/` and `interviews/decisions/`; do not sweep them into a commit.
