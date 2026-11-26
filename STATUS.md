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

### 2026-11-26 11:40 +03:00 — BUILD 43 + PRE-RELEASE PACKAGE
- `package:platform --universal` now also produces `kimi-code-universal.vsix` (no TargetPlatform) next to the six target packages; universal and all targets pass the static audit. Universal SHA-256: `4b4ef32254eaaa16818ea4c515b69f5cfbe7244f857030d0ae0243dd35fe9c80`; win32-x64 build 43 SHA `3c4c4c1d3b1682c6ad6c8ca690d82799271068a54c60bfad3353207f1081f477`, installed on main.
- MacBook verdict: the universal VSIX installs on macOS (no TargetPlatform, pure JS/WASM/SVG/PNG/MP3 — no native binaries); darwin-arm64/x64 packages also build and audit clean. A real Mac install is NOT verified — no Mac host here.
- Pre-release test plan with positive/negative cases and release-blocking open items: `testcases/TC_1.0.0_release_readiness.md`. Full extension suite after universal packaging: 655 passed / 1 skipped; lint green.
- README actualized in EN/RU/ZH: big pink DOWNLOAD button with the robot (`docs/media/download-{en,ru,zh}.svg`) linking to `releases/latest/download/kimi-code-universal.vsix` (404 until the first release is published), universal+per-target install text, new feature rows, build example 43. Local links checked; voice-lint 0 findings.
- Release notes actualized in Krinik's style for the current build: `release-notes/1.0.0/changelog.{en,ru,zh}.md`. No release publication is authorized.

- Build 42 verified on the isolated profile (653 passed / 1 skipped, lint, typecheck, build and all VSIX audits green; evidence `testcases/reports/2026-11-26_build_42_sticky_animation_subagent_chevron.md`, WebP 119/120/121): `bugs/41` smooth sticky animations (computed 61 → 0px over ~200ms), `bugs/42` «Субагенты» large-form label vs 24×24 compact icon, `bugs/43` centered chevron (delta 0/0). Build 42 SHA `7ca5e532f3f773fad13d41f6d6f17ddaf08f755bf4bd90de2b639a62fceab208`; build 43 changes only the build number and packaging scripts.
- EXP-0024: Playwright `browser.close()` over CDP does NOT kill the isolated VS Code process — the next launch attaches to the stale build; kill the isolated PID tree and read the running build from the action menu before measuring. EN/ZH Control Panel strings and the subagent label additionally verified on the packaged build (`testcases/reports/2026-11-26_build_42_en_zh_localization.md`).
- Build 40 covered sound-off dimming, sticky selection/padding/fade and the Control Panel state style (SHA `87eb16de45dba2ad7d20420abee16d5ecfc68156f414fa8395b2d237c6c970f6`, 651 passed / 1 skipped; verified on the isolated profile in `testcases/reports/2026-11-26_build_40_sound_sticky_control_panel.md`, WebP 114/117/118).
- Main running-profile acceptance still pending a window reload. No release publication is authorized.

## Where we are now

The current release candidate is `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix` (build 43), SHA-256 `3c4c4c1d3b1682c6ad6c8ca690d82799271068a54c60bfad3353207f1081f477`; the universal candidate is `apps/vscode/artifacts/vsix/kimi-code-universal.vsix`, SHA-256 `4b4ef32254eaaa16818ea4c515b69f5cfbe7244f857030d0ae0243dd35fe9c80`. The extension has 655 passed / 1 skipped and 0 failures. Build 43 is installed on main and isolated profiles; isolated functional acceptance passed, while main running-profile acceptance is pending. No GitHub Release exists.

## ❓ Awaiting human review

- Publication of `v1.0.0` still requires the owner's separate `AUTH:`. `interviews/interview_001_kimi_krinik_1_0_0_release.md` Q1 was answered B (installation only); no publication is authorized.
- `GOAL.md` owner confirmation, B9 changelog mechanism and B10 shared `kimi.*` namespace remain open organizational questions, not reasons to start new work during closure.

