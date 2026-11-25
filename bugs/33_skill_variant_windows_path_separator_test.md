# Bug 33 — Skill variant test compares normalized and native Windows paths

**Status:** 🔴 OPEN · pre-existing failure observed during the skill-picker work; not caused or changed by that work
**Version/build:** current `main` after `1f975aafa` · Windows 11 · **When/context:** 2026-11-25 19:16 +03:00, full `packages/node-sdk/test/session-skills.test.ts`
**Severity:** S2
**Fixing:** not in the Control Panel skill-picker change; kept separate per the focused-change rule
**Fix accepted when (observable):** the same-name variant test finds the additional-dir skill on Windows and POSIX without changing the production path contract or weakening assertions.

## Symptom

`lists and activates same-name variants through an explicit path` receives two variants, then `secondary` is `undefined` and reading `secondary.workspaceDir` throws.

## Repro

1. On Windows run `pnpm exec vitest run --reporter=agent packages/node-sdk/test/session-skills.test.ts -t "lists and activates same-name variants"`.
2. The test fails at line 131 after `expect(variants).toHaveLength(2)` passes.

## Forensics

- The fixture builds `additionalDir` with `node:path.join`, yielding native backslashes on Windows.
- `parseSkillText` imports `pathe`; its `path.resolve` produces slash-normalized skill paths.
- The test checks `skill.path.includes(additionalDir)` without normalizing both sides.
- The failure also occurs when this single old test is run alone. The skill-picker diff does not touch the fixture or production variant path handling.

Observed output: `TypeError: Cannot read properties of undefined (reading 'workspaceDir')` at `packages/node-sdk/test/session-skills.test.ts:131`.

## Root cause / Hypotheses

The test compares a slash-normalized path with a native Windows path using a case-sensitive substring check. This is a test portability defect, not evidence that the two returned variants are wrong.

## Fix plan

Outside the skill-picker scope: normalize both paths at the assertion boundary with the repository's path utility, preserve the exact variant count and activation assertions, and run the test on Windows and Linux. Do not change production paths or replace the current expectation with output-derived data.

## Decisions made without the owner

Kept this pre-existing portability defect out of the feature commit and documented it instead of hiding it behind a skip or a weaker assertion.

## Links

- `packages/node-sdk/test/session-skills.test.ts:100`
- `packages/agent-core-v2/src/features/skill/catalog/parser.ts:92`
- `ideas/02_control_panel_skill_picker.md`
