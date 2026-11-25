# KAIF bug: Kimi --alive calls intentional context-window dormancy a total hook failure

kaif-fp: framework/hooks/context-window.mjs#kimi-alive :: false-not-running-when-dormant :: v2.10
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/204
**Autocapture** (from `.kaif/kaif.json` + update receipt): KAIF 2.10 · project KIMI KRINIK · sphere programming · language ru · i18n ru · tracking origin · agent system kimi-code · OS Windows · Node v24.15.0
**Severity:** S2
**Dedup attestation:** searched `bugs/KAIF/` (`Glob bugs/KAIF/*` → no files) and open origin issues (`gh issue list --repo MikalaiKryvusha/KAIF --state open --search "context-window alive auto compact" --limit 20` → only #203, the KIMI KRINIK install report). No match found.

## Expected per canon

"no record of this session = the hooks do not run here" — `framework/hooks/context-window.mjs`, `--alive` contract at the `aliveLine` comment. The Kimi handoff also says: "Built-in ownership and vanilla ON both make the KAIF context hook dormant; no dual delivery." — project `STATUS.md:32`, derived from the deployed hook's early exits.

## Got in the field

`node .kaif/hooks/context-window.mjs --alive` printed:

`KAIF hooks: NOT running in this Kimi session (session_13eee2d0-6af4-42b0-8d07-1a8349e3d915) — wired in C:\Users\krinik\.kimi-code\config.toml, yet no hook recorded the session ...`

At the same time `.kaif/kimi-refresh.json` contained:

`{"pending":true,"source":"SessionStart","at":"2026-11-23T21:14:12.521Z"}`

That timestamp is 77 ms before the host's captured session-start time `2026-11-23T21:14:12.598Z`, proving that the SessionStart dispatcher ran in this session. The project marker had no `contextWindow.owner`; the user config had no `[loop_control] auto_compact = false`, so Auto Compact defaulted to ON. The Kimi event branch exits at `if (kimiAutoCompactEnabled(configText)) process.exit(0)` before writing `.kaif/context-window.json`.

## Repro (deterministic)

1. Wire the Kimi dispatcher and use a project with `.kaif/kaif.json` but no `contextWindow.owner`.
2. Use a Kimi config with no `[loop_control] auto_compact = false` and run a real SessionStart event; observe `.kaif/kimi-refresh.json` written.
3. Run UserPromptSubmit or PostToolUse through `kimi-hook.mjs ... context-window.mjs --kimi`; observe no `.kaif/context-window.json` because the hook is intentionally dormant.
4. Run `node .kaif/hooks/context-window.mjs --alive`; it exits 1 and claims that the agent system ran none of the hooks.

## Cost and violated invariant

Two sessions and a VS Code restart were spent repeating a reload remedy for a working dispatcher. The false diagnosis hid the actual state (context control dormant under Auto Compact ON) and could pressure the owner into unnecessary reloads. Violated invariants: honest-green and cold-start.

## What in KAIF led to this

The Kimi `--alive` branch treats only `.kaif/context-window.json` as liveness evidence. It does not evaluate the two intentional early exits (`contextWindow.owner === "kimi-krinik"` and Auto Compact ON) before claiming that no project hook ran. SessionStart evidence is not considered, and the generic reload remedy is emitted even when a reload cannot change the state.

## Local remediation (per the "defect in KAIF itself" contour, if applied)

Applied in `.kaif/hooks/context-window.mjs`: Kimi `--alive` reports built-in ownership and Auto Compact ON as explicit dormant states (exit 2, nothing to judge), never as a total hook failure. Two CLI-level selftest cases reproduce both states and reject any `NOT running` wording. The broken pre-fix version failed both cases; the fixed version passes the full selftest. No presence is written while dormant, so a green `--alive` still means active KAIF context control.

Functional activation on 2026-11-24 00:31 +03:00: with the owner's real Kimi config changed to `[loop_control] auto_compact = false`, official Kimi Code CLI 2.7.2 created `session_1e622498-786b-45e0-b5f4-af8e0532ec2e`. Its output showed the KAIF UserPromptSubmit hooks; `--alive` exited 0 and `--measure` read the real wire at 30,750 of 891,289 tokens (3%). `.kaif/context-window.json` recorded that session. The upstream ticket remains open until an origin update absorbs the diagnostic fix.

TWINS: searched `NOT running in this Kimi session` and the two early-exit conditions — the Kimi `--alive` branch was the only incorrect total-hook-failure diagnosis; no other site found.
TWINS-MECH: a single subsystem's missing state was generalized to the whole hook pipeline. Searched `aliveLine`, `KAIF hooks: NOT running`, `contextWindow.owner`, and `kimiAutoCompactEnabled`; the Claude-specific `aliveLine` is a separate route and does not implement Kimi dormancy.