## Where to continue next session

1. Reload the accumulated main profile onto build 43 and observe the pending acceptance paths (header, assistant actions, media race, skill, General Settings, sticky, sound dimming, tinted tooltips, subagent label). Use real screenshots per `HOUSE_RULES.md` R2 and do not infer the running build from the installed VSIX hash. The failed focus/palette attempts are recorded in `testcases/reports/2026-11-26_build_34_session_header_compact.md`; do not repeat them blindly. Record fresh results in a new run report.
2. Done this session: the pre-release package — test plan `testcases/TC_1.0.0_release_readiness.md`, README with the three-language DOWNLOAD button, release notes in Krinik's style, universal VSIX for macOS and all platforms. `bugs/34` is closed: the 21:09 marker write was claimed but never executed; the timer and the witness hunt were right (EXP-0025). Next technical task: the real VSIX preflight for `bugs/29`.
3. Publish only with explicit owner `AUTH:` and only after green real-world acceptance: tag `v1.0.0`, attach the verified universal and per-target VSIX files, use `release-notes/1.0.0/changelog.{en,ru,zh}.md`, then open and read the published page.

## Open bugs

- 🔧 `bugs/37_sticky_shows_visible_message.md` — visible prompts no longer enter the sticky; direct user-bubble-bottom selection verified on isolated build 40; main-profile acceptance pending.
- 🔧 `bugs/38_sticky_container_bottom_padding.md`, `bugs/39_sticky_collapsed_second_line_fade.md` — 8px bottom padding and a softer second-line fade verified on isolated build 40; main-profile acceptance pending.
- 🔧 `bugs/40_control_panel_on_off_case_and_tint.md` — uppercase «ВКЛ»/«ВЫКЛ» with green/red tint verified on isolated build 40 in EN/RU/ZH; main-profile acceptance pending.
- 🔧 `bugs/41_sticky_appearance_and_switch_animation.md`, `bugs/42_subagent_button_label.md`, `bugs/43_sticky_chevron_centering.md` — smooth sticky animations, «Субагенты» label and centered chevron verified on isolated build 42; main-profile acceptance pending.
- 🔧 `bugs/36_assistant_text_action_scope.md` — per-text Copy/Fork placement, adjacent-only copying and custom message tooltips verified on isolated build 36; accumulated main-profile acceptance pending.
- 🔧 `bugs/35_attachment_composer_chat_race.md` — deferred-acknowledgement cleanup fixed; isolated build 37 passed before/after frame traces, failure restoration, completion and replay; accumulated main-profile acceptance pending.
- ✅ `bugs/34_DONE_refresh_marker_write_lost.md` — root cause found: the 21:09 write was claimed in chat but never executed (the wire log has no Write call at 21:09; only 18:04/18:56/21:15). The timer and the refresh-witness hunt were right; no product defect. Controlled Write-tool write persisted and was read back. Lesson in EXP-0025.
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

KNOWLEDGE: turn-scoped identity is in `bugs/25` / EXP-0022; assistant action ownership is in `bugs/36`; media/composer timing is in `bugs/35`; the revised sticky contract and new one-line boundary are in `plans/03` and `bugs/31`; latest evidence is in `testcases/reports/2026-11-26_build_36_assistant_text_actions.md`, `2026-11-26_build_37_media_composer_atomicity.md`, `2026-11-26_build_38_sticky_single_line.md` and `2026-11-26_build_39_ui_refinements.md`; per-skill decisions are in `interviews/interview_002_engine_skills.md` and `HOUSE_RULES.md` R6; nested-webview clipboard testing is in `EXPERIENCE.md` EXP-0023.

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md`, `KIMI CODE LOGO/GPT ROBOT REFERENCES/` and `interviews/decisions/`; do not sweep them into a commit.
