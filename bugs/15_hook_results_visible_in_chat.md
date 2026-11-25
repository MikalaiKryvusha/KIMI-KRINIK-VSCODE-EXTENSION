# Bug 15 — Internal KAIF hook results are rendered as assistant chat text

**Status:** 🔧 replay and live hook rendering fixed and verified on isolated build 22; accumulated main-profile running-build acceptance pending
**Version/build:** KIMI KRINIK 1.0.0 builds 12 and 19 · owner's accumulated VS Code profile · **When/context:** 2026-11-24 13:09 +03:00 and 2026-11-25 16:56 +03:00, owner live sessions
**Severity:** S2
**Fixing:** next work session inside KIMI KRINIK; run and verify fixes in an isolated VS Code environment
**Fix accepted when (observable):** initial prompts, steering messages and resumed history deliver UserPromptSubmit hook results to the agent but render no `KAIF context refresh`, `clock-now`, `KAIF knowledge` or raw `hook_result` text in the visible conversation; the user's own content remains unchanged.

## Symptom

Technical blocks appear under «Размышление» after the owner's messages. Examples include `KAIF context refresh`, `clock-now · 2026-11-24 13:04 +03:00` and `KAIF knowledge: the owner spoke`. The owner does not know why these internal messages are shown.

## Repro

1. Run KIMI KRINIK with the project's KAIF hooks active.
2. Send an ordinary message and then steering messages during the turn.
3. Inspect visible assistant steps immediately and after session reload.

## Expected result

Hook results accompany the agent's internal work only. They must never become a separate user-facing message or assistant content. [OWNER] «Звучит логично, чтобы это не по отправкам сообщений юзера происходила, а по самой подкапотной работе агента. Юзеру в чат это показывать смысла нет. Юзеру это не нужно и путает его.» · 2026-11-24 14:37 +03:00 (чат)

## Actual result

The owner's screenshots show complete internal hook instructions as visible chat text.

## Forensics

2026-11-25 16:56 +03:00 — [OWNER] «опять ты высрал какой-то технический теккст в чат», followed by a visible block containing `clock-now · 2026-11-25 16:55 +03:00` and repeated `KAIF knowledge` instructions; «это баг КИМИ КРИНИК, или КАИФ адаптации под КИМИ КРИНИК?» (чат). This is direct main-profile build-19 evidence for the previously unverified live path. `apps/vscode/src/runtime/event-adapter.ts:229-233` maps every live `hook.result` to assistant `ContentPart`; KAIF supplies the internal payload, but KIMI KRINIK owns the incorrect visible rendering.

`apps/vscode/src/runtime/replay-adapter.ts:116-126` explicitly filters `user prompt submit hook` parts, extracts `hookResultBody(part.text)` and emits each as a normal `ContentPart`. `apps/vscode/test/replay-adapter.test.ts:385-435` currently expects `merged hook note` to be emitted as visible content, so the test encodes behavior that contradicts the owner's requirement. The live non-replay path still needs its own observation.

## Root cause / Hypotheses

The replay adapter has a confirmed user-facing rendering path for internal hook text. Whether the immediate steering display uses the same path or an additional adapter is not yet established. A separate hypothesis raised by the owner is the KAIF↔Kimi integration itself: `UserPromptSubmit` may be the wrong place to surface agent-internal instructions. That requires a hook-contract review and is not proof of a KAIF defect; the visible UI rendering is already proven.

## Fix plan

Change the replay contract and its existing assertion intentionally from visible hook text to hidden hook text, then inspect the live event adapter for the twin path. Verify ordinary, steering and resumed sessions in an isolated installed VSIX with real KAIF hooks and screenshots.

## Decisions made without the owner

Classified these messages as internal because their contents are agent instructions, and the owner explicitly rejected their visible appearance. No product code or tests were changed in this report.

## Links

- `apps/vscode/src/utils/hook-parts.ts`
- `apps/vscode/src/runtime/replay-adapter.ts`
- `apps/vscode/test/replay-adapter.test.ts`

## Fix evidence — 2026-11-24 22:21 +03:00

The replay adapter no longer turns `UserPromptSubmit` hook parts into assistant `ContentPart` events. `withoutUserPromptSubmitHookParts` still controls the visible user content, while the hook payload remains in engine input. The now-unused body extraction helper was removed.

Hygiene: the changed existing regression was red before removal because `merged hook note` was visible; after removal 31/31 replay tests pass and `Merged prompt` remains. TWINS: searched `hookResultBody`, `isUserPromptSubmitHookPart`, `hook_result` and `user prompt submit hook` across `apps/vscode`; no second product rendering site remains.
Functional run: NONE on final build 11 yet. The owner's real-profile screenshot after full VS Code restart is still required.

## Fix evidence — 2026-11-25 17:16 +03:00

The live adapter no longer projects `hook.result` into assistant `ContentPart`. Engine input and UserPromptSubmit delivery are unchanged.

Hygiene: the main-agent live-adapter regression was red before the filter and green afterward. Adapter/replay suites total 62 passed; the full extension suite is 610 passed / 1 skipped, with typecheck and root lint green.

Functional run: isolated build 20 reproduced the exact visible `clock-now · probe` / `KAIF knowledge` block and its disappearance on `StepBegin`; the model request contained the same hook. On builds 21 and 22 the real hook remained in model input but produced no visible hook text or hook `ContentPart` in the UI trace. Report: `testcases/reports/2026-11-25_chat_rendering_build_22.md`.

@guard live-hook-result-visibility
THREAT: internal clock/KAIF instructions become an assistant message on the owner's live path.
PROVED-AGAINST: a main-agent `hook.result` produced visible `ContentPart` before the filter, and isolated build 20 showed the same text before `StepBegin`; builds 21/22 hid it while model input retained it.
GAP: no other hook event family was visually exercised; the adapter change intentionally suppresses all `hook.result` UI projections because they are internal by contract.
ON-REAL-PATH: isolated packaged build 22 verified with real UserPromptSubmit/KAIF-dispatcher delivery; accumulated main-profile running build 22 NOT YET.

REAL WORLD: accumulated — the owner's actual KAIF hooks and messages on his Windows main profile; data and machine — his live sessions on builds 12 and 19; path — initial and steering prompts in Second Side Bar. Build 22 is installed on that profile, but its running Extension Host has not been restarted and observed. This bug is not DONE.

TWINS: searched `hook.result`, `hookResultBody`, `ContentPart` creation from hook content and UserPromptSubmit handling across `apps/vscode`; live and replay projections are now both suppressed, with no second visible hook-to-content site found.

TWINS-MECH: internal instructions can become visible through live event mapping, history reconstruction, optimistic reconciliation or a model-generated quotation. Live mapping and history reconstruction were checked; a model independently choosing to quote internal text is outside this rendering defect and is not hidden by rewriting model output.
