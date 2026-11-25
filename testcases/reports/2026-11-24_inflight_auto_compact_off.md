# Test run report — in-flight Auto Compact OFF

**Created:** 2026-11-24 02:34 +03:00 · **Run by:** project agent ·
**Version/build:** KIMI KRINIK 1.0.0 · agent-core-v2 working tree

## 1. Work

Close K2.6: when `autoCompact` becomes false during an active automatic compaction, cancel that operation immediately without cancelling a manual compaction. Basis: `D:/work/ai_sandbox/KAIF/plans/150_epic147_K2_behavior_controls.md` K2.6 and the existing `auto_compact` contract in `docs/en|zh/configuration/config-files.md`.

The implementation subscribes `AgentFullCompactionService` to `onDidSectionChange`, filters `loopControl`, and aborts only `active.trigger === "auto"` when the effective config is disabled. The abort must be visible before the deferred provider response; a late response must not apply a summary.

## 2. Contour

Windows, real `AgentFullCompactionService` and config service in the agent-core test harness, deferred mock provider responses, node typecheck, extension Vitest and root lint. No engine API shape changed.

REAL WORLD: accumulated — the owner's working tree and actual engine implementation; data and machine — the owner's Windows machine; path — real service `begin` → deferred generate → live `config.set("loopControl", { autoCompact: false })` → cancellation/completion events. The real engine path verified; a live VS Code settings flip was not exercised.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-24 02:22 +03:00 | `pnpm exec vitest run --reporter=agent packages/agent-core-v2/test/agent/fullCompaction/fullCompaction.test.ts -t "cancels an in-flight auto compaction"` before the subscription | 1 · `full_compaction.cancel` count 0 before provider release; immediate behavior red |
| 2 | 2026-11-24 02:28 +03:00 | `pnpm exec vitest run --reporter=agent packages/agent-core-v2/test/agent/fullCompaction/fullCompaction.test.ts -t "autoCompact becomes false"` | 0 · automatic cancellation and manual completion both passed |
| 3 | 2026-11-24 02:28 +03:00 | `pnpm exec tsc -p packages/agent-core-v2/tsconfig.json --noEmit` | 0 · agent-core typecheck passed |
| 4 | 2026-11-24 02:28 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test` | 0 · 44 files, 527 passed, 1 skipped |
| 5 | 2026-11-24 02:29 +03:00 | `pnpm lint` | 0 · comments, oxlint, import boundaries, guards, ratchet and instructions passed |
| 6 | 2026-11-24 02:28 +03:00 | `pnpm exec vitest run --reporter=agent packages/agent-core-v2/test/agent/fullCompaction/fullCompaction.test.ts` | 1 · 121 passed, 2 failed outside K2.6 |
| 7 | 2026-11-24 02:33 +03:00 | same two failing cases with the new subscription temporarily removed | 1 · identical Windows-path and empty-hook-log failures; subscription restored and K2.6 re-verified green |

## 4. Checks

Hygiene: immediate red-to-green K2.6 scenarios; agent-core typecheck, root lint and extension suite green. The full engine file has 121/123 passes; the two unrelated failures reproduce with and without the change and were not modified or hidden.
Functional run: real `AgentFullCompactionService` with a deferred provider. READ `full_compaction.cancel` before releasing the automatic response, then zero `compaction.completed` and zero `context.apply_compaction`; the manual task completed once and applied once.

| Case | Status | Observation |
|---|---|---|
| Auto OFF before any automatic start | pass | Existing before-step, after-step and overflow-disabled tests remained green |
| Auto OFF during generation | pass | `full_compaction.cancel` appeared before provider release; late summary was not completed or applied |
| Auto OFF during manual generation | pass | Manual task completed once and applied once; no `full_compaction.cancel` |
| Agent-core typecheck | pass | `tsc -p packages/agent-core-v2/tsconfig.json --noEmit` exited 0 |
| Extension regression suite | pass | 527 passed, 1 skipped |
| Frozen prompt / Pre-PostCompact hooks | fail, pre-existing | Both failed identically on the original service without the subscription; no K2.6 assertion involved |

TWINS: searched automatic-start checks and compaction cancellation paths — `begin`, `recoverFromContextOverflow` and the new live subscription cover all three automatic starts plus in-flight cancellation; manual `cancel()` and disposal behavior are unchanged.

## 5. Found

- Pre-existing, outside this change: `keeps the active profile system prompt frozen after compaction without resetting active tools` fails on Windows with a concatenated cwd and `ls:[not readable]`.
- Pre-existing, outside this change: `fires PreCompact and PostCompact hooks from the compaction module` returns an empty hook log. Both reproduce on the original service and are not fixed in this task.

## 6. Traces

- `packages/agent-core-v2/src/agent/fullCompaction/fullCompactionService.ts`
- `packages/agent-core-v2/test/agent/fullCompaction/fullCompaction.test.ts`
- `docs/en/configuration/config-files.md`
- `docs/zh/configuration/config-files.md`

## 7. Verdict

partial — K2.6 and all affected checks passed with a real engine mid-flight run; a live VS Code flip remains K5, and the two unrelated pre-existing failures remain open evidence rather than a green full-file claim.
