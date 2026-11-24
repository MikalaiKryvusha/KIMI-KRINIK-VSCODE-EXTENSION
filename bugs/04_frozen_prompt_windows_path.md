# Bug 04 — Frozen compaction prompt has a concatenated Windows cwd and unreadable listing

**Status:** 🔴 OPEN
**Build:** KIMI KRINIK 1.0.0 · `74a76daf2` · **Environment:** Windows · Node v24.15.0 · real agent-core harness · **Evidence:** assertion diff at `fullCompaction.test.ts:303` and `testcases/reports/2026-11-24_inflight_auto_compact_off.md`
**Version/build:** KIMI KRINIK 1.0.0 · `74a76daf2` · **When/context:** 2026-11-24 02:28 +03:00, full `fullCompaction` suite after K2.6
**Severity:** S2
**Fix accepted when (observable):** `keeps the active profile system prompt frozen after compaction without resetting active tools` passes on Windows with `cwd:<absolute temp workdir>` and `ls:└── AGENTS.md`, and the same case still passes on Linux CI.

## Description

The frozen-profile test builds an invalid prompt: the expected temporary cwd is prefixed by the repository cwd, and the workspace listing becomes `[not readable]`. The failure reproduces with and without the K2.6 subscription, so it is outside that fix.

## Steps to reproduce

1. On Windows, run `pnpm exec vitest run --reporter=agent packages/agent-core-v2/test/agent/fullCompaction/fullCompaction.test.ts -t "keeps the active profile system prompt frozen"`.
2. Read the assertion diff at `fullCompaction.test.ts:303`.

## Expected result

`before` equals `exactCompactionPrompt(workDir, "old project instructions")`, with an absolute temporary cwd and `ls:└── AGENTS.md`.

## Actual result

`before` instead contains `cwd:/work/ai_sandbox/KIMI-KRINIK-VSCODE-EXTENSION/F:/Temp/kimi-compact-refresh-work-<suffix>` and `ls:[not readable]`. The expected value starts with `cwd:F:/Temp/kimi-compact-refresh-work-<suffix>`.

## Forensics

- The failure occurred in the full suite and in isolation.
- Repeating it with the K2.6 `loopControl` subscription removed produced the same diff, which rules out that subscription as the cause.
- The harness emits `os:Linux` and `shell:bash:/bin/bash` in the prompt while running on Windows; whether this is fixture configuration or path handling is not established.

## Root cause / Hypotheses

1. Windows absolute path handling joins the repository cwd and a drive-letter temp path incorrectly.
2. The fixture uses a path shape the prompt builder does not normalize, which also makes the AGENTS directory read fail.
3. The expected-value helper and the actual context resolver use different path semantics. No code cause has been confirmed.

## Fix plan

Trace `exactCompactionPrompt` and the real profile context/cwd listing on Windows, then fix the owning path normalization or the incorrect expectation. Add a Windows regression that asserts both the prompt cwd and the listing; run Linux CI to preserve the existing contract. This is the next engine-test investigation after the current handover, not part of K2.6.

## Decisions made without the owner

Deferred as a separate pre-existing defect after proving it on the original service; no product code was changed by this report.

## Links

- `testcases/reports/2026-11-24_inflight_auto_compact_off.md`
- `bugs/05_pre_post_compact_hook_log_empty.md`
