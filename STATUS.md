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

### 2026-11-26 03:17 +03:00 — BUILD 39 COMPLETES THE CURRENT UI REFINEMENTS
- Skill-dialog margins are 48px; Welcome robot ↔ KIMI spacing is 24px and header spacing is 12px. General Settings renders On/Off on separate lines in EN/RU/ZH.
- Build 39 SHA-256: `ad8f87a544e3738e6dd5b6b5e71e117da7e3079741c3e47d423173e8579316d5`; installed on main and isolated profiles. Full extension: 650 passed / 1 skipped; lint, typecheck, build and VSIX audit are green.
- Isolated WebP/geometry passed for Welcome, the header, the 42-skill dialog and every RU General Settings row. Evidence: `testcases/reports/2026-11-26_build_39_ui_refinements.md` and WebP 108/111/112/113 in `.tmp/k5-vscode/`.
- Builds 34–38 covered header/Compact, per-text assistant actions, media/composer atomicity and one-line sticky behavior. Main-window Reload Window automation failed; accumulated running-profile acceptance remains pending. Dayloop is active; no release publication is authorized.

## Where we are now

The current release candidate is `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix`, SHA-256 `ad8f87a544e3738e6dd5b6b5e71e117da7e3079741c3e47d423173e8579316d5`. The extension has 650 passed / 1 skipped and 0 failures. Build 39 is installed on main and isolated profiles; isolated functional acceptance passed, while main running-profile acceptance is pending. No GitHub Release exists.

## ❓ Awaiting human review

- Publication of `v1.0.0` still requires the owner's separate `AUTH:`. `interviews/interview_001_kimi_krinik_1_0_0_release.md` Q1 was answered B (installation only); no publication is authorized.
- `GOAL.md` owner confirmation, B9 changelog mechanism and B10 shared `kimi.*` namespace remain open organizational questions, not reasons to start new work during closure.

## Where to continue next session

1. Reload the accumulated main profile onto build 39 and observe the pending header, assistant actions, media race, skill, General Settings and sticky acceptance paths. Record results in a new run report.
2. Investigate `bugs/34_refresh_marker_write_lost.md`, then run real VSIX preflight verification for `bugs/29`.
3. Publish only with explicit owner `AUTH:` and only after green real-world acceptance: tag `v1.0.0`, attach the verified VSIX, use `release-notes/1.0.0/changelog.{en,ru,zh}.md`, then open and read the published page.

## Open bugs

- 🔧 `bugs/36_assistant_text_action_scope.md` — per-text Copy/Fork placement, adjacent-only copying and custom message tooltips verified on isolated build 36; accumulated main-profile acceptance pending.
- 🔧 `bugs/35_attachment_composer_chat_race.md` — deferred-acknowledgement cleanup fixed; isolated build 37 passed before/after frame traces, failure restoration, completion and replay; accumulated main-profile acceptance pending.
- 🔴 `bugs/34_refresh_marker_write_lost.md` — owner-priority investigation into the lost refresh-marker update; timer matches the stale file, culprit not yet assigned.
- 🔧 `bugs/30_sticky_prompt_visible_at_chat_start.md`, `bugs/32_steer_working_indicator_jumps.md` — isolated build-25 acceptance passed; `bugs/31_expanded_sticky_scroll_oscillation.md` includes the revised scroll contract and one-line no-fade/no-collapse boundary, verified on isolated build 38; main-profile acceptance pending.
- 🔧 `bugs/29_preflight_error_deletes_unrelated_history.md` — deterministic regressions and full suite pass; real VSIX preflight path pending.
- 🔴 `bugs/11_steer_delivery_and_immediate_display.md` — repeated owner symptom, three isolated non-reproductions; parked with evidence, not DONE.
- 🔧 `bugs/19_tool_cards_hide_working_state.md`, `bugs/18_reentrant_prompt_internal_error.md`, `bugs/16_steer_avatar_precedes_user_bubble.md` — isolated paths pass; original main-profile paths pending.
- 🔧 `bugs/25_first_prompt_assistant_message_flicker.md` — late-delta routing and duplicate reconciliation fixed; build-33 held-steer isolated run preserved the original assistant with no disappearance; accumulated main-profile observation pending. `bugs/15_hook_results_visible_in_chat.md` — isolated build-22 fixes passed, accumulated acceptance pending.
- 🔧 `bugs/27_effort_persistence_and_localization.md`, `bugs/26_sound_off_disables_dropdown.md`, `bugs/22_first_send_stuck_in_steering_queue.md`, `bugs/24_glass_preview_silent.md`, `bugs/20_queue_steer_duplicate_submission.md` — isolated fixes pass; accumulated main-profile acceptance pending.
- 🔧 `bugs/12_steer_composer_restores_previous_text.md`, `bugs/13_steer_attachments_and_thumbnails.md`, `bugs/14_steer_queue_not_added.md` — isolated paths pass; accumulated main-profile acceptance pending.
- 🔧 `bugs/04_frozen_prompt_windows_path.md` — Windows 123/123; Linux CI row unrun because WSL/Docker are unavailable.
- 🔧 `bugs/KAIF/04` / upstream #204 and `bugs/KAIF/05` / upstream #206 — framework-local issues remain open until origin updates absorb them.
- 🔴 `bugs/152` (KAIF origin) — «Starting Kimi Code…» not reproduced; 🟠 `bugs/151` — follow-up steer race, live acceptance left.

KNOWLEDGE: turn-scoped identity is in `bugs/25` / EXP-0022; assistant action ownership is in `bugs/36`; media/composer timing is in `bugs/35`; the revised sticky contract and new one-line boundary are in `plans/03` and `bugs/31`; latest evidence is in `testcases/reports/2026-11-26_build_36_assistant_text_actions.md`, `2026-11-26_build_37_media_composer_atomicity.md` `2026-11-26_build_38_sticky_single_line.md` and `2026-11-26_build_39_ui_refinements.md`; per-skill decisions are in `interviews/interview_002_engine_skills.md` and `HOUSE_RULES.md` R6.

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md`, `KIMI CODE LOGO/GPT ROBOT REFERENCES/` and `interviews/decisions/`; do not sweep them into a commit.
