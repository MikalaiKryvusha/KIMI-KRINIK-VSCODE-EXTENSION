# KAIF bug: automatic canon refresh resumes after the chat has formally closed

kaif-fp: framework/hooks/prompt-refresh-timer.mjs#closure-state :: refresh-after-chat-closed :: v2.10
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/207
**Autocapture** (from `.kaif/kaif.json` + update receipt): KAIF 2.10 · project KIMI KRINIK · sphere programming · language ru · i18n ru · tracking origin · agent system kimi-code · OS Windows · Node v24.15.0
**Severity:** S2
**Fixing:** this session, under the owner's explicit decision of 2026-11-26 17:46 +03:00.
**Dedup attestation:** searched `bugs/KAIF/` (`Grep "refresh|closure|closed|farewell|timer" bugs/KAIF/*.md` → only `04_context_window_alive_dormant.md`, a different liveness defect) and open origin issues (`gh issue list --repo MikalaiKryvusha/KAIF --state open --search "refresh closure" --limit 50` → #181, #182, #183; `gh issue list --repo MikalaiKryvusha/KAIF --state open --search "prompt-refresh-timer closure refresh after closed" --limit 50` → no matches). No surface + symptom-class match found.

## Expected per canon

"The hour: more than 60 minutes in a live session since the last refresh — refresh at least once per hour." — `AGENT_GUIDE.md` → Context refresh. A closed chat is no longer a live work session.

The owner's decision: «Если агент уже выполнил ЗАКРЫТИЕ чата ... то всё, больше обновления канона не нудно в жтом чате, даже если после закрытия ещё какая-то работа будет делаться, и даже если со времени последнего обновления-чтения канона пробло более 60 минут».

## Got in the field

The previous Kimi session `session_b0483cf3-72e6-4af6-8147-d4d83bee60af` completed its closing turn and farewell:

`{"type":"turn.ended","agentId":"main","turnId":47,"reason":"completed",...,"time":1795702633925}`

The next user message then opened turn 48 at `2026-11-26T17:17:14+03:00`. Its actual `turn.prompt` contained:

`KAIF context refresh (timer: last refresh 101 min ago, interval 60 min). Before starting on this prompt: re-read the re-read core ...`

The agent consequently read all nine core documents and repeated the full creed and prayer after it had already said goodbye. The owner paid for another canon pass and explicitly rejected that behavior.

## Repro (deterministic)

1. Complete `/end-chat-soft` or `/end-chat-force` with a farewell in a Kimi session, leaving `.kaif/refresh-marker.json` older than 60 minutes.
2. Submit another prompt in the same session.
3. Observe `prompt-refresh-timer.mjs --emit kimi` inject the hourly refresh order because it has no closed-session predicate.
4. The same missing predicate lets a pending SessionStart/PostCompact refresh request the canon pass after closure.

## Cost and violated invariant

A session that had formally closed spent tokens and the owner's attention on a full canon pass and prayer instead of answering the next message. The defect violates owner-work-safety, simplicity and the boundary between a closing ritual and later work.

## What in KAIF led to this

`prompt-refresh-timer.mjs` bases its decision solely on refresh-marker age. `session-start-refresh.mjs` independently carries a pending refresh into the next prompt. Neither checks whether the current session has completed closure. `stop-farewell-capture.mjs` already observes that boundary but records only the last `closureId` and timestamp, without session identity that the refresh hooks could consume. A later StopFailure replaces that record, so closure state also has to survive failure capture.

## Local remediation (per the "defect in KAIF itself" contour, if applied)

Applied in `.kaif/hooks/stop-farewell-capture.mjs`, `prompt-refresh-timer.mjs` and `session-start-refresh.mjs`: the existing farewell-capture memory preserves `closedSessionIds`, a session is added only after its farewell write, and both automatic refresh paths stay silent for it. Entering a closing skill alone does not suppress refresh. StopFailure preserves the list; current `content.part` and generic transcript records are supported; explicit `/resume` remains independent.

Verification: 20/20 selftest checks pass after red runs on the unpatched hooks. The actual session replay passes 6/6 observations: turn 41 is not closed, turn 47 closes, the farewell survives, both refresh paths are silent and a new session still refreshes. Evidence: `testcases/reports/2026-11-26_refresh_after_closure.md`. The same fix is applied in `D:/work/ai_sandbox/KAIF` as `bugs/160` / origin decision №178; its framework build and full affected `s14` suite are green. The full core run is 25/28, with unrelated baseline failures in `s01` and `s22` documented instead of hidden; hooks-mutants is 33/34 with only `W9` carrying the same baseline issue, and adversarial judge is pending.

TWINS: searched `KAIF context refresh` in every hook — found one additional automatic producer family: `session-start-refresh.mjs` alongside the timer. Its Kimi and generic branches are both covered; `prompt-resume-word.mjs` is an explicit owner order and intentionally remains unchanged.
TWINS-MECH: a periodic trigger can miss terminal lifecycle state either by measuring time or by carrying a pending event. Searched the timer string, pending SessionStart/PostCompact output and both transcript record forms; all three automatic emission sites are guarded by the same closure witness.
