# Bug 05 — PreCompact and PostCompact hook log is empty

**Status:** ✅ DONE — real hook child processes and payload log verified on Windows; full compaction file 123/123
**Build:** KIMI KRINIK 1.0.0 · `74a76daf2` · **Environment:** Windows · Node v24.15.0 · real agent-core harness · **Evidence:** assertion diff at `fullCompaction.test.ts:494` and `testcases/reports/2026-11-24_inflight_auto_compact_off.md`
**Version/build:** KIMI KRINIK 1.0.0 · `74a76daf2` · **When/context:** 2026-11-24 02:28 +03:00, full `fullCompaction` suite after K2.6
**Severity:** S2
**Fix accepted when (observable):** `fires PreCompact and PostCompact hooks from the compaction module` reads `[PreCompact, PostCompact]` in that order, with a passing guard proving a missing hook invocation fails again if the defect returns.

## Description

The compaction hook test reads an empty hook payload list instead of the required two entries. It reproduces with and without the K2.6 subscription, so the new live cancellation path is not the cause.

## Steps to reproduce

1. On Windows, run `pnpm exec vitest run --reporter=agent packages/agent-core-v2/test/agent/fullCompaction/fullCompaction.test.ts -t "fires PreCompact and PostCompact"`.
2. Read the assertion at `fullCompaction.test.ts:494`.

## Expected result

`readHookPayloads(hookLog).map((payload) => payload.hook_event_name)` equals `[PreCompact, PostCompact]`.

## Actual result

After quoting the logger executable and script path, the mapped list is `[PreCompact, PostCompact]`, with the required payload fields and ordering.

## Forensics

- The failure occurred in the full suite and in isolation.
- Repeating it with the K2.6 `loopControl` subscription removed produced the same empty list.
- The test waits with `vi.waitFor`; an empty list therefore is not merely the immediate first render.

## Root cause / Hypotheses

1. Refuted: PreCompact and PostCompact were both invoked by the compaction module; diagnostic callbacks observed both.
2. Confirmed: `hookPayloadLoggerCommand` returned an unquoted command while Node lives at `C:\Program Files\nodejs\node.exe`; shell execution split the executable path and no payload file was written.
3. The product hook runner and registration were not changed.

## Resolution

Quote both `process.execPath` and the generated script path in the test logger command. Removed the temporary resolution diagnostics after proving both hooks fired.

## ✅ STATUS: DONE (2026-11-25 03:45 +03:00)

Hygiene: the original empty-list test was red before quoting and green afterward; full compaction 123/123, agent-core typecheck and root lint pass.
Functional run: real agent-core compaction invoked two actual Node child hook processes. The JSONL log contained PreCompact then PostCompact with session/cwd/trigger and token-count fields, not an empty file. Evidence: `testcases/reports/2026-11-25_windows_compaction_harness.md`.

## Decisions made without the owner

Deferred as a separate pre-existing defect after proving it on the original service; no product code was changed by this report.

## Links

- `testcases/reports/2026-11-24_inflight_auto_compact_off.md`
- `bugs/04_frozen_prompt_windows_path.md`
