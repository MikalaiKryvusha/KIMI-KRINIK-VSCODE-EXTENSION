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

### 2026-11-26 00:17 +03:00 — BUILD 33 INSTALLED; accumulated acceptance remains
- Implemented the owner's skill inventory choices, always-large skill dialog with animated two-clear-line/faded-third descriptions and hover-matched fade, persistent Control Panel ordering, custom General Settings, welcome/model/header/MCP refinements, and sticky preview preservation with smooth max-height/fade animation.
- `bugs/25` now has deterministic fixes for late-turn delta routing and duplicate prompt-only reconciliation; `bugs/31` and `plans/03` record the revised sticky contract. Full extension: 643 passed / 1 skipped; lint, typecheck, build and VSIX static audit are green.
- Build 33 SHA-256: `1924bb5496f708f3e26d1e7812d6af1db634fcf648be625218e4756c4842ed7c`; installed on main and isolated profiles. Build 32 real visual smoke passed: 32px dialog margins, 42 skills with rejected ones absent, no compact toggle, description `60 → 100 → 60px`, welcome robot/KIMI 48px high with 16px gap. Build 33 sticky and accumulated running profile were not observed.
- The final fake-model smoke showed `K29 late original` but did not exercise the held-first-chunk race because the script was already consumed. Next chat must run the real held-response → steer DOM check before closing `bugs/25`. No release publication is authorized.
- `node .kaif/hooks/test-after-code.mjs --status` still printed `test debt: 43` after the final full suite; this session does not claim `test debt: none`. The executed commands and outcomes are in the build-33 report; the hook bookkeeping remains a separate debt.

## Where we are now

The current release candidate is `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix`, SHA-256 `1924bb5496f708f3e26d1e7812d6af1db634fcf648be625218e4756c4842ed7c`. The extension has 643 passed / 1 skipped and 0 failures. Build 33 is installed on main and isolated profiles; its accumulated running-profile acceptance is pending. No GitHub Release exists.

## ❓ Awaiting human review

- Publication of `v1.0.0` still requires the owner's separate `AUTH:`. `interviews/interview_001_kimi_krinik_1_0_0_release.md` Q1 was answered B (installation only); no publication is authorized.
- `GOAL.md` owner confirmation, B9 changelog mechanism and B10 shared `kimi.*` namespace remain open organizational questions, not reasons to start new work during closure.

## Where to continue next session

1. Restart/reload the main Extension Host to load build 33, then observe the accumulated profile: always-large skill dialog and animated descriptions, Control Panel order, custom General Settings, header/MCP labels, and the new sticky preview/animation. Record results beside `testcases/reports/2026-11-26_build_33_release_polish.md`.
2. Close the real `bugs/25` boundary: start a fresh fake model in `hold-after-first` before any request, install the MutationObserver from `.tmp/k29-race-observe.mjs`, send the base prompt, steer while held, then release and read every assistant text frame. The prior smoke only saw the unscripted `K29 late original`; it did not exercise the race.
3. Investigate `bugs/34_refresh_marker_write_lost.md` as the remaining owner-priority machinery bug, then run real VSIX preflight verification for `bugs/29`.
4. Publish only with explicit owner `AUTH:` and only after green real-world acceptance: tag `v1.0.0`, attach the verified VSIX, use `release-notes/1.0.0/changelog.{en,ru,zh}.md`, then open and read the published page.

## Open bugs

- 🔴 `bugs/34_refresh_marker_write_lost.md` — owner-priority investigation into the lost refresh-marker update; timer matches the stale file, culprit not yet assigned.
- 🔧 `bugs/30_sticky_prompt_visible_at_chat_start.md`, `bugs/32_steer_working_indicator_jumps.md` — isolated build-25 acceptance passed; `bugs/31_expanded_sticky_scroll_oscillation.md` has the revised scroll-preservation and animation contract, component-verified with build-33 real observation pending.
- 🔧 `bugs/29_preflight_error_deletes_unrelated_history.md` — deterministic regressions and full suite pass; real VSIX preflight path pending.
- 🔴 `bugs/11_steer_delivery_and_immediate_display.md` — repeated owner symptom, three isolated non-reproductions; parked with evidence, not DONE.
- 🔧 `bugs/19_tool_cards_hide_working_state.md`, `bugs/18_reentrant_prompt_internal_error.md`, `bugs/16_steer_avatar_precedes_user_bubble.md` — isolated paths pass; original main-profile paths pending.
- 🔧 `bugs/25_first_prompt_assistant_message_flicker.md` — late-delta turn routing and prompt-only duplicate reconciliation fixed with deterministic regressions; true held-response VSIX and accumulated-profile observation pending. `bugs/15_hook_results_visible_in_chat.md` — isolated build-22 fixes passed, accumulated acceptance pending.
- 🔧 `bugs/27_effort_persistence_and_localization.md`, `bugs/26_sound_off_disables_dropdown.md`, `bugs/22_first_send_stuck_in_steering_queue.md`, `bugs/24_glass_preview_silent.md`, `bugs/20_queue_steer_duplicate_submission.md` — isolated fixes pass; accumulated main-profile acceptance pending.
- 🔧 `bugs/12_steer_composer_restores_previous_text.md`, `bugs/13_steer_attachments_and_thumbnails.md`, `bugs/14_steer_queue_not_added.md` — isolated paths pass; accumulated main-profile acceptance pending.
- 🔧 `bugs/04_frozen_prompt_windows_path.md` — Windows 123/123; Linux CI row unrun because WSL/Docker are unavailable.
- 🔧 `bugs/KAIF/04` / upstream #204 and `bugs/KAIF/05` / upstream #206 — framework-local issues remain open until origin updates absorb them.
- 🔴 `bugs/152` (KAIF origin) — «Starting Kimi Code…» not reproduced; 🟠 `bugs/151` — follow-up steer race, live acceptance left.

KNOWLEDGE: turn-scoped identity and the steering race are recorded in `bugs/25` and `EXPERIENCE.md` EXP-0022; the revised sticky contract is in `plans/03` and `bugs/31`; build-33 evidence and explicit verification debt are in `testcases/reports/2026-11-26_build_33_release_polish.md`; the owner's per-skill decisions are in `interviews/interview_002_engine_skills.md` and `HOUSE_RULES.md` R6.

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md`, `KIMI CODE LOGO/GPT ROBOT REFERENCES/` and `interviews/decisions/`; do not sweep them into a commit.
