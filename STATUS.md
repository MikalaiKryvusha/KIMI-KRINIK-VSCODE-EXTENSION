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

### 2026-11-25 20:35 +03:00 — SOFT CLOSURE: build 25 verified; handover to the next chat
- Build 25 is implemented, installed on the main profile and verified on isolated VS Code. Commits through `27ee17990` are pushed to `main`; `bugs/33` is DONE and SDK `session-skills` is 14/14. Extension suite is 621 passed / 1 skipped; typecheck, root lint, build, static audit and voice checks are green.
- Post-closure verification: named chat/event-adapter suites passed 39/39, and a fresh build-25 prompt left `K25 final smoke answer` visible with invisible hook text and the same payload in model input. `test debt: none` after the documented direct-node waiver; evidence is appended to `testcases/reports/2026-11-25_build_25_ui_acceptance.md`.
- Main-profile running-build acceptance is the first next step: restart VS Code to load build 25 and verify the accumulated world. `bugs/29` is the next clear technical verification after it. Publication remains unauthorized and requires separate owner `AUTH:`.

## Where we are now

The current release candidate is `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix`, SHA-256 `5c493b98e4d56d4356315858aecee5573a05664ea2d4631d12f8fb0811ad9d04`. The extension has 621 passed / 1 skipped and 0 failures. Build 25 is installed on the main profile: manifest `buildNumber: 25`, with source/installed extension and webview hashes matching. No GitHub Release exists.

## ❓ Awaiting human review

- Publication of `v1.0.0` still requires the owner's separate `AUTH:`. `interviews/interview_001_kimi_krinik_1_0_0_release.md` Q1 was answered B (installation only); no publication is authorized.
- `GOAL.md` owner confirmation, B9 changelog mechanism and B10 shared `kimi.*` namespace remain open organizational questions, not reasons to start new work during closure.

## Where to continue next session

1. On the accumulated main profile restart VS Code to load build 25, then verify the owner scenarios in `testcases/reports/2026-11-25_build_25_ui_acceptance.md` and `testcases/reports/2026-11-25_chat_rendering_build_22.md`. Do not publish without separate owner `AUTH:`.
2. Publish only with explicit owner `AUTH:` and only after green real-world acceptance: tag `v1.0.0`, attach `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix`, use `release-notes/1.0.0/changelog.{en,ru,zh}.md`, then open and read the published page.
3. Next clear work is real VSIX preflight verification for `bugs/29`, then accumulated-profile acceptance of `bugs/12`, `bugs/13`, `bugs/15`, `bugs/20`, `bugs/22` and `bugs/24` when the owner prioritizes it. `bugs/33` is DONE.
4. `bugs/11` stays parked by the owner's Pareto direction; resume only with new deterministic evidence. `ideas/02` is implemented and isolated-verified on build 25; main-profile acceptance is pending. `ideas/03` is the next development cut after the release path.

## Open bugs

- 🔧 `bugs/30_sticky_prompt_visible_at_chat_start.md`, `bugs/31_expanded_sticky_scroll_oscillation.md`, `bugs/32_steer_working_indicator_jumps.md` — isolated packaged build-25 acceptance passes; accumulated main-profile running-build acceptance pending.
- 🔧 `bugs/29_preflight_error_deletes_unrelated_history.md` — deterministic regressions and full suite pass; real VSIX preflight path pending.
- 🔴 `bugs/11_steer_delivery_and_immediate_display.md` — repeated owner symptom, three isolated non-reproductions; parked with evidence, not DONE.
- 🔧 `bugs/19_tool_cards_hide_working_state.md`, `bugs/18_reentrant_prompt_internal_error.md`, `bugs/16_steer_avatar_precedes_user_bubble.md` — isolated paths pass; original main-profile paths pending.
- 🔧 `bugs/25_first_prompt_assistant_message_flicker.md`, `bugs/15_hook_results_visible_in_chat.md` — isolated build-22 live and replay fixes pass; accumulated main-profile running-build acceptance pending.
- 🔧 `bugs/27_effort_persistence_and_localization.md`, `bugs/26_sound_off_disables_dropdown.md`, `bugs/22_first_send_stuck_in_steering_queue.md`, `bugs/24_glass_preview_silent.md`, `bugs/20_queue_steer_duplicate_submission.md` — isolated fixes pass; accumulated main-profile acceptance pending.
- 🔧 `bugs/12_steer_composer_restores_previous_text.md`, `bugs/13_steer_attachments_and_thumbnails.md`, `bugs/14_steer_queue_not_added.md` — isolated paths pass; accumulated main-profile acceptance pending.
- 🔧 `bugs/04_frozen_prompt_windows_path.md` — Windows 123/123; Linux CI row unrun because WSL/Docker are unavailable.
- 🔧 `bugs/KAIF/04` / upstream #204 and `bugs/KAIF/05` / upstream #206 — framework-local issues remain open until origin updates absorb them.
- 🔴 `bugs/152` (KAIF origin) — «Starting Kimi Code…» not reproduced; 🟠 `bugs/151` — follow-up steer race, live acceptance left.

KNOWLEDGE: build-25 isolated acceptance is in `testcases/reports/2026-11-25_build_25_ui_acceptance.md`; skill metadata projection is in `ideas/02_control_panel_skill_picker.md`; sticky requirements are in `plans/03_sticky_viewport_prompt.md`; steering order is in `bugs/32_steer_working_indicator_jumps.md`; preflight ownership is in `bugs/29_preflight_error_deletes_unrelated_history.md`; the old Windows SDK test issue is closed in `bugs/33_DONE_skill_variant_windows_path_separator_test.md`.

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md`, `KIMI CODE LOGO/GPT ROBOT REFERENCES/` and `interviews/decisions/`; do not sweep them into a commit.
