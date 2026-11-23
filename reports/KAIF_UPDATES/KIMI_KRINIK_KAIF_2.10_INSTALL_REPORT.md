# KIMI KRINIK — KAIF 2.10 install report

**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/203

Target: `MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION` (a fork of the MoonshotAI/kimi-code pnpm monorepo, 33 workspace
projects), branch `kaif/no-auto-compaction`. Installer: Claude Code (Opus) on the owner's machine, Windows 11, Node 24.15.0.
Agent systems: `kimi-code` only. Language: `ru`. Source: a local `KAIF/dist` 2.10 (build `a8297ab35775`), not the release.

## 1. Chronology with numbers

1. 16:58 +03:00 — rehearsal on a `git archive HEAD` copy in a scratch directory: the loader with
   `--source <local KAIF checkout>/dist --agents kimi-code --lang ru` deployed 37 skills, kept the existing `AGENTS.md`,
   added three `kaif:*` scripts to the root `package.json` and 25 lines to `.gitignore`.
2. 17:01 — the same command in the real tree: `✅ KAIF 2.10 deployed mechanically (lang ru · 8 owner docs templated · 37 skills)`.
3. 17:03 — the host lint failed on `.kaif/`: `check-comments` (comments in `.kaif/tools/*.mjs`), then oxlint
   (`no-floating-promises`, `restrict-template-expressions` in `.kaif/tools/contour/review.mjs`), then the host's guard and
   ratchet snapshots of the oxlint config. Fixed with `.kaif/` in `.commentignore`, `.oxlintrc.json`, `.oxlintrc.ratchet.json`
   and `node scripts/checks/guards.mjs --update`; `pnpm lint` exit 0.
4. 17:05 — the Kimi pointer written to `.kimi-code/AGENTS.md` by hand (see 2.1).
5. 17:07 — the owner removed the `Co-Authored-By` trailer from the canon (see 2.2); `sync` re-synced 46 copies.
6. 17:08 — `project-name "KIMI KRINIK"`, `sphere programming`, `placeholders`, `wire-kimi-hooks` green;
   `wire-hooks --kimi`: 22 entries, `kimi doctor config — OK`, backup `config.toml.20261123-170838.bak`.
7. 17:44–17:49 — `owner-voice` (public snapshot installed, git-ignored, `pnpm run kaif:voice` wired), `maps`, `goal-plan`,
   `kaif-framework`; seven template slots of `end-chat-soft`, `end-chat-force` and `release` filled with this project's
   commands; `node .kaif/kaif-core.mjs check`: `✅ manifest satisfied: 113 files + 38 agent artifacts present`.

## 2. Friction and rakes

1. **The Kimi context pointer had no home.** The host `AGENTS.md` exists (23 190 bytes; the host's own lint caps it at
   23 200 bytes). The installer printed `= kept existing AGENTS.md` and wrote the pointer nowhere, so the deploy checklist
   line «`AGENTS.md` points at `AGENT_GUIDE.md`» stayed unmet silently. Kimi Code loads `<dir>/.kimi-code/AGENTS.md` together
   with `<dir>/AGENTS.md` (`packages/agent-core-v2/src/agent/profile/context.ts`, `loadAgentsMdForRoots`). Proposed: for a
   `kimi-code` target with an existing `AGENTS.md`, write `KIMI_POINTER` to `.kimi-code/AGENTS.md` when it is absent.
2. **A Kimi-only deployment carries an Anthropic address in the canon.** `AGENT_GUIDE.md` → Commits:
   `Co-Authored-By: <YOUR AGENT/MODEL> <noreply@anthropic.com>`. The host repository forbids co-author trailers and agent
   identity in commits (its root `AGENTS.md`), and the owner removed the trailer here. Proposed: the trailer line follows the
   target agent systems, and a deployment can switch it off in `.kaif/kaif.json`.
3. **Vendored machinery trips a strict host lint.** A host that lints every tracked and untracked JS file
   (`git ls-files --cached --others --exclude-standard`) fails on `.kaif/*.mjs`. Proposed: the install summary names `.kaif/`
   as a path to exclude from host linters.
4. The installer's warning about the git-ignored `reports/README.md` was exact and saved a silent loss; the owner chose to
   track the root `reports/` (`!/reports/` after the host rule).

## 3. What confused a cold agent (top 3)

1. Which file Kimi reads when `AGENTS.md` is full — answered only by the Kimi source, not by the adapter page.
2. `context-window.mjs --alive` run from a Claude session answers about `.claude/settings.json`; it cannot prove Kimi hooks.
3. The voice witness refuses a text written before `load`, even with zero rule hits; the order «load, then write» is easy to
   miss when the owner asks for a README in the middle of the install.

## 4. Final state and judge verdict

| Claim | Evidence | Verdict |
|---|---|---|
| The manifest is complete | `kaif-core check`: 113 files + 38 agent artifacts | VERIFIED |
| 37 Kimi skills are deployed | `ls .kimi-code/skills \| wc -l` → 37 | VERIFIED |
| The host lint is green | `pnpm lint` exit 0 | VERIFIED |
| The Kimi hooks are wired | `wire-hooks --kimi` → `kimi doctor config — OK` | VERIFIED |
| The hooks run in a Kimi session here | needs a new Kimi session and `--alive` there | NOT VERIFIED |
| The adaptation is complete | `study` and `verify` are left to the project's Kimi agent | PENDING |

Verdict: **VERIFIED WITH CAVEATS** — the two open lines above.
