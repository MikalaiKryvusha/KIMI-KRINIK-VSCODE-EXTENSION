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

2026-11-27 00:18 +03:00 — the owner ordered code analysis, written fix/acceptance plans, implementation and iterative testing for every named release blocker. `researches/59_release_blocker_remediation.md`, `plans/04_EPIC_release_blocker_remediation.md` and Phase 1 `plans/05_epic04_phase1_steering_attention.md` define the evidence ladder: `bugs/44`–`46`, five Act findings, then `bugs/25`/`11`, then final hardening. Phase 1 first tests the previously uncovered accepted-running-steer → old-terminal → new-`turn.started` ordering. Planning changed no production code.
[OWNER] «Проводим по всем анализ кода, пишем план починки и приемки исправления тестами. Фиксим. Тестируем. Закрываем как исправленное, если тесты проходят. Если тесты не проходят - чиним дальше.» · 2026-11-27 00:07 +03:00 (chat)

2026-11-27 01:26 +03:00 — `bugs/44` isolated acceptance passes on packaged build 49. Three lifecycle gaps were fixed with six new regressions: accepted-before-start, pending accepted/blocked and host accepted/blocked. Full extension is 664 passed / 1 skipped; typecheck, lint and VSIX audit are green. Immediate and accepted-queued `/compact` sequences emit zero completion/audio during work and exactly one at idle. Synthetic play rejects `NotAllowedError`, so audible output and accumulated main-profile acceptance remain open; the bug is not DONE. Evidence: `testcases/reports/2026-11-27_steer_completion_attention_build49.md`. Next: `bugs/45`, then `bugs/46`.

2026-11-27 01:49 +03:00 — `bugs/45` isolated acceptance passes on build 50. The red frame came from an early `steerChat` fallback while the ordinary prompt was in preflight; `chat.handler` now waits for the original turn to start. Bridge-handler 39/39, full extension 666/1, typecheck, lint and VSIX audit green. Immediate and queued paths have zero error events/frames; genuine `compaction.unable` remains visible with Retry. Accumulated main-profile acceptance remains open. Next: `bugs/46` first/warmed audio measurements. Evidence: `testcases/reports/2026-11-27_steer_transient_error_build50.md`.

2026-11-27 02:05 +03:00 — `bugs/46` is not reproduced on packaged EN/RU/ZH previews: every measured `playing` starts at zero, EN first/warmed and RU complete fully, and source/installed hashes match. No readiness or audio-source change is justified. DroidCam records silence and FFmpeg has no WASAPI loopback, so the original audible accumulated-profile symptom remains open. Phase 1 proceeds to the five Act findings with this explicit caveat. Evidence: `testcases/reports/2026-11-27_attention_audio_first_play.md`.

2026-11-27 02:27 +03:00 — independent judge found a same-turn completion loss; a new red regression reproduced it and build 51 fixes dedup re-arm only for the deferred terminal. Runtime is 53/53 and full extension 667/1 with typecheck/lint/VSIX audit green. Build-51 immediate and accepted-queued sequences again emit zero completion/audio during work and one at idle. RU warmed-second playback also completes at source duration. Accumulated main and audible output remain open. Next: five Act findings. Evidence: `testcases/reports/2026-11-27_steer_completion_attention_build51.md`.

2026-11-27 03:00 +03:00 — Phase 2 logical cut: `context-blocked-retry` and `queue-accepted-resubmission` are fixed with red-before public regressions. Runtime+controller 60/60, status pills 16/16, full extension 670/1, typecheck, lint, build-53 audit and Extension Host smoke green. Accepted items remain visible until durable start but cannot be selected or lightning-submitted twice. Remaining: `secondary-primary-default`, `sound-default-manifest`, `model-picker-enter-bubbling`, packaged guest and accumulated-main acceptance. Evidence: `testcases/reports/2026-11-27_phase2_context_queue.md`.

