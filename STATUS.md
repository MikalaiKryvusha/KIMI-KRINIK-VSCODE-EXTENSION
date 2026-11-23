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
Pushed to GitHub up to `b93d6813c`; `d699642de`…`02a18c159` are local commits waiting for the owner's word to push.

| Phase | State | Note |
|---|---|---|
| K0 baseline and contracts | 🔧 in progress | KAIF deployed; inventory and red tests for K1–K4 left |
| K1 UI convergence | 🔧 in progress | brand and composer modes done; left: status pills, Working, context ring with the context view, the combined model + effort picker, the secondary model, the session header |
| K2 behavior controls | 🔧 in progress | switches done; left: K2.3 KAIF dormant mode while Auto Compact is ON, K2.6 an in-flight compaction |
| K3 localization and theme | ✅ hygiene | three languages and the theme tokens; live acceptance in K5 |
| K4 sound settings | 🔧 in progress | the window is done; B5/B6/B8 not re-checked against it |
| K5 live acceptance and release | 🔲 todo | `plans/153`; publishing only on the owner's `AUTH:` |
| K6 README | 🔧 started | the README exists with ✅/🚧 rows; no 🚧 row may remain at release |

Verification commands (root `AGENTS.md`): `pnpm lint` · `pnpm --filter kimi-code-kaif run typecheck` ·
`pnpm exec vitest run --reporter=agent apps/vscode/test`. Last run (2026-11-23 19:33 +03:00, Windows): 469 passed, 1 skipped, 0 failed.
A red test here is a signal again — there is no accepted baseline of failures.

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

- [ ] B5–B12 of `Claude_Help_for_Kimi.md` that no phase owns yet.
- [ ] `KAIF/framework/hooks` bugs/156 (one sequential Stop): commit, rebuild `dist`, then `node .kaif/kaif-core.mjs update --source D:/work/ai_sandbox/KAIF/dist` here.

## ❓ Awaiting human review (interviews / homework)

- ❓ `GOAL.md` was assembled from the owner's recorded words (`researches/52` §1); the owner confirms it.
- ❓ B9: one changelog mechanism (changesets or the hand-written `CHANGELOG.md`) and the `major` level.
- ❓ B10: the settings namespace `kimi.*` shared with the official extension.
- ❓ The word to push `d699642de`…`02a18c159` (`GOAL.md`: push only on the owner's separate word).
- ❓ The changeset texts for the composer modes and the Sound Settings window (`gen-changesets` step 4: shown before commit).

## Where to continue next session

1. In a Kimi session in this root: `node .kaif/hooks/context-window.mjs --alive` — proves the KAIF hooks run here.
2. `/skill:resume`, then the adaptation item `study` of `KAIF_ADAPTATION_TASK.md` and `node .kaif/kaif-core.mjs verify-final`.
3. K1: a live Extension Host run of the composer modes, then status pills, Working, the context ring, the combined picker.
4. Claude sessions here get no KAIF skills or hooks: `.kaif/kaif.json` → `agents` lists only `kimi-code`, and the checked-out
   `CLAUDE.md` is a git symlink that Windows writes as the text `AGENTS.md`. Adding `claude-code` waits for the owner's word.

## Open bugs

- 🔴 `bugs/152` (KAIF origin) — the extension can stay on «Starting Kimi Code…»; not reproduced; check B10 when it recurs.
- 🟠 `bugs/151` (KAIF origin) — follow-up steer race; store-level fixes in place, live acceptance left.
