# KIMI KRINIK — MASTER PLAN

> The roadmap: how we get from the project's **current state** to the vision in `GOAL.md`. A high-level,
> stepwise decomposition — phases and milestones, not day-to-day tasks (those live in `plans/`). Derived
> from `GOAL.md` by the agent at deploy and refreshed with `/revision` as the goal or the state changes.
>
> This is a **living reference**, not a task — never DONE-tagged.

---

## Vision (one line)

KIMI KRINIK 1.0.0: the official Kimi Code engine with the KIMI FORK interface, Auto Compact and AUTO STEER switches, KAIF
context-window closure, an English / 中文 / Русский interface and per-event sounds, shipped as a self-contained VSIX.

## Guiding principles

1. The engine and the harness are upstream Kimi Code; the reference engine never replaces them (`GOAL.md` → «ядро … берётся из
   оригинального расширения»).
2. Every visible control runs a real host or SDK path; a decorative button is a defect.
3. One persisted authority per setting: the engine config owns `auto_compact`.
4. A port from KIMI FORK is surgical, with an inventory of the old and the new path; no wholesale copy of `InputArea` or stores.
5. Release, push and external publication happen only on the owner's separate word.

## From here to there — the phased path

The detailed operational plans are the epic `plans/147_EPIC_kimi_krinik_1_0_0.md` and its phase plans `plans/148`–`154` in the
KAIF origin repository (`D:/work/ai_sandbox/KAIF`). Claude and KIMI split the work in `Claude_Help_for_Kimi.md`.

### Phase 0 — Baseline and contracts (K0, `plans/148`)

The official base `56145f849` is pinned; the engine switch `[loop_control] auto_compact` exists with tests. KAIF 2.10 is deployed
here for Kimi (2026-11-23). Review findings B1–B12 of the 1.0.0 RC are in `Claude_Help_for_Kimi.md`; B1–B4 and the lint ratchet
are fixed. Left: the inventory, red tests for the K1–K4 contracts, the in-flight compaction decision.

### Phase 1 — UI convergence (K1, `plans/149`)

Header, Working, status pills, the composer panel (permission, Plan, Goal, Swarm, secondary model), context and quota rings,
the combined model picker; the visible brand is KIMI KRINIK.

### Phase 2 — Behavior controls (K2, `plans/150`)

Auto Compact switch with live flip, KAIF thresholds 70 / 75 / 80 / 90 % projected into `.kaif/kaif.json`, AUTO STEER ON/OFF
(OFF brings back the queue path), named switches for the KAIF additions.

### Phase 3 — Localization and theme (K3, `plans/151`)

English default, 中文, Русский with typed dictionaries of one key set; tooltips and menus on VS Code theme tokens.

### Phase 4 — Sound settings (K4, `plans/152`)

A separate sound window: event inventory, a sound and a volume per event, silent replay, fail-open audio.

### Phase 5 — Live acceptance and release 1.0.0 (K5, `plans/153`)

Second Side Bar acceptance on the owner's profile, isolated VSIX next to the official extension and KIMI FORK, rollback,
changesets, an independent judge, the GitHub Release with notes in EN, RU and 中文.

### Phase 6 — The goal is reached (K6, `plans/154`)

The README in EN → RU → 中文 shows the released 1.0.0 with WebP screenshots and the upstream credits; no 🚧 row remains.

## Decision log

| Stamp | Decision | Why |
|------|----------|-----|
| 2026-11-23 15:36 +03:00 | Epic 147 «KIMI KRINIK 1.0.0» accepted with phases K0–K6 | the owner's word (`plans/147` status line) |
| 2026-11-23 ≈16:55 +03:00 | The repository is renamed to `MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION` | done by the owner |
| 2026-11-23 ≈17:07 +03:00 | No `Co-Authored-By` trailer and no agent name in commits and PRs | the owner's word; the root `AGENTS.md` says the same |
| 2026-11-23 ≈17:40 +03:00 | The README is rewritten from scratch in EN, RU and 中文: what KIMI KRINIK brings over Kimi Code and KIMI FORK | the owner's word |
| 2026-11-23 ≈17:45 +03:00 | KAIF is committed into this repository; the voice portrait stays git-ignored; the root `reports/` is tracked; the install field report goes upstream | the owner's answers to the deployment questions |

---

> **Maintenance:** keep this in sync with reality. When `GOAL.md` or the project's state shifts materially,
> run `/revision` to re-derive the phases. The per-step detail plans that implement each phase live in
> `plans/`.
