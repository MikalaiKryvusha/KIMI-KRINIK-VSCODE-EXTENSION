# Bug 28 — Context Window Control never delivers its threshold prompts

**Status:** ✅ DONE — real SDK, isolated VSIX and accumulated main-profile threshold delivery verified
**Version/build:** KIMI KRINIK 1.0.0 build 12 · `6fea8307b` · owner's accumulated VS Code profile · **When/context:** 2026-11-25 09:28 +03:00, after an autonomous session ended at the provider token limit
**Severity:** S2 — the working run was lost at 100% context
**Fixing:** this session
**Goal vector:** **Avoid + Maintain.** With Context Window Control ON, threshold notifications must reach the model before the provider rejects the next request, without requiring KAIF or a skill activation.
**Fix accepted when (observable):** a real `SessionRuntime` threshold crossing delivers the KIMI KRINIK control line through the public SDK into a subsequent provider request in both idle and running states; the old empty-skills call fails the regression before the fix, the fixed path passes it, and no `promptWithSkills requires at least one skill` error is logged.

## Symptom

[OWNER] «Я нашел тебя утром с на 100% щзаполненным окном контекста чата.... Не сработала фича контроля. Баг в core функционале.» · 2026-11-25 09:28 +03:00 (чат)

Context Window Control was ON in KIMI KRINIK 1.0.0 (12), but the previous chat reached 100% and ended with:

`APIContextOverflowError: Invalid request: Your request exceeded model token limit: 1048576 (requested: 1048662)`

## Repro (deterministic)

1. Start a real SDK session with Context Window Control enabled and Auto Compact OFF.
2. Cross a configured context threshold so `SessionRuntime` receives `agent.status.updated` with `contextTokens` and `maxContextTokens`.
3. Observe the controller call `session.promptWithSkills(line, [], { steerIfActive: true })`.
4. The real skill service rejects the empty skill list with `promptWithSkills requires at least one skill`; no threshold message reaches the model.

Red before the product edit (2026-11-25 09:41 +03:00): `pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts apps/vscode/test/kimi-harness.integration.test.ts -t "Context Window Control"` failed both new cases. The fake session received 0 steer inputs, and the real provider received no request containing `<system>KIMI KRINIK context:` after a 10-second observation window. The other 94 selected-file cases were skipped by the name filter.

## Forensics

The overflowing session is `session_8478e886-9eb5-4bc6-8410-b07fefe5f80c`. Its real `agents/main/wire.jsonl` contains 797 token-count events and no actual `KIMI KRINIK context` control prompt. The only match for that string is source text read from the runtime test during work.

Final wire measurements include 1,046,730, 1,048,341 and 1,048,456 tokens. The next request then failed with `requested: 1048662` against the 1,048,576-token model limit.

`apps/vscode/src/runtime/session-runtime.ts` calls `promptWithSkills` with an empty skill array. `packages/agent-core-v2/src/features/skill/skillService.ts` explicitly rejects that input before any prompt is submitted. The runtime unit test mocked `promptWithSkills`, so it asserted the invalid call instead of exposing it.

The public SDK documents and implements `session.steer()` for the required boundary: a running session receives an immediate steer, while an idle session launches a fresh turn.

## Root cause

The extension selected the skills-only API for a prompt that intentionally has no skills. `ContextWindowController.observe()` catches the resulting rejection and only logs `Context Window Control observation failed`, leaving the chat unprotected while its token count continues to grow. This is a cross-layer extension/SDK contract defect, not an engine token-counting failure and not KAIF hook dormancy.

## Fix plan

INTENT: code does `promptWithSkills(line, [], { steerIfActive: true })`, which the real engine rejects; the failing task expects every enabled threshold notification to reach the model; the spec in `GOAL.md` criterion 2 requires independent KIMI KRINIK threshold control without KAIF, and the public SDK `steer()` contract provides immediate running-turn delivery plus an idle fresh turn.

1. Replace the runtime unit mock's invalid assumption with an assertion through the existing fake session's real `steer()` boundary; run it red against the unfixed runtime.
2. Add a real SDK/provider integration regression that crosses a threshold and reads the next provider request; run it red against the unfixed runtime.
3. Replace only the delivery call with `session.steer(line)`; keep thresholds, serialization, reset behavior and prompt text unchanged.
4. Re-run both regressions, affected extension tests, typecheck and root lint. Inspect the real request body and error log.
5. Search for other empty-skill `promptWithSkills` callers and record the twin sweep. Do not mark DONE until the real SDK path is observed; a full million-token live soak remains separate evidence.

## Fix evidence — 2026-11-25 10:07 +03:00

The runtime now uses `session.steer(line)`. Threshold calculation, serialization, reset behavior and control text are unchanged. The main tree has a patch changeset, and the owner-requested hotfix build 13 was separately produced from `6fea8307b` so it contains no later user-visible changes beyond the fix and build number.

