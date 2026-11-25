# Test run report — secondary-model robot interaction guard

**Created:** 2026-11-24 01:04 +03:00 · **Run by:** project agent ·
**Version/build:** KIMI KRINIK 1.0.0 · `kaif/no-auto-compaction` working tree

## 1. Work

Add the missing component-level interaction guard for `SubagentModelDialog`: open through the robot, select an existing model, persist it with `effortChanged: false`, reopen and select Follow main model, then persist `secondaryModel: null` without changing the main model or reasoning effort. Basis: `STATUS.md` secondary-model checkpoint and the owner's persistence requirement.

## 2. Contour

Windows, Node and pnpm versions pinned by the repository, Vitest jsdom webview harness, real `SubagentModelDialog`, real Zustand settings store, mocked bridge boundary. The persistence function remains covered separately by `apps/vscode/test/secondary-model.test.ts` using real temporary TOML files.

REAL WORLD: accumulated — the owner's working tree and existing extension implementation; data and machine — the owner's Windows machine; path — webview component interaction through Testing Library. Component and store behavior verified; the accumulated VS Code profile and live Extension Host were not exercised.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-24 00:58 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/secondary-model.test.ts apps/vscode/test/webview/control-panel-settings.test.tsx` | 0 · baseline 2 files, 7 tests passed |
| 2 | 2026-11-24 01:01 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/secondary-model.test.ts apps/vscode/test/webview/control-panel-settings.test.tsx` | 0 · new robot scenario included, 2 files, 8 tests passed |
| 3 | 2026-11-24 01:01 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/control-panel-settings.test.tsx` with `effortChanged` mutated from false to true in `updateSecondaryModel` | 1 · exactly the new robot scenario failed on `effortChanged: true`; other 5 tests passed |
| 4 | 2026-11-24 01:02 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test` after restoring the implementation | 0 · 41 files, 506 passed, 1 skipped, 0 failed |
| 5 | 2026-11-24 01:02 +03:00 | `pnpm --filter kimi-code-kaif run typecheck` | 0 · extension and webview TypeScript checks passed |
| 6 | 2026-11-24 01:02 +03:00 | `pnpm lint` | 0 · comments, oxlint, import boundaries, guards, ratchet and instructions passed |
| 7 | 2026-11-24 01:04 +03:00 | `pnpm --filter kimi-code-kaif run build` | 0 · extension and webview production builds passed |

## 4. Checks

Hygiene: targeted component/persistence suites green; mutation `effortChanged: false → true` reddened exactly the new robot assertion; restored code green; full extension suite 506 passed / 1 skipped; typecheck, root lint and both builds green.
Functional run: NONE — no live Extension Host walk was performed; component interaction is hygiene evidence, not live product acceptance.

| Case | Status | Observation |
|---|---|---|
| Robot opens the secondary-model dialog | pass | Real button `secondary-model` opened the real dialog; existing model row was clickable |
| Existing-model selection | pass | `saveConfig` received `secondaryModel: { model: "reasoning" }`, main model `main`, effort `high`, `effortChanged: false` |
| Follow main model | pass | Reopening and selecting Follow main model sent `secondaryModel: null` with unchanged main model and effort |
| Guard sensitivity | pass | The named effort mutation failed only the new robot test; restoring false made the full suite green |
| Live Extension Host acceptance | skipped | Remains part of K5 live acceptance |

## 5. Found

- none

## 6. Traces

- `apps/vscode/test/webview/control-panel-settings.test.tsx`
- `apps/vscode/test/secondary-model.test.ts`
- `apps/vscode/webview-ui/src/components/SubagentModelDialog.tsx`
- `apps/vscode/webview-ui/src/stores/settings.store.ts`

## 7. Verdict

partial — the requested robot interaction and persistence guards passed with a targeted mutation proof and full hygiene; live Extension Host acceptance remains unobserved.
