# Test run report — Phase 2 model-picker Enter propagation (build 55)

**Created:** 2026-11-27 10:05 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK 1.0.0 build 55, win32-x64 VSIX

## 1. Work

Close `model-picker-enter-bubbling#F1`. Basis: `plans/06_epic04_phase2_act_findings.md` §4.5 and the owning audit card. Enter on favorite/provider must run only that native button action; currentModel and dialog visibility must remain unchanged. Search/list Enter, Arrow navigation, mouse selection and effort persistence are controls.

## 2. Contour

Windows 11, Node 24.15.0, VS Code 1.123.0. Component checks use the real `ModelPicker`, stores and `userEvent.keyboard`. Functional acceptance uses packaged build 55 in the isolated CDP profile, its accumulated Russian UI, real webview DOM focus and actual keyboard events. Initial current model is `testkit-model`; providers are Kimi Code and testkit. The provider dialog and screenshot were read directly.

REAL WORLD: accumulated — the owner's main profile and existing model defaults; data and machine — his Windows machine; path — KIMI KRINIK model picker. Build 55 is installed on the real main path and source/installed hashes match, but the running main Extension Host was not reloaded. Functional keyboard behavior is verified on the isolated accumulated profile, not claimed on the owner's running main session.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-27 09:52:48 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/model-picker.test.tsx -t "keyboard"` | red before fix: favorite remained `[]`; provider changed currentModel to `other`; Arrow/Enter control passed |
| 2 | 2026-11-27 09:53:24 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/model-picker.test.tsx` | 11/11 pass after the one-line guard |
| 3 | 2026-11-27 09:53:24 +03:00 | `pnpm --filter kimi-code-kaif run typecheck` | exit 0 for extension host and webview |
| 4 | 2026-11-27 09:53:56 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test` | 49 files, 676 passed / 1 skipped |
| 5 | 2026-11-27 09:53:55 +03:00 | `pnpm lint` | exit 0; all repository checks pass |
| 6 | 2026-11-27 09:56:25 +03:00 | `pnpm --filter kimi-code-kaif package:platform --target win32-x64` | build 55 packaged; 44 files, 19,463,036 unpacked bytes; package/static checks pass |
| 7 | 2026-11-27 09:56:58 +03:00 | Main `code --install-extension apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix --force`; isolated `node .tmp/k5-install.mjs` | both installations succeeded; source/main/isolated extension and webview SHA-256 values match |
| 8 | 2026-11-27 09:57:53 +03:00 | `node .tmp/k5-vscode-ui.mjs launch`; `node .tmp/k12-open-tab.mjs`; screenshot/CDP target readback | old `webview` locator timed out, but the actual screen and targets showed both sidebar and tab running; stand driver observation corrected without product changes |
| 9 | 2026-11-27 09:59:56–10:00 +03:00 | Focus first favorite through `.tmp/k5-cdp.mjs eval`; `node .tmp/k5-key.mjs Enter`; read favorite/current/dialog | K2.7 became favorite; current remained `testkit-model · МАКС`; dialog stayed open |
| 10 | 2026-11-27 10:01:56 +03:00 | Focus Kimi Code provider; real Enter; provider/options readback and `.tmp/k5-vscode/55-provider-enter.webp` | only provider filter activated; current/dialog unchanged; testkit option disappeared; screenshot visually confirmed |
| 11 | 2026-11-27 10:02–10:03 +03:00 | Focus search; real ArrowDown then Enter; readback, then restore testkit through provider/search Enter | K2.8 was deliberately selected and dialog closed; testkit was restored through the same public keyboard path |
| 12 | 2026-11-27 10:05:54 +03:00 | `pnpm --filter kimi-code-kaif test:extension-host --version 1.123.0` | build-55 fresh host prints Glass/Voice/Alert/Chime, opens webview and exits 0 |

## 4. Checks

Hygiene: the two new nested-button checks were red before the fix; the new Arrow/Enter control remained green. Full model picker is 11/11, full extension is 676 passed / 1 skipped, typecheck and root lint pass. Build-55 package/static audit and fresh Extension Host smoke pass.

Functional run: PASS on the real packaged build-55 webview. Actual Enter on Star K2.7 changed only favorite state and left current model/dialog unchanged. Actual Enter on Kimi Code changed only the filter. Search + ArrowDown + Enter selected K2.8 and closed the dialog, proving the parent list action still works. The screen was captured and read at `.tmp/k5-vscode/55-provider-enter.webp`.

| Case | Status | Observation |
|---|---|---|
| Favorite Enter | pass | K2.7 favorite toggled; current `testkit-model`; dialog open |
| Provider Enter | pass | Kimi Code filter active; current/dialog unchanged; only Kimi options visible |
| Search + Arrow + Enter | pass | K2.8 selected, dialog closed; testkit restored afterward |
| Mouse/search/effort controls | pass | existing full model-picker suite remains green |
| Installed main/isolated artifact | pass | build 55 with matching source/installed hashes |
| Running accumulated main | not verified | no main reload by R7 |

## 5. Found

- Fixed the bubbled-Enter defect with one early return for a nested native button.
- No global `preventDefault` or `stopPropagation` was added; native button Enter and parent search/list Enter coexist.
- Open: running accumulated-main observation only for this finding; other Phase 2 guest acceptance remains tracked separately.

TWINS: searched `DialogContent ... onKeyDown`, both quote forms of `key === "Enter"` and nested-button guards across webview source — found 0 other dialog-level active-row handlers with nested favorite/provider buttons.

TWINS-MECH: a parent keyboard handler interpreted bubbled child-button activation as list selection. Searched parent React keyboard props, both Enter comparison syntaxes and native-button ancestor guards; other Enter handlers are scoped directly to their input and do not own a nested list/button set.

## 6. Traces

- `apps/vscode/webview-ui/src/components/ModelPickerDialog.tsx` — nested-button guard.
- `apps/vscode/test/webview/model-picker.test.tsx` — favorite/provider/Arrow keyboard contracts.
- `.tmp/k5-vscode/55-provider-enter.webp` — real packaged provider state, opened and read.
- `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix` — packaged build 55.
- `plans/06_epic04_phase2_act_findings.md` §4.5 and the owning audit card.

## 7. Verdict

pass — the scoped nested-Enter finding is closed with red-before component checks and green packaged keyboard observations on build 55. The running main Extension Host remains a separate acceptance boundary.
