# Test run report — KAIF context control for the autonomous day loop

**Created:** 2026-11-24 00:52 +03:00 · **Run by:** project agent ·
**Version/build:** KAIF 2.10 · official Kimi Code CLI · session `session_2584d882-ff27-49e7-af16-53fc31a27640`

## 1. Work

Verify that the current official Kimi session runs the KAIF context-window hook, measures its real wire transcript, and has an enforced soft/forced closure path for the owner's autonomous day-loop stop condition. Basis: `STATUS.md` item 1, `bugs/KAIF/04_context_window_alive_dormant.md`, and the owner's instruction to finish when the overflow hook fires.

## 2. Contour

Windows, official Kimi Code in the real project root, active user-level `[loop_control] auto_compact = false`, deployed `.kaif/hooks/context-window.mjs`. The measurements name this session's actual `agents/main/wire.jsonl`; the threshold and closure-latch checks run in the hook's isolated selftest fixtures.

REAL WORLD: accumulated — the owner's existing Kimi configuration, KAIF deployment and current session store; data and machine — the owner's Windows machine and live session wire; path — official Kimi session hooks plus `--alive`, `--measure` and `--selftest`. Active recording and measurement verified on the real world; a natural threshold crossing has not yet occurred in this session.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-24 00:48 +03:00 | `node .kaif/hooks/context-window.mjs --alive` | 0 · current session recorded at `2026-11-23T21:48:07.894Z` |
| 2 | 2026-11-24 00:52 +03:00 | `node .kaif/hooks/context-window.mjs --measure` | 1 · expected below-close result; real wire measured at 109,678 / 891,289 tokens (12%) |
| 3 | 2026-11-24 00:52 +03:00 | `node .kaif/hooks/context-window.mjs --selftest` | 0 · `selftest: all ok`, including Kimi thresholds, soft/forced closure and ordinary-work latch |

## 4. Checks

Hygiene: full context-window selftest green; exact 70 / 75 / 80 / 90% boundaries and one-token-below cases green; soft closure latch, forced escalation, closure-entry exceptions and post-compaction re-arm green.
Functional run: current official Kimi session inspected through its live hook state and real wire; READ the `--alive` session record, `--measure` token count and `.kaif/context-window.json` session entry.

| Case | Status | Observation |
|---|---|---|
| Current-session hook liveness | pass | `--alive` exited 0 and named this session |
| Real wire measurement | pass | `--measure` read this session's wire and reported 109,678 / 891,289 tokens (12%); exit 1 meant below the 80% closing level |
| Warning and logical-cut boundaries | pass | Selftest observed exact 70% and 75% thresholds and one-token-below silence |
| Soft closure requirement | pass | At 80% the CLI selftest requires `/skill:end-chat-soft` and refuses ordinary PreToolUse until closure is entered |
| Forced closure requirement | pass | At 90% the selftest requires `/skill:end-chat-force`; a soft entry does not satisfy force |
| Natural overflow and resulting closure | skipped | Not observed at 12%; the running day loop will encounter and execute the real hook signal |

## 5. Found

- none

## 6. Traces

- `C:/Users/krinik/.kimi-code/sessions/wd_kimi-krinik-vscode-extension_dec8324e1181/session_2584d882-ff27-49e7-af16-53fc31a27640/agents/main/wire.jsonl`
- `.kaif/context-window.json`
- `.kaif/hooks/context-window.mjs`
- `bugs/KAIF/04_context_window_alive_dormant.md`

## 7. Verdict

partial — live liveness, real measurement and all threshold/closure mechanics passed; the natural overflow event and resulting closure remain to be observed during the autonomous run.
