# Audit 001 · Family: blocked context-control submissions

**Mechanism:** a resolved but rejected-at-delivery submission is written into the delivered-stage history, preventing later retries.
**Already guarded by:** successful delivery and rejected empty-skill paths; blocked results are not guarded.
**Occurrences:** F1.

## F1 — A blocked threshold is marked delivered and is not retried

**Quote:** `apps/vscode/src/runtime/context-window-control.ts:141` — `if (generation === this.generation) this.said = decision.said;`; `apps/vscode/src/runtime/session-runtime.ts:111` discards the submission result.

**Failure scenario:** two identical status observations cross the forced 90% stage while `session.steer()` returns `state: "blocked"`; only the first observation submits the closure prompt.

**Severity:** Act — high run-loss risk; medium likelihood because blocked is a normal SDK result and must coincide with a threshold crossing.

**Baseline:** new; bug 28 covers empty-skill rejection, not a resolved blocked result.

kaif-fp: apps/vscode/src/runtime/context-window-control.ts :: blocked-delivery-marked-sent :: v2.10

**Dedup attestation:** reviewer searched `blocked.*context|context.*blocked|blocked.*threshold|threshold.*blocked` and `state: "blocked"`; no existing blocked-result accounting or regression was found.

**Fix sketch:** return the submission result to the controller and commit `said` only for accepted running/queued states; leave it unchanged for blocked so a later observation retries.

**Fix accepted when:** the new runtime regression `retries Context Window Control after a blocked submission` submits twice for two identical blocked observations and commits once after a later accepted result. Run `pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts apps/vscode/test/context-window-control.test.ts -t "retries Context Window Control after a blocked submission"`. Today's source probe produced two identical blocked force events but only one steer call.

**Do not touch:** threshold calculations, prompt wording, highest-stage coalescing, compaction reset and exactly-once handling of accepted running/queued results.

**Meta:** links `bugs/28_DONE_context_window_control_empty_skills_rejected.md`, EXP-0015 and GOAL.md criterion 2. Skeptic independently ran the real SessionRuntime public path and observed `{"identicalBlockedForceEvents":2,"steerCalls":1,"firstPrompt":true}`. This was a controlled public-boundary probe, not a packaged-VSIX or owner-profile run.
