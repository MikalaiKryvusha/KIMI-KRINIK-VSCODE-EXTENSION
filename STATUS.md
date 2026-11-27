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

2026-11-26 release-preparation history moved verbatim to `PROJECT_HISTORY.md`.

2026-11-27 release-remediation Phase 1–2 history moved verbatim to `PROJECT_HISTORY.md`; the current handover remains below.

2026-11-27 11:34 +03:00 — PARKED before Phase 3 instrumentation: the context contour crossed 75% and reported 79%, so no new heavy task starts. Phase 2 commit `fb58a48fc` is pushed; issues #33/#34 are closed. Fake model and isolated VS Code are stopped cleanly; no product scenario is running. Next session starts `plans/07_epic04_phase3_message_visibility_steering.md` §4.1 positive smoke/frame observer, then §4.2 races; owner idea 04 pointer cursors remains queued after it. Build 55 is installed on main without reload; no release or Marketplace publication exists.

2026-11-27 11:59 +03:00 — SOFT CLOSURE handover: closed Phase 1–2 entries moved verbatim to `PROJECT_HISTORY.md`; STATUS now contains only the current release handover and open bugs. EXP-0024 gained the non-destructive isolated close-window/PID route; no duplicate lesson remains. README's EN/RU/ZH build example is 55. Final lint, extension/webview typecheck, full extension 676/1, build and voice-lint pass; independent README §7B/7E is PASS. Phase 3 and owner idea 04 remain open for the next chat.

