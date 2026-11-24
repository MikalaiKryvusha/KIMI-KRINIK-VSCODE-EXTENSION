# Bug 05 — PreCompact and PostCompact hook log is empty

**Status:** 🔴 OPEN
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

The mapped list is `[]`.

## Forensics

- The failure occurred in the full suite and in isolation.
- Repeating it with the K2.6 `loopControl` subscription removed produced the same empty list.
- The test waits with `vi.waitFor`; an empty list therefore is not merely the immediate first render.

## Root cause / Hypotheses

1. PreCompact/PostCompact are not invoked by the compaction module on this path.
2. The hook runner writes to a different log than `readHookPayloads` reads.
3. Hook registration or payload persistence is broken on Windows. No cause has been confirmed; this is not yet evidence that the product hooks never run.

## Fix plan

Trace the runner registration and the log path, then verify whether the calls are absent or only the evidence is missing. Repair the owning layer and prove the guard red by suppressing each hook once, then green with both calls in order. Keep this separate from K2.6 and bug 04.

## Decisions made without the owner

Deferred as a separate pre-existing defect after proving it on the original service; no product code was changed by this report.

## Links

- `testcases/reports/2026-11-24_inflight_auto_compact_off.md`
- `bugs/04_frozen_prompt_windows_path.md`
