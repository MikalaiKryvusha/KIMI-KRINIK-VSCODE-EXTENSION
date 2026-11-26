# Bug 04 — Frozen compaction prompt has a concatenated Windows cwd and unreadable listing

**Status:** 🔧 Windows harness fixed and full file 123/123; Linux CI acceptance pending
**GitHub issue:** https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues/28
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

The original failure reproduced on Windows. After the harness fix, the same test passes with host-native absolute cwd and readable `AGENTS.md`; Linux remains unrun locally.

## Forensics

- The failure occurred in the full suite and in isolation.
- Repeating it with the K2.6 `loopControl` subscription removed produced the same diff, which rules out that subscription as the cause.
- The harness emits `os:Linux` and `shell:bash:/bin/bash` in the prompt while running on Windows; whether this is fixture configuration or path handling is not established.

## Root cause / Hypotheses

1. Confirmed: the test supplied real Windows temp paths and HostFS to `hostEnvironmentServices`, which hardcoded POSIX path mapping. POSIX resolve prefixed the repository cwd and made listing unreadable.
2. Confirmed: expected cwd now uses host-native path resolution; Windows uses backslashes while AGENTS display paths retain their existing normalized form.
3. The production environment path mapping was not changed.

## Fix evidence — 2026-11-25 03:45 +03:00

`hostEnvironmentServices` accepts an explicit path class with POSIX default; only this real-host test selects win32 on Windows. `exactCompactionPrompt` uses `node:path.resolve` for the host-native expected cwd. The original prefixed-path/unreadable-listing assertion was red before and green after; the full compaction file is 123/123, agent-core typecheck and root lint pass.

Linux verification: not run. `wsl.exe` exists but reports WSL is not installed; no Docker executable is available. POSIX remains the helper default and Linux expected resolution is unchanged, but this is not claimed as an observed Linux pass. The bug stays open pending CI.

## Decisions made without the owner

Deferred as a separate pre-existing defect after proving it on the original service; no product code was changed by this report.

## Links

- `testcases/reports/2026-11-24_inflight_auto_compact_off.md`
- `bugs/05_DONE_pre_post_compact_hook_log_empty.md`
