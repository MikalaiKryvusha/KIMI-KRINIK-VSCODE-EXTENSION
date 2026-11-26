# Audit 001 · Family: secondary selection overwrites primary default

**Mechanism:** a secondary-only action carries the resumed primary model through a mixed host contract and writes it as the global default.
**Already guarded by:** UI payload assertions; no resumed-session/global-default regression.
**Occurrences:** F1.

## F1 — Choosing only a subagent model can change future chats' primary model

**Quote:** `apps/vscode/src/handlers/config.handler.ts:55-58` — `await ctx.harness.setConfig({ defaultModel: params.model, thinking: patch, });`.

**Failure scenario:** global default is B and a resumed session uses A. Status restoration makes currentModel=A. Selecting secondary S sends model=A with effortChanged=false; the host writes defaultModel=A before persisting S. Future new chats therefore use A without a primary-model choice. A later secondary-write failure does not undo the primary write.

**Severity:** Act — silent loss of primary default and possibly thinking default; high likelihood when the control is used after resuming a different-model session.

**Baseline:** new; the secondary branch is absent at the pinned base.

kaif-fp: apps/vscode/src/handlers/config.handler.ts :: secondary-write-overwrites-primary-default :: v2.10

**Dedup attestation:** reviewer searched bugs/plans/testcases for secondary/default/primary/resume combinations and found no existing ticket. Current UI coverage blesses the mixed payload rather than checking a resumed default.

**Fix sketch:** separate secondary-only persistence from primary model/effort saves through a dedicated RPC or explicit primary-change contract; do not call primary setConfig/setModel/setThinking for the secondary-only action.

**Fix accepted when:** a host regression with global B and resumed A leaves primary config untouched while S persists. Run `pnpm exec vitest run --reporter=agent apps/vscode/test/bridge-handler.test.ts apps/vscode/test/webview/control-panel-settings.test.tsx -t "secondary model"`. Today's real handler probe returned ok=true, persisted S, and called setConfig with `{defaultModel:"A",thinking:{enabled:true}}`.

**Do not touch:** deliberate primary model/effort selection, above-default effort persistence from bugs/27 and resumed-session restoration.

**Meta:** links EXP-0005, bugs/27 and `.changeset/kaif-secondary-model.md`. Host skeptic independently ran the real SaveConfig handler and persistence. Its output corrects only the reviewer's test-count detail, which does not refute the defect.
