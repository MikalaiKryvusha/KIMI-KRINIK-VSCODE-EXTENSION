# Test run report — build 36 assistant text actions

**Created:** 2026-11-26 01:53 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK 1.0.0 build 36, VSIX SHA-256 `056843dde6bfa315a5295a517c049b2d37f6b7bfa8ba9e3556974d45b8ecf8a4`; intermediate build 35 was `d0165ff5c165b7a816881dc0a15606a2ed92bbccd83daa43570fb43ed49395e6`

## 1. Work

Verify the owner's requirement that every assistant text item has its own immediately adjacent Copy/Fork block, that Copy receives only that item's text rather than all text in the last step, and that both actions use the extension's custom tooltip rather than native `title` popups. The executable basis is the added coverage in `apps/vscode/test/webview/chat-message.test.tsx` and the owner's screenshots/wording in chat.

## 2. Contour

Windows 11, Node 24.15.0, pnpm 10.33.0, Vitest/jsdom, VS Code 1.123.0 isolated win32-x64 VSIX, testkit fake model, CDP input/geometry and WebP readback. The scripted real engine path produced `K35 first answer`, a ReadFile tool call and a held `K35 second answer` in one assistant response.

REAL WORLD: accumulated — the owner's main VS Code profile and existing sessions; data and machine — his Windows machine and installed build 36; path — Second Side Bar. Build 36 was installed on the main profile, but the main running Extension Host was not reloaded after the failed UI Automation attempts reported in build 34. Functional observations here are from restarted isolated packaged builds 35 and 36; main-profile acceptance remains unclaimed.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-26 01:31 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-message.test.tsx` | Expected red before implementation: 2 failed / 8 passed; no per-text action blocks existed |
| 2 | 2026-11-26 01:34–01:36 +03:00 | Same targeted command during fixture correction | Fixture used `message.turnIndex` instead of the public prop, then userEvent replaced the clipboard stub; both were corrected without weakening product assertions |
| 3 | 2026-11-26 01:37 +03:00 | Same targeted command | 10 passed / 0 failed |
| 4 | 2026-11-26 01:38 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test` | 645 passed / 1 skipped / 0 failed |
| 5 | 2026-11-26 01:38 +03:00 | `pnpm lint` and `pnpm --filter kimi-code-kaif typecheck` | Both exit 0 |
| 6 | 2026-11-26 01:41 +03:00 | `pnpm --filter kimi-code-kaif package:platform --target win32-x64` | Build 35 packaged; 44 files; static/package audit passed |
| 7 | 2026-11-26 01:41 +03:00 | `code --install-extension apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix --force` and `node .tmp/k5-install.mjs` | Main and isolated installations succeeded |
| 8 | 2026-11-26 01:45 +03:00 | `node --experimental-transform-types .tmp/k5-fake-model.mjs` | Fake model listened on `127.0.0.1:57667`; the initial strip-only TypeScript launch failed before writing configuration and was rerun with the built-in transform flag |
| 9 | 2026-11-26 01:46 +03:00 | New isolated process, `node .tmp/k5-send.mjs .tmp/k35-prompt.txt`, text waits and `.tmp/k35-actions-read.js` | Before release, the finished first text had a two-button block while the turn was still working; after release, both text items had two-button blocks |
| 10 | 2026-11-26 01:50–01:53 +03:00 | `.tmp/k35-copy-setup.js`, real CDP click, `.tmp/k35-tooltip.js`, `.tmp/k35-fork-tooltip.js`, WebP captures | Inner Clipboard API received exactly `K35 second answer`; both localized custom tooltips were opened and screenshots read |
| 11 | 2026-11-26 02:00–02:01 +03:00 | Added the code-copy preservation case, then `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-message.test.tsx` | Red on the unscoped shared tooltip; after the optional message-only tooltip boundary, 11/11 passed |
| 12 | 2026-11-26 02:01 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test`, `pnpm lint`, `pnpm --filter kimi-code-kaif typecheck` | Final full extension: 646 passed / 1 skipped; lint and typecheck exit 0 |
| 13 | 2026-11-26 02:03 +03:00 | `pnpm --filter kimi-code-kaif package:platform --target win32-x64`, main and isolated installation commands | Final build 36 packaged, audited and installed; 44 files |
| 14 | 2026-11-26 02:05 +03:00 | New isolated build-36 process, K35 session replay, action geometry, inner Clipboard capture, Copy tooltip and WebP readback | Replay preserved both blocks; exactly one write `K35 second answer`; custom tooltip visible in the final artifact |
| 15 | 2026-11-26 02:09 +03:00 | Final judge re-ran targeted Vitest, VSIX verify and `node .kaif/tools/kaif-testrun-lint.mjs check` | 11/11; 44-file VSIX audit green; 37 reports / 0 findings |

