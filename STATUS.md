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

### 2026-11-23 late evening — K1/K2 functionality and brand assets ✅ hygiene, committed
- `80f882851` Control Panel visibility settings, Compact / Steer / Control, independent Context Window Control, KAIF ownership handoff and picker fixes; `a27da7a8c` context ring + live viewer, multiline messages and Working/logo.
- `bugs/01`–`03`: multiline rendering, attachment-toggle outside-click race and stale picker results have red-to-green component/store guards; live Extension Host acceptance is still pending.
- Auto is turquoise, Stop is a filled square; Working uses the acid-pink `#FF1A8C` face with slight top chamfers and clipped ±1 px eye travel. `krinik-robot-logo.svg` + 1024 px PNG are used in all three README sections.
- Independent Context Window Control: no `.kaif` marker or wire file required; settings + four thresholds, SDK status → self-contained `promptWithSkills(..., steerIfActive: true)`, exact boundary/once/re-arm tests. Built-in ownership and vanilla ON both make the KAIF context hook dormant; no dual delivery.

### 2026-11-23 closing checkpoint — secondary model 🔧 implementation present, closing verification pending
- Added `SubagentModelDialog`, robot visibility, `secondaryModel` in the config/store/bridge contracts, and `src/config/secondary-model.ts` atomic validated persistence. Existing-model selection and Follow main model remove the whole old recipe; main model/effort stay untouched (`effortChanged:false`). Custom providers are excluded.
- `apps/vscode/test/secondary-model.test.ts` proves selection and clearing (2 tests green); extension typecheck was green before the final test-fixture edit. No robot-specific interaction test or live Extension Host run was added before the owner stopped the work for closure. Do not call this live-accepted.

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
| K1 UI convergence | 🔧 in progress | context ring/viewer, Control Panel and Working are committed; secondary model + robot is a closing checkpoint with persistence tests only. Left: robot interaction/live test, combined model + effort picker, status pills, session header |
| K2 behavior controls | 🔧 in progress | independent Context Window Control and KAIF handoff are committed and hygiene-green; left: K2.6 an in-flight compaction |
| K3 localization and theme | ✅ hygiene | three languages and the theme tokens; live acceptance in K5 |
| K4 sound settings | 🔧 in progress | the window is done; B5/B6/B8 not re-checked against it |
| K5 live acceptance and release | 🔲 todo | `plans/153`; publishing only on the owner's `AUTH:` |
| K6 README | 🔧 started | the new pink robot is in EN/RU/ZH README; feature tables still contain 🚧 rows that must close before release |

Verification commands (root `AGENTS.md`): `pnpm lint` · `pnpm --filter kimi-code-kaif run typecheck` ·
`pnpm exec vitest run --reporter=agent apps/vscode/test`. Last full run (2026-11-23 22:40 +03:00, Windows): 503 passed, 1 skipped, 0 failed; typecheck and lint green. Judge re-ran the same claims at 22:40 and found no weakened checks.
A red test here is a signal again — there is no accepted baseline of failures.

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

- [ ] B5–B12 of `Claude_Help_for_Kimi.md` that no phase owns yet.
- [ ] `KAIF/framework/hooks` bugs/156 (one sequential Stop): commit, rebuild `dist`, then `node .kaif/kaif-core.mjs update --source D:/work/ai_sandbox/KAIF/dist` here.

## ❓ Awaiting human review (interviews / homework)

- ❓ `GOAL.md` was assembled from the owner's recorded words (`researches/52` §1); the owner confirms it.
- ❓ B9: one changelog mechanism (changesets or the hand-written `CHANGELOG.md`) and the `major` level.
- ❓ B10: the settings namespace `kimi.*` shared with the official extension.

## Where to continue next session

PARKED: 2026-11-24 00:04 +03:00 — the owner stopped secondary-model completion for a soft closure and explicitly waived the judge pass. Closing hygiene is green: 505 passed, 1 skipped; typecheck, lint, extension + webview builds and README voice-check. The secondary-model checkpoint and this handover are ready for the immediate closing commit. Start the new chat with `/skill:resume`, then prove the newly wired hooks with `node .kaif/hooks/context-window.mjs --alive`. `wire-hooks --kimi` rewired 22 entries and `kimi doctor config` passed, but the old session had no hook record; a new/reloaded session is required. Live Extension Host acceptance and the robot interaction test remain open.

KNOWLEDGE: independent Context Window Control and the one-authority handoff are written in `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`; the exact Cyrillic Silero + Glass voice route and owner/project naming are in `HOUSE_RULES.md` R1 and EXP-0003; secondary model's exact checkpoint and missing live evidence are in this file.

1. Read `FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md`, run `/skill:resume`, then `node .kaif/hooks/context-window.mjs --alive`. Do not assume hooks run because the config is wired.
2. Verify the closing commit exists and the tree is clean except pre-existing `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md` and `KIMI CODE LOGO/GPT ROBOT REFERENCES/`. If the checkpoint is still uncommitted, inspect exactly the secondary-model files named in `git status` before doing anything else.
3. Add the missing robot interaction test (open → existing model → `saveConfig` with `secondaryModel` and `effortChanged:false` → Follow main model), then run `pnpm exec vitest run --reporter=agent apps/vscode/test/secondary-model.test.ts apps/vscode/test/webview/control-panel-settings.test.tsx` and the full verification commands above.
4. Next K1 feature: combined model + effort picker, then status pills and session header. Keep paperclip/model/rings/settings/stop-send fixed; secondary-model robot visibility is `kimi.controlPanel.secondaryModel`.
5. K5 preparation: drive all new controls and `bugs/01`–`03` in a real Extension Host before calling them tested or DONE. Claude sessions here get no KAIF skills or hooks; the owner declined adding `claude-code` for now.

## Open bugs

- 🟠 `bugs/01`–`03` — fixes and red-to-green guards are committed; live Extension Host acceptance remains before DONE.
- 🔴 `bugs/152` (KAIF origin) — the extension can stay on «Starting Kimi Code…»; not reproduced; check B10 when it recurs.
- 🟠 `bugs/151` (KAIF origin) — follow-up steer race; store-level fixes in place, live acceptance left.
