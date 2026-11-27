# Test run report — Phase 2 secondary-only primary default (partial)

**Created:** 2026-11-27 09:29 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK 1.0.0 working tree, no new VSIX

## 1. Work

Close the public-handler mechanism in `secondary-primary-default#F1`. Basis: `plans/06_epic04_phase2_act_findings.md` §4.3 and `reports/KAIF_AUDIT/2026-11-26_kimi_krinik_1_0_0_secondary-primary-default.md`. Packaged guest and accumulated-main acceptance remain separate Phase 2 gates.

## 2. Contour

Windows 11, Node 24.15.0, Vitest through the real `BridgeHandler` and real secondary TOML persistence/SDK validation in a temporary directory. The harness config/catalog boundary is mocked; global default B, resumed primary A and secondary S are distinct. No VSIX was built or opened for this run.

REAL WORLD: accumulated — the owner's main profile, existing global config and resumed sessions; data and machine — his Windows machine; path — Secondary model selection in Control Panel. Not verified there in this run; production acceptance remains open.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-27 09:23:24 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/bridge-handler.test.ts -t "secondary-only"` | red before fix: both new cases observed `setConfig({ defaultModel: "resumed/a", thinking: { enabled: true } })`; 2 failed, 39 skipped |
| 2 | 2026-11-27 09:24:33 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/bridge-handler.test.ts apps/vscode/test/webview/control-panel-settings.test.tsx` | 73/73 pass after the fix |
| 3 | 2026-11-27 09:27:19 +03:00 | `pnpm --filter kimi-code-kaif run typecheck` | exit 0 for extension host and webview |
| 4 | 2026-11-27 09:27:23 +03:00 | `pnpm lint` | exit 0; comments, oxlint, import boundaries, guards, ratchet, test doubles, quarantine and instructions pass |

## 4. Checks

Hygiene: both new checks were red on the original handler and green afterward. The complete bridge-handler and Control Panel settings files are 73/73; deliberate primary save, `effortChanged:false` without secondary, effort persistence and secondary UI payload controls remain green. Typecheck and root lint pass.

Functional run: NONE. No packaged VSIX user path, real mouse/keyboard path or accumulated-main session was exercised.

| Case | Status | Observation at the public handler boundary |
|---|---|---|
| Global B + resumed A + secondary S, `effortChanged:false` | pass | S and its default effort persist in TOML; primary `setConfig`, `setModel` and `setThinking` are not called |
| Secondary persistence failure | pass | the request returns an error and leaves both global and resumed primary state untouched |
| Deliberate primary save | pass | existing config-write and effort controls remain green |
| Packaged guest and accumulated main | not verified | remaining Phase 2 acceptance |

## 5. Found

- Fixed at the owning handler: a secondary-only request no longer falls through to primary config/runtime persistence.
- The original defect was observed twice before the fix, including the failure path where the primary write preceded the secondary error.
- Open: packaged functional acceptance; the other Phase 2 findings are not covered by this report.

TWINS: searched `secondaryModel|secondary_model`, `effortChanged` and `defaultModel: params.model` across TypeScript — found 0 other mixed primary/secondary save sites. The TUI and app-core secondary writers use domain-only patches.

TWINS-MECH: a secondary-only action reused a combined save request and unintentionally persisted primary state; camelCase and snake_case secondary fields, the effort-change marker and primary-default assignment were searched. Only the VS Code `SaveConfig` handler combines those inputs.

BOTH-WAYS: the regression guards both sides of the invariant — global config receives no primary write and resumed runtime receives no primary model/thinking setter.

## 6. Traces

- `apps/vscode/test/bridge-handler.test.ts` — secondary-only success and failure regressions.
- `apps/vscode/src/handlers/config.handler.ts` — `secondaryOnly` bypasses only the primary block.
- `apps/vscode/test/webview/control-panel-settings.test.tsx` — existing secondary selection/clear payload controls.
- `plans/06_epic04_phase2_act_findings.md` §4.3 and the owning audit card.

## 7. Verdict

partial — the owning public-handler mechanism, surrounding tests, typecheck and lint pass. Packaged guest and accumulated-main functional acceptance remain open, so this is not a production DONE claim.
