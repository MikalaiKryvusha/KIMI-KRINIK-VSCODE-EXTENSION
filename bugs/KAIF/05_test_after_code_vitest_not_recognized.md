# KAIF bug: test-after-code reports Vitest runs as not run and never clears their debt

kaif-fp: framework/hooks/test-after-code.mjs#default-code-run-detection :: vitest-run-not-cleared :: v2.10
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/206
**Autocapture** (from `.kaif/kaif.json` + update receipt): KAIF 2.10 · project KIMI KRINIK · sphere programming · language ru · i18n ru · tracking origin · agent system kimi-code · OS Windows · Node v24.15.0
**Severity:** S2
**Dedup attestation:** searched `bugs/KAIF/` (`Grep "test-after-code|testHook|vitest|test debt" bugs/KAIF/*.md` → no matches) and open origin issues (`gh issue list --repo MikalaiKryvusha/KAIF --state open --search "test-after-code vitest test runner debt" --limit 20` → no matches). No match found.

## Expected per canon

The repository's root `AGENTS.md` names `pnpm exec vitest run --reporter=agent <file or directory>` as the standard affected-test command. A successfully executed test file must not subsequently be reported as `Not run` by the testing hook. `TESTING_FRAMEWORK.md` separately requires a functional user-path run and its readback; this ticket does not claim that a unit runner alone proves that functional run.

## Got in the field

After `pnpm exec vitest run --reporter=agent apps/vscode/test` completed 48 files with 598 passed and 1 skipped, `node .kaif/hooks/test-after-code.mjs --status` still reported the same 162 files as `test debt`, including `apps/vscode/test/session-runtime.test.ts`.

A deterministic call of the hook's exported `cleared()` with one debt entry and the exact standard command returned:

`{"command":"pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts","cleared":[]}`

The same field run also completed the engine compaction suite 123/123 and two OAuth suites 44/44. The build-14 functional VS Code path was run separately and read, so the issue is specifically the debt tracker's false `Not run` claim, not missing product verification.

## Repro (deterministic)

1. Write or edit a TypeScript test file so the default `code` debt kind records it.
2. Run it with the repository-standard `pnpm exec vitest run --reporter=agent <that-file>`.
3. Observe a passing Vitest result.
4. Run `node .kaif/hooks/test-after-code.mjs --status`; the file remains listed as not run. Calling `cleared()` with the same command returns an empty list.

## Cost and violated invariant

The hook repeatedly interrupts completion with a false claim that code was not run. In this project the debt grew to 162 entries, including test files, source modules and scratch harnesses, while real suites and real VS Code functional runs had already executed. This undermines honest-green and cold-start: future sessions are pushed either to repeat completed work indefinitely or to use `--waive` without its allowed reason.

## What in KAIF led to this

With no `testHook` configuration in `.kaif/kaif.json`, the default `code` path recognizes a run only when an interpreter's first script argument is the debt file itself. A Vitest command has `pnpm`/`vitest` as the executable and therefore never matches, even when the test file is explicitly present and was actually executed. The default heuristic has no safe mapping for repository-standard test runners or their associated source modules.

## Local remediation (per the "defect in KAIF itself" contour, if applied)

After the real suites and repeated build-14 functional run, the hook's own `--waive` was used once because standalone direct-interpreter execution is not a valid runner for these TypeScript/Vitest modules and historical scratch harnesses. The waiver record preserves that reason and the actual evidence (598 + 123 + 44 checks plus the real VS Code path); `test debt: none` followed. No manual debt deletion or fake direct-import run was used. Product verification is recorded in `testcases/reports/2026-11-25_context_window_steer_delivery.md`. A permanent configuration/fix still needs to distinguish full-suite and targeted-suite coverage rather than clearing every source debt on any Vitest invocation; that design is left explicit for upstream instead of silently weakening the guard.