2026-11-27 03:15 +03:00 — closure handover: `f3c90f43f` is pushed with build 53 installed on main and isolated profiles. Phase 1 is complete with caveats, and two of five Act findings are fixed with 76/76 targeted checks, full extension 670/1, typecheck, lint, VSIX audit and Extension Host smoke. Next session: start `plans/06_epic04_phase2_act_findings.md` at §4.3 `secondary-primary-default`, then §4.4 sound manifest and §4.5 model-picker Enter. After that run packaged guest acceptance for the context/queue fixes, then `bugs/25`/`11`. Accumulated main-profile and audible-output acceptance remain open; no release or Marketplace publication exists.

2026-11-27 09:27 +03:00 — `secondary-primary-default` is fixed at the real public BridgeHandler boundary. Both new cases were red with primary A written before secondary persistence, then bridge+Control Panel 73/73, typecheck and lint passed. Global B/resumed A now stay untouched on secondary-only success and failure; deliberate primary and mixed saves keep their path. Packaged guest/main functional acceptance remains open. Next: §4.4 sound manifest, then §4.5 model-picker Enter. Evidence: `testcases/reports/2026-11-27_phase2_secondary_primary.md`.

2026-11-27 09:44 +03:00 — `sound-default-manifest` is fixed and functionally verified on packaged build 54. Build-53 fresh host and manifest checks were red with Voice/Voice/Voice/Off; build-54 fresh Extension Host printed Glass/Voice/Alert/Chime and opened the webview. Affected 69/69, typecheck, lint and package audit pass. Build 54 is installed on main/isolated with matching manifests and hashes; main was not reloaded and audible output was not measured. Next: §4.5 model-picker Enter. Evidence: `testcases/reports/2026-11-27_phase2_sound_defaults.md`.

## ❓ Awaiting human review

- GitHub and Marketplace publication are owner-authorized only after green readiness gates. Current publication is blocked by the audit's five Act findings and the fresh `bugs/25` disappearance recurrence. Verbatim decisions: `interviews/interview_001_kimi_krinik_1_0_0_release.md`.
- `GOAL.md` owner confirmation, B9 changelog mechanism and B10 shared `kimi.*` namespace remain open organizational questions, not reasons to start new work during closure.
- Marketplace recon is complete in `researches/58_vscode_marketplace_publication.md`: self-service publication is technically feasible. The owner subsequently authorized preparation and publication after green gates. The independent `apps/vscode/README.md` and own CHANGELOG are written; privacy/support presentation, the universal-publish path and owner/publisher/OIDC setup still need completion. No Marketplace publication has occurred.

## Where to continue next session

1. DONE on isolated build 49: `bugs/44` immediate and accepted-queued event sequences pass; accumulated main-profile and audible-output acceptance remain open. Evidence: `testcases/reports/2026-11-27_steer_completion_attention_build49.md`.
2. DONE on isolated build 50: `bugs/45` preflight/fallback red flash is fixed through the real BridgeHandler with 39/39 and 666/1 tests; immediate/queued paths show no error and genuine `compaction.unable` remains visible with Retry. Accumulated main-profile acceptance remains open. NEXT: implement the `bugs/46` readiness experiment (first vs warmed playback, `currentTime`, rejection and audible output) before deciding whether any delay belongs in playback or source audio.
3. NEXT: finish `model-picker-enter-bubbling` in `plans/06_epic04_phase2_act_findings.md`, then packaged acceptance for the fixed context/queue/secondary mechanisms and the `bugs/25` frame-level recurrence on the accumulated main profile. `bugs/46` is not reproduced on packaged EN/RU/ZH previews; no readiness/audio change is justified, while the original audible accumulated-profile symptom remains open.
4. Implement owner-requested `ideas/04_pointer_cursor_for_chat_controls.md` / GitHub issue #35 after the active blockers: all eight named controls, including floating scroll-to-bottom, must show `cursor: pointer` and pass real installed-VSIX hover/click acceptance.
5. Rebuild the final universal+target VSIX set only after fixes. Run full tests, typecheck, lint, package audits and judge before release unless the owner explicitly waives it again. Commit and push verified pieces. Only then ask the owner to reload VS Code and start a fresh `resume` session for accumulated-profile acceptance per `HOUSE_RULES.md` R7. Publish GitHub `v1.0.0` and Marketplace only after all gates pass; the 123 legacy remote tags remain untouched.