Hygiene: the two new regressions failed before the edit and passed afterward. Main source passed 118 affected checks, then 48 files / 598 passed / 1 skipped, typecheck and `pnpm lint`. Build 20 passed static VSIX audit on six targets. Hotfix build 13 passed 117 affected checks, typecheck and win32-x64 static audit. Its full suite retains the known build-12 `usage-status-bar` wrapper failure (587 passed, 1 skipped, 1 failed); its nested-worktree lint stops on a `jsPlugins` ordering difference after oxlint itself reports zero warnings/errors. Neither unrelated item was changed to manufacture green.

Functional run: builds 20, 13 and 14 were installed separately into fresh isolated VS Code processes. With the real setting ON and Auto Compact OFF, `/clear` → `/import large-context.md` (720,000 chars) → prompt → held-response release delivered the 80% soft-closure instruction in subsequent provider requests at 180,209 / 212,144 = 84%. The installed manifests confirmed builds 20, 13 and 14 respectively, final UI had no internal error, and logs had neither `Context Window Control observation failed` nor the empty-skills rejection. Report: `testcases/reports/2026-11-25_context_window_steer_delivery.md`.

Build-13 artifact: `apps/vscode/artifacts/vsix/kimi-code-win32-x64-build13.vsix`; SHA-256 `7610a4c6d2251a272046f3cb4036ed58a4e5e15fa401a0e2c9a428a5e67abbb1`.

Build-14 full-work artifact ordered by the owner afterward: `apps/vscode/artifacts/vsix/kimi-code-win32-x64-build14.vsix`; SHA-256 `a0813b1072b2e90e671438675877ad0a21d40769b7af8bfef3a6f00ca4c8e3cc`. It contains all current work through the post-build-19 main tree plus this fix, passed six-target static audit, another 598-check full run, typecheck and root lint, and the same isolated active-turn 84%/80% observation.

@guard context-window-control-steer-delivery
THREAT: an enabled context threshold never reaches the model, allowing the next request to overflow the provider window.
PROVED-AGAINST: the exact pre-fix `promptWithSkills(line, [], ...)` path failed the fake runtime and real SDK/provider regressions before the edit.
GAP: no new million-token soak; the owner's accumulated main profile and a separately identified idle-first delivery were not observed. The running active-turn failure reported by the owner is covered.
ON-REAL-PATH: isolated real VS Code Extension Hosts running packaged builds 20, 13 and 14 through `/clear`, `/import`, prompt and active-turn release; accumulated main profile NOT YET.

TWINS: searched `promptWithSkills\(\s*[^,]+,\s*\[\]` and `skills:\s*\[\]` — found 0 other empty-skill `promptWithSkills` call sites: none. The many `skills: []` data fixtures are not calls to this API.
TWINS-MECH: using a skills-only boundary for skill-less delivery can appear as a positional empty array or an RPC `skills: []` payload; both syntaxes were searched, with no other production call site found.
BOTH-WAYS: source-level red/green regressions guard the code→SDK direction; installed-VSIX provider requests guard the package→runtime direction. Main-profile acceptance remains the outstanding reverse-world check.

REAL WORLD: accumulated — the owner's build-12 main profile and overflowing session; data and machine — the owner's Windows machine; path — KIMI KRINIK in VS Code. Verified on isolated packaged builds with generated large context, not yet on the accumulated main profile. Therefore this bug remains 🔧 rather than DONE.

## ✅ STATUS: DONE (2026-11-25 13:50 +03:00)

Hygiene: both regressions were red before the `session.steer()` fix and green afterward. Main extension passed 598 checks and lint/typecheck; the release-candidate line later passed 607 checks. Six-target package verification passed.

Functional run: isolated builds 20, 13 and 14 delivered the 80% soft-closure line at 84% during real active turns. On the owner's accumulated main profile running build 14, `agents/main/wire.jsonl:2974` recorded `prompt.steered` with the 70% warning at 625,186 / 891,289 tokens; line 2991 recorded a subsequent provider turn with the same control message. The owner was notified once at 70%.

REAL WORLD: accumulated — the owner's actual long-running build-14 session; data and machine — his Windows main profile; path — active KIMI KRINIK turn. Verified on the real world through `prompt.steered` and the subsequent provider request.

Report: `testcases/reports/2026-11-25_context_window_steer_delivery.md`.

## Decisions made without the owner

Classified as S2 because the run terminated and unsaved session work was at risk. Chose the existing public `steer()` API rather than weakening the engine's non-empty-skills contract or inventing a dummy skill. The owner already required independent threshold control and real host/SDK paths. At the owner's explicit suggestion, produced build 13 as a build-12-only hotfix instead of asking the owner to adopt later builds 13–19. The owner then explicitly ordered build 14 with all current work plus the fix, which supersedes build 13 as the recommended full artifact.

## Links

- `GOAL.md` criterion 2
- `PROJECT_ARCHITECTURE_INTERNAL_MAP.md` Context Window Control flow
- `testcases/reports/2026-11-24_kaif_kimi_context_alive.md` — real threshold transitions were explicitly left unobserved
- `bugs/KAIF/04_context_window_alive_dormant.md` — explains why KAIF `--alive` is intentionally dormant under built-in ownership
