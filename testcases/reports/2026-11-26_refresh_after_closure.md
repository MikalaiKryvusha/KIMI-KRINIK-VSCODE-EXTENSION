# Test run report — no automatic canon refresh after a completed closure

**Created:** 2026-11-26 18:07 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK deployed KAIF 2.10, local hook sources

## 1. Work

`bugs/KAIF/06` / upstream #207 and the owner's decision recorded in `AGENT_GUIDE.md` → Context refresh: after a completed soft, forced or window-initiated closure, automatic canon refresh and its creed/prayer stay dormant in that session even when later work continues. New sessions and explicit owner rituals retain their behavior.

## 2. Contour

Windows 11, Node 24.15.0, deployed `.kaif/hooks/` with isolated temporary project/home state. The functional replay uses the actual closing wire from `session_b0483cf3-72e6-4af6-8147-d4d83bee60af`, turn 41 (closure entered) and turn 47 (farewell written).

REAL WORLD: accumulated — the owner's real closing session and later owner messages; data and machine — the actual Windows wire record; path — the deployed Stop and UserPromptSubmit hook scripts replayed against an isolated project. Verified with real state taken from the real world; the owner's live profile and current session were not modified.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-26 18:07 +03:00 | `node .kaif/hooks/stop-farewell-capture.mjs --selftest` | 0 · 20/20 checks pass; the pre-fix version failed five closure cases, and the added context-loop case failed before its reader was fixed |
| 2 | 2026-11-26 18:07 +03:00 | `node .tmp/kaif-closure-real-replay.mjs` | 0 · 6/6 real-wire observations pass; this replay initially exposed the unsupported `content.part` form before the reader fix |

## 4. Checks

Hygiene: 20/20 hook selftest checks pass. Red-before-fix evidence was observed on the unpatched deployed hooks, not inferred from the diff.

Functional run: the real closing wire was replayed through the deployed Stop hook, then both automatic UserPromptSubmit refresh hooks were run and their output was read.

| Case | Status | Observation |
|---|---|---|
| Closing Skill without a farewell write | pass | Turn 41 does not mark the session closed |
| Farewell after later owner turns | pass | Turn 47 records the real session id |
| Farewell content | pass | The replayed farewell contains `f8e74bc6d` |
| Hourly refresh in the closed session | pass | No output |
| Pending SessionStart refresh in the closed session | pass | No output |
| New session control | pass | The hourly refresh order is still emitted |
| Soft/forced closure accumulation and StopFailure | pass | Both ids survive; both stay silent |
| Explicit `resume` control | pass | `/skill:resume` remains emitted independently |
| Generic transcript closure | pass | Both generic refresh paths are silent; a fresh generic session still refreshes |

## 5. Found

- `bugs/KAIF/06_refresh_after_chat_closure.md` — the original age-only refresh defect and its two real-wire boundaries are fixed locally; upstream issue #207 remains open until origin verification completes.

## 6. Traces

- Real wire: `C:/Users/krinik/.kimi-code/sessions/wd_kimi-krinik-vscode-extension_dec8324e1181/session_b0483cf3-72e6-4af6-8147-d4d83bee60af/agents/main/wire.jsonl`
- Replay harness: `.tmp/kaif-closure-real-replay.mjs` (temporary, removed after all origin checks)
- Bug: `bugs/KAIF/06_refresh_after_chat_closure.md`

## 7. Verdict

pass — the deployed hooks enforce the completed-closure boundary on synthetic and real-session replay; this verdict covers the focused hook behavior, not the separate KAIF origin full core suite.