## Open bugs

Public backlog: all 30 open product bugs and 3 open ideas are linked to KIMI KRINIK GitHub issues #1–32 and #35; the two Act context/queue findings are #33–34. Issue creation and post-fix comments follow `HOUSE_RULES.md` R9; framework-only defects stay in the KAIF tracker.

- 🔧 `bugs/37_sticky_shows_visible_message.md` — visible prompts no longer enter the sticky; direct user-bubble-bottom selection verified on isolated build 40; main-profile acceptance pending.
- 🔧 `bugs/38_sticky_container_bottom_padding.md`, `bugs/39_sticky_collapsed_second_line_fade.md` — 8px bottom padding and a softer second-line fade verified on isolated build 40; main-profile acceptance pending.
- 🔧 `bugs/40_control_panel_on_off_case_and_tint.md` — uppercase «ВКЛ»/«ВЫКЛ» with green/red tint verified on isolated build 40 in EN/RU/ZH; main-profile acceptance pending.
- 🔧 `bugs/41_sticky_appearance_and_switch_animation.md`, `bugs/42_subagent_button_label.md`, `bugs/43_sticky_chevron_centering.md` — smooth sticky animations, «Субагенты» label and centered chevron verified on isolated build 42; main-profile acceptance pending.
- 🔧 `bugs/36_assistant_text_action_scope.md` — per-text Copy/Fork placement, adjacent-only copying and custom message tooltips verified on isolated build 36; accumulated main-profile acceptance pending.
- 🔧 `bugs/35_attachment_composer_chat_race.md` — deferred-acknowledgement cleanup fixed; isolated build 37 passed before/after frame traces, failure restoration, completion and replay; accumulated main-profile acceptance pending.
- ✅ `bugs/34_DONE_refresh_marker_write_lost.md` — root cause found: the 21:09 write was claimed in chat but never executed (the wire log has no Write call at 21:09; only 18:04/18:56/21:15). The timer and the refresh-witness hunt were right; no product defect. Controlled Write-tool write persisted and was read back. Lesson in EXP-0025.
- 🔧 `bugs/30_sticky_prompt_visible_at_chat_start.md`, `bugs/32_steer_working_indicator_jumps.md` — isolated build-25 acceptance passed; `bugs/31_expanded_sticky_scroll_oscillation.md` includes the revised scroll contract and one-line no-fade/no-collapse boundary, verified on isolated build 38; main-profile acceptance pending.
- ✅ `bugs/29_DONE_preflight_error_deletes_unrelated_history.md` — real packaged-VSIX preflight error verified: all prior turns and the newer steering entry survive, the inline error shows with Retry (`testcases/reports/2026-11-26_build_43_preflight_error_history.md`).
- 🔴 `bugs/11_steer_delivery_and_immediate_display.md` — repeated owner symptom, three isolated non-reproductions; parked with evidence, not DONE.
- 🔧 `bugs/19_tool_cards_hide_working_state.md`, `bugs/18_reentrant_prompt_internal_error.md`, `bugs/16_steer_avatar_precedes_user_bubble.md` — isolated paths pass; original main-profile paths pending.
- 🔴 `bugs/25_first_prompt_assistant_message_flicker.md` — fresh owner-observed disappearance during closure: the first progress message vanished while a later closure message remained; another disappearance followed. Running build/cause unverified; frame-level main-profile reproduction is a release blocker. `bugs/15_hook_results_visible_in_chat.md` — isolated build-22 fixes passed, accumulated acceptance pending.
- 🔧 `bugs/44_steer_turn_complete_attention.md` / KIMI KRINIK issue #1 — isolated build-49 immediate and accepted-queued acceptance passes with 52/52 runtime and 664/1 full tests, typecheck, lint and VSIX audit green. Accumulated main-profile and audible-output acceptance remain open; not DONE.
- 🔧 `bugs/45_steer_transient_error_flash.md` / KIMI KRINIK issue #31 — isolated build-50 immediate/queued paths show no red error; the preflight/fallback race is fixed with real BridgeHandler regressions, full 666/1, typecheck and lint green. Genuine failures remain visible. Accumulated main-profile acceptance pending.
- 🔬 `bugs/46_attention_audio_start_clipped.md` / KIMI KRINIK issue #32 — packaged EN/RU/ZH previews start at `currentTime=0`; EN first/warmed and RU complete, no readiness defect reproduced. Source/installed hashes match; no code/audio change. Original audible accumulated-profile symptom remains open.
- 🔧 `bugs/27_effort_persistence_and_localization.md`, `bugs/26_sound_off_disables_dropdown.md`, `bugs/22_first_send_stuck_in_steering_queue.md`, `bugs/24_glass_preview_silent.md`, `bugs/20_queue_steer_duplicate_submission.md` — isolated fixes pass; accumulated main-profile acceptance pending.
- 🔧 `bugs/12_steer_composer_restores_previous_text.md`, `bugs/13_steer_attachments_and_thumbnails.md`, `bugs/14_steer_queue_not_added.md` — isolated paths pass; accumulated main-profile acceptance pending.
- 🔧 `bugs/04_frozen_prompt_windows_path.md` — Windows 123/123; Linux CI row unrun because WSL/Docker are unavailable.
- 🔧 `bugs/KAIF/04` / upstream #204 and `bugs/KAIF/05` / upstream #206 — framework-local issues remain open until origin updates absorb them.
- 🔧 `bugs/KAIF/06` / upstream #207 — completed closures now suppress automatic canon refresh locally and in the KAIF source; 20/20 hook checks, real-wire replay, build and full affected `s14` pass. Full origin core is 25/28 and hooks-mutants 33/34 with unrelated baseline `W9`/`s01`/`s22` failures; adversarial judge is pending.
- 🔴 `bugs/152` (KAIF origin) — «Starting Kimi Code…» not reproduced; 🟠 `bugs/151` — follow-up steer race, live acceptance left.

