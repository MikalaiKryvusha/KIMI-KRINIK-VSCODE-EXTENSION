# KIMI KRINIK — Project History (the chronicle)

> The APPEND-ONLY chronicle of how this project lived and grew: closed sessions, shipped phases,
> releases, big decisions in the order they happened. This is where `STATUS.md` sheds its past —
> STATUS stays a short live summary of NOW; everything finished moves HERE (the "bonsai trim" step
> of `/end-chat-soft`).
>
> **Not required reading.** This file is NOT part of `/resume`'s canon set and not in the
> before-every-task minimum — open it only when you actually need the archaeology: how a decision
> came to be, what an old phase contained, when something shipped.
>
> **Chronicle rules (ADR discipline):**
> - **Append-only, newest on top.** A recorded entry is never edited to say something else —
>   history that can be rewritten is not history. Corrections come as NEW entries that reference
>   and supersede the old one.
> - An entry moves here VERBATIM from `STATUS.md` when its work closes — move, don't rewrite;
>   the entry already carries its dates, counters and file pointers.
> - Entries mention versions and dates freely — a chronicle legitimately speaks of old versions,
>   and the update machinery's stale-claims scan knows to leave this file alone.
> - When the file grows unwieldy, split by era: keep the newest era here, move older ones to
>   `PROJECT_HISTORY_<era>.md` files, and leave a one-line index at the top of this file
>   (the pattern large changelogs use).
>
> Living document — never DONE-tagged.

---

## Entries (newest first)

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
