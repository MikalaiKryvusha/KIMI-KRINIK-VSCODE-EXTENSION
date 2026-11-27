# Audit 001 · Family: model-picker Enter propagation

**Mechanism:** Enter from a nested favorite/provider button bubbles to the dialog's list-selection handler, which selects the highlighted model and closes before the native button action.
**Already guarded by:** mouse favorite/provider cases and Enter from search; nested keyboard actions are unguarded.
**Occurrences:** F1.

## F1 — Enter on a favorite or provider unintentionally selects the active model

**Quote:** `apps/vscode/webview-ui/src/components/ModelPickerDialog.tsx:95` — `} else if (event.key === "Enter") {`.

**Failure scenario:** Tab to Star Other or a provider filter and press Enter. The parent chooses `filtered[activeIndex].id` and closes; the focused control's native action is lost.

**Severity:** Act — unintended model change and session/cache consequences; occurs on every keyboard attempt on those controls.

**Baseline:** new.

kaif-fp: apps/vscode/webview-ui/src/components/ModelPickerDialog.tsx :: nested-enter-selects-highlighted-model :: v2.10

**Dedup attestation:** searches for Enter/Star/favorite/provider found mouse-only favorite coverage and no existing defect.

**Fix sketch:** retain native Enter behavior for nested buttons; run model selection only for the search/list path and stop propagation for the handled branch.

**Fix accepted when:** keyboard cases prove Star changes only favorites and provider changes only the filter, with currentModel and dialog visibility unchanged. Run `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/model-picker.test.tsx -t "keyboard"`. Today's real component probes started at reasoning and ended at other with the dialog closed; favorite did not toggle.

**Do not touch:** Enter from search selecting the active row, Arrow navigation, mouse selection and effort persistence.

**Meta:** links bugs/27, the internal model-picker map and EXP-0002. UI skeptic used the real ModelPickerDialog, real stores and `userEvent.keyboard("{Enter}")`; no packaged-VSIX claim.

## Remediation — 2026-11-27 10:05 +03:00

Hygiene: the new favorite/provider keyboard cases were red on the original component: favorite stayed empty and provider changed currentModel to `other`. The Arrow/Enter control stayed green. After one nested-button early return, model picker is 11/11, full extension 676 passed / 1 skipped, typecheck, root lint and build-55 package/static audit pass. No global `preventDefault` or `stopPropagation` was added.

Functional run: PASS on the real packaged build-55 webview. Enter on Star K2.7 toggled only favorite, leaving `testkit-model` and the dialog unchanged. Enter on Kimi Code activated only its provider filter. Search + ArrowDown + Enter deliberately selected K2.8 and closed the dialog; testkit was restored through the public keyboard path. The provider screenshot was opened and read. Build 55 is installed on main/isolated with matching source/installed hashes; main was not reloaded. Evidence: `testcases/reports/2026-11-27_phase2_model_picker.md` and `.tmp/k5-vscode/55-provider-enter.webp`.

TWINS: searched `DialogContent ... onKeyDown`, both Enter comparison syntaxes and nested-button guards across webview source — found 0 other dialog-level active-row handlers with nested favorite/provider buttons.

TWINS-MECH: searched the forms a parent keyboard handler can use to reinterpret bubbled child-button activation as list selection: parent React keyboard props, single/double-quote Enter comparisons and native-button ancestor guards. Other Enter handlers are directly input-scoped and do not own a nested list/button set.