KNOWLEDGE: the complete independent release review, all skeptic verdicts, coverage and execution order are in `reports/KAIF_AUDIT/2026-11-26_kimi_krinik_1_0_0_SUMMARY.md` and its family cards; the self-host reload incident and safe route are in `HOUSE_RULES.md` R7 / EXP-0026; the fresh message-disappearance recurrence is in `bugs/25`; Marketplace feasibility and the owner's publication decision are in `researches/58` and `interviews/interview_001`; turn-scoped identity is in `bugs/25` / EXP-0022; assistant action ownership is in `bugs/36`; media/composer timing is in `bugs/35`; the revised sticky contract is in `plans/03` and `bugs/31`; per-skill decisions are in `interviews/interview_002_engine_skills.md` and `HOUSE_RULES.md` R6; nested-webview clipboard testing is in EXP-0023; completed-closure refresh suppression is in `bugs/KAIF/06` / origin `bugs/160`; steering completion-attention expectations are in `bugs/44` / issue #1; the one-active-subagent cap is `HOUSE_RULES.md` R8; dual local+GitHub registration is R9; completion lifecycle is `bugs/44` / EXP-0029; preflight red-flash identity is `bugs/45`; first/warmed audio measurement is `bugs/46`; blocked context retry and accepted queue state are `plans/06` / `testcases/reports/2026-11-27_phase2_context_queue.md`; closure and test-environment lessons are EXP-0027/EXP-0028.

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md`, `KIMI CODE LOGO/GPT ROBOT REFERENCES/` and `interviews/decisions/`; do not sweep them into a commit.