## 4. Checks

Hygiene: the two new component cases were red on the old implementation and green afterward; the code-copy preservation case was red before the message-only tooltip boundary. The final full extension suite is 646 passed / 1 skipped; root lint, extension/webview typecheck, packaged build and VSIX static audit passed. Existing stream-node identity checks remain green.

Functional run: a real packaged VSIX walked prompt → text → tool → held text → completion. The DOM and WebP were read. Every text item's last child is its own action block; the tool remains between the first and second text regions. Each block has exactly Copy and Fork with localized accessible names and no native `title`. The second Copy click passed only `K35 second answer` to the inner webview Clipboard API. Copy and Fork tooltip content carried the shared `bg-tooltip`, border, animation and typography classes and was visible in WebP.

| Case | Status | Observation |
|---|---|---|
| Per-text placement | pass | Two text items, two directly adjacent action blocks; tool remains outside both |
| Copy only adjacent text | pass | Exactly one intercepted write: `K35 second answer` |
| Finished text during active turn | pass | First block present while the second model response was still held |
| Fallback and partial text | pass | Component coverage keeps fallback actions and hides actions only on the currently unfinished text item |
| Custom Copy/Fork tooltips | pass | Both localized shared tooltip surfaces read in DOM and WebP; native titles absent |
| Existing extension behavior | pass | 646 passed / 1 skipped; lint, typecheck, build and package audit green |
| Code-copy behavior preserved | pass | Existing native code-block title remains; only assistant message actions use the custom tooltip |
| Main accumulated running profile | blocked | Build 36 installed; main-window reload was not achieved and no running-main claim is made |

## 5. Found

- `bugs/36_assistant_text_action_scope.md` — the implementation defect was the single bottom-level action block plus explicit joining of last-step text items; both were removed.
- Test fixtures required two corrections: `turnIndex` belongs to the public `ChatMessage` prop, and `userEvent.setup()` installs its own clipboard stub before the product spy is installed.
- The first live clipboard probe mistakenly instrumented the outer webview wrapper; its empty capture was rejected. The corrected inner-webview capture produced the reported exact write. The first real click is not claimed to have left the system clipboard untouched.
- `ToolRenderers.tsx` has a separate text join for a subagent's final output summary, not for the Copy action; it was deliberately left unchanged.

## 6. Traces

- `.tmp/k5-vscode/99-build35-assistant-actions.webp` — both per-text action blocks around the real tool card
- `.tmp/k5-vscode/101-build35-copy-tooltip-visible.webp` — custom Copy tooltip
- `.tmp/k5-vscode/102-build35-fork-tooltip-visible.webp` — custom Fork tooltip
- `.tmp/k5-vscode/103-build36-assistant-actions-replay.webp` — final build-36 replay, action blocks and Copy tooltip
- `.tmp/k35-actions-read.js`, `.tmp/k35-copy-setup.js`, `.tmp/k35-copy-read.js`, `.tmp/k35-tooltip.js`, `.tmp/k35-fork-tooltip.js`
- `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix`

## 7. Verdict

partial — the final isolated build-36 packaged user path and all hygiene pass; main-profile running-build observation remains blocked by the reload harness.