2026-11-27 13:31 +03:00 — Phase 3 §4.1–4.3 is PASS on packaged build 57. The late-acknowledgement stuck Working (`bugs/47`, issue #36) and permanent response B→C replacement (`bugs/25`) have red-before fixes; B and C now remain in separate assistants through idle and replay, and the running→idle boundary is exactly once. Full extension is 679/1, typecheck, lint and build-57 VSIX audit pass; build 57 is installed on main and isolated. Report: `testcases/reports/2026-11-27_phase3_message_visibility.md`. Owner idea 04 is next; accumulated-main and audible acceptance remain pending, so production DONE and release are not claimed.

2026-11-27 13:56 +03:00 — Owner idea 04 is DONE on installed build 58: all eight named controls show computed `cursor: pointer` and passed real mouse hover/click, including floating scroll-to-bottom and Send/Stop with provider abort evidence. Red-before style regressions now pass; full extension is 682/1, typecheck, lint and build-58 VSIX audit pass. Report: `testcases/reports/2026-11-27_pointer_chat_controls.md`. Final universal+target VSIX gates are next; accumulated-main and release acceptance remain open.

2026-11-27 14:03 +03:00 — OWNER RELEASE DECISION: proceed with KIMI KRINIK 1.0.0 for GitHub and VS Code Marketplace with an explicit Known issues section and links to future GitHub fixes. Open issues are not represented as fixed and no longer block this release by the owner's direct word; packaging, documentation accuracy, artifact integrity and publication verification still must pass. Both releases must occur in this chat or the immediately following chat at the latest. Verbatim decisions: `interviews/interview_001_kimi_krinik_1_0_0_release.md` → «Release with documented Known issues» and «Release window».

2026-11-27 14:09 +03:00 — Final build 59 package gates are green: six target VSIX packages plus universal pass static/import audit; win32-x64 and universal fresh Extension Host smoke both open the webview with correct sound defaults. Full extension is 682/1, typecheck and lint pass. Build 59 is installed on main and isolated. GitHub/Marketplace release documentation with Known issues is next.

2026-11-27 14:57 +03:00 — Release documentation is ready: root/Marketplace README, CHANGELOG and EN/RU/ZH notes carry build identity, the current steering/pointer deltas and an explicit Known issues section with GitHub links. Voice-lint is green and the independent §7B reviewer returns VERIFIED after all findings were fixed. `.tmp/kimi-krinik-1.0.0-release-notes.md` combines the three languages for GitHub. Control build is next; no publication has occurred yet.

2026-11-27 15:02 +03:00 — Control build 60 is green: lint, typecheck, full extension 682/1, six-target and universal package audits pass. README build example is 60 and voice-lint remains green. Adversarial release judge is next before commit/push and publication.

## ❓ Awaiting human review

- GitHub `v1.0.0` and Marketplace publication are owner-authorized with documented Known issues after packaging, documentation, artifact and publication checks. Open issues remain visible as future work, not hidden or called fixed. Verbatim decisions: `interviews/interview_001_kimi_krinik_1_0_0_release.md`.
- `GOAL.md` owner confirmation, B9 changelog mechanism and B10 shared `kimi.*` namespace remain open organizational questions, not reasons to start new work during closure.
- Marketplace recon is complete in `researches/58_vscode_marketplace_publication.md`: self-service publication is technically feasible. The owner subsequently authorized preparation and publication after green gates. The independent `apps/vscode/README.md` and own CHANGELOG are written; privacy/support presentation, the universal-publish path and owner/publisher/OIDC setup still need completion. No Marketplace publication has occurred.

## Where to continue next session

1. Idea 04 is DONE as `ideas/04_DONE_pointer_cursor_for_chat_controls.md`; close issue #35 with the verified commit after this change is committed and pushed.
2. Rebuild the final universal+target VSIX set and run full tests, typecheck, lint, package audits and judge. Prepare GitHub and Marketplace release documentation with an explicit Known issues section and links to open follow-up issues.
3. Publish GitHub `v1.0.0` and Marketplace under the owner's 2026-11-27 release decision, then open and read the published pages. Accumulated-main acceptance and open issues continue as future-version work; the 123 legacy remote tags remain untouched.

## Open bugs

Public backlog: all 30 open product bugs and 2 open ideas are linked to KIMI KRINIK GitHub issues #1–32 and #35; the two Act context/queue findings are #33–34. Idea 04 is DONE and issue #35 is ready to close with its verified commit. Issue creation and post-fix comments follow `HOUSE_RULES.md` R9; framework-only defects stay in the KAIF tracker.

- 🔧 `bugs/37_sticky_shows_visible_message.md` — visible prompts no longer enter the sticky; direct user-bubble-bottom selection verified on isolated build 40; main-profile acceptance pending.
- 🔧 `bugs/38_sticky_container_bottom_padding.md`, `bugs/39_sticky_collapsed_second_line_fade.md` — 8px bottom padding and a softer second-line fade verified on isolated build 40; main-profile acceptance pending.
- 🔧 `bugs/40_control_panel_on_off_case_and_tint.md` — uppercase «ВКЛ»/«ВЫКЛ» with green/red tint verified on isolated build 40 in EN/RU/ZH; main-profile acceptance pending.
- 🔧 `bugs/41_sticky_appearance_and_switch_animation.md`, `bugs/42_subagent_button_label.md`, `bugs/43_sticky_chevron_centering.md` — smooth sticky animations, «Субагенты» label and centered chevron verified on isolated build 42; main-profile acceptance pending.
- 🔧 `bugs/36_assistant_text_action_scope.md` — per-text Copy/Fork placement, adjacent-only copying and custom message tooltips verified on isolated build 36; accumulated main-profile acceptance pending.
- 🔧 `bugs/35_attachment_composer_chat_race.md` — deferred-acknowledgement cleanup fixed; isolated build 37 passed before/after frame traces, failure restoration, completion and replay; accumulated main-profile acceptance pending.
- 🔧 `bugs/30_sticky_prompt_visible_at_chat_start.md`, `bugs/32_steer_working_indicator_jumps.md` — isolated build-25 acceptance passed; `bugs/31_expanded_sticky_scroll_oscillation.md` includes the revised scroll contract and one-line no-fade/no-collapse boundary, verified on isolated build 38; main-profile acceptance pending.
- 🔧 `bugs/11_steer_delivery_and_immediate_display.md` — immediate bubbles, distinct response ownership and exactly-once boundary delivery pass on isolated build 57; accumulated main-profile acceptance pending.
- 🔧 `bugs/19_tool_cards_hide_working_state.md`, `bugs/18_reentrant_prompt_internal_error.md`, `bugs/16_steer_avatar_precedes_user_bubble.md` — isolated paths pass; original main-profile paths pending.
- 🔧 `bugs/25_first_prompt_assistant_message_flicker.md` — build 56 reproduced response B being permanently replaced by response C; build 57 preserves both responses through idle and replay with red-before regressions. Accumulated main remains a release blocker. `bugs/15_hook_results_visible_in_chat.md` — isolated build-22 fixes passed, accumulated acceptance pending.
- 🔧 `bugs/47_steer_late_ack_keeps_working.md` / issue #36 — late non-steered acknowledgement resurrected a terminal turn and suppressed idle; red-before regression and build-57 idle/replay acceptance pass, accumulated main pending.
- 🔧 `bugs/44_steer_turn_complete_attention.md` / KIMI KRINIK issue #1 — isolated build-49 immediate and accepted-queued acceptance passes with 52/52 runtime and 664/1 full tests, typecheck, lint and VSIX audit green. Accumulated main-profile and audible-output acceptance remain open; not DONE.
- 🔧 `bugs/45_steer_transient_error_flash.md` / KIMI KRINIK issue #31 — isolated build-50 immediate/queued paths show no red error; the preflight/fallback race is fixed with real BridgeHandler regressions, full 666/1, typecheck and lint green. Genuine failures remain visible. Accumulated main-profile acceptance pending.
- 🔬 `bugs/46_attention_audio_start_clipped.md` / KIMI KRINIK issue #32 — packaged EN/RU/ZH previews start at `currentTime=0`; EN first/warmed and RU complete, no readiness defect reproduced. Source/installed hashes match; no code/audio change. Original audible accumulated-profile symptom remains open.
- 🔧 `bugs/27_effort_persistence_and_localization.md`, `bugs/26_sound_off_disables_dropdown.md`, `bugs/22_first_send_stuck_in_steering_queue.md`, `bugs/24_glass_preview_silent.md`, `bugs/20_queue_steer_duplicate_submission.md` — isolated fixes pass; accumulated main-profile acceptance pending.
- 🔧 `bugs/12_steer_composer_restores_previous_text.md`, `bugs/13_steer_attachments_and_thumbnails.md`, `bugs/14_steer_queue_not_added.md` — isolated paths pass; accumulated main-profile acceptance pending.
- 🔧 `bugs/04_frozen_prompt_windows_path.md` — Windows 123/123; Linux CI row unrun because WSL/Docker are unavailable.
- 🔧 `bugs/KAIF/04` / upstream #204 and `bugs/KAIF/05` / upstream #206 — framework-local issues remain open until origin updates absorb them.
- 🔧 `bugs/KAIF/06` / upstream #207 — completed closures now suppress automatic canon refresh locally and in the KAIF source; 20/20 hook checks, real-wire replay, build and full affected `s14` pass. Full origin core is 25/28 and hooks-mutants 33/34 with unrelated baseline `W9`/`s01`/`s22` failures; adversarial judge is pending.
- 🔴 `bugs/152` (KAIF origin) — «Starting Kimi Code…» not reproduced; 🟠 `bugs/151` — follow-up steer race, live acceptance left.

KNOWLEDGE: the complete independent release review, all skeptic verdicts, coverage and execution order are in `reports/KAIF_AUDIT/2026-11-26_kimi_krinik_1_0_0_SUMMARY.md` and its family cards; the self-host reload incident and safe route are in `HOUSE_RULES.md` R7 / EXP-0026; the fresh message-disappearance recurrence is in `bugs/25`; Marketplace feasibility and the owner's publication decision are in `researches/58` and `interviews/interview_001`; turn-scoped identity is in `bugs/25` / EXP-0022; assistant action ownership is in `bugs/36`; media/composer timing is in `bugs/35`; the revised sticky contract is in `plans/03` and `bugs/31`; per-skill decisions are in `interviews/interview_002_engine_skills.md` and `HOUSE_RULES.md` R6; nested-webview clipboard testing is in EXP-0023; completed-closure refresh suppression is in `bugs/KAIF/06` / origin `bugs/160`; steering completion-attention expectations are in `bugs/44` / issue #1; the one-active-subagent cap is `HOUSE_RULES.md` R8; dual local+GitHub registration is R9; completion lifecycle is `bugs/44` / EXP-0029; preflight red-flash identity is `bugs/45`; first/warmed audio measurement is `bugs/46`; blocked context retry and accepted queue state are `plans/06_DONE` / `testcases/reports/2026-11-27_phase2_act_findings.md`; Phase 3 frame/steering acceptance is `plans/07`; real isolated process restart and stale-CDP lesson are `HOUSE_RULES.md` tools / EXP-0024; closure and test-environment lessons are EXP-0027/EXP-0028.

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md`, `KIMI CODE LOGO/GPT ROBOT REFERENCES/` and `interviews/decisions/`; do not sweep them into a commit.
