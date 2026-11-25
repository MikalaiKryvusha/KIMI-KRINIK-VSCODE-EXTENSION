# Bug 33 — Skill variant test compares normalized and native Windows paths

**Status:** ✅ DONE · Windows path normalization fixed in the test assertion on 2026-11-25
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

## ✅ STATUS: DONE (2026-11-25 20:24 +03:00)

The assertion now applies built-in `node:path.resolve` to both paths before the substring check. This preserves the original variant count, path ownership and activation expectations; no production path changed and no dependency was added.

Hygiene: the old test was red before the fix and green afterward; full `session-skills` is 14/14, SDK typecheck and root lint exit 0. A first attempted `pathe` import was rejected by the package boundary and replaced with the built-in path API before verification.
Functional run: the real SDK session listed both variants, activated the explicit additional-dir path and completed on Windows. Linux was not run on this machine; the same built-in normalization applies to POSIX paths.

REAL WORLD: accumulated — the existing SDK skill-variant session and temporary additional directory; data and machine — Windows VS Code test runtime; path — `session.listSkills()` and `session.activateSkill()` with the explicit secondary path. Verified on the real SDK path.

## Links

- `packages/node-sdk/test/session-skills.test.ts:100`
- `packages/agent-core-v2/src/features/skill/catalog/parser.ts:92`
- `ideas/02_control_panel_skill_picker.md`
