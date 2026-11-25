# Test run report — build 34 Session header and Compact copy

**Created:** 2026-11-26 01:18 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK 1.0.0 build 34, VSIX SHA-256 `36a964774a474b70abfb369cd0371e853e5de6b9021ce6b22c65cb8e59f851b3`

## 1. Work

Verify the owner's Session-header contour/padding request and the replacement Russian Compact description. The test basis is the owner's verbatim requests in chat, `apps/vscode/test/webview/header.test.tsx`, and `apps/vscode/test/webview/i18n.test.ts`.

## 2. Contour

Windows 11, Node 24.15.0, pnpm 10.33.0, Vitest/jsdom, VS Code 1.123.0 isolated win32-x64 VSIX, CDP computed geometry and WebP readback. The accumulated isolated profile supplied an existing session with token totals.

REAL WORLD: accumulated — the owner's main VS Code profile and existing sessions; data and machine — his Windows machine and installed build 34; path — Second Side Bar. Build 34 was installed on the main profile, but its running Extension Host was not reloaded: Windows UI Automation could not open the command palette reliably, and no main-profile visual claim is made. The functional observations below are from the restarted isolated packaged product.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-26 01:04 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/header.test.tsx apps/vscode/test/webview/i18n.test.ts` | Expected red before implementation: 2 failed / 12 passed, on the old contour and old Russian sentence |
| 2 | 2026-11-26 01:05 +03:00 | Same targeted command | 14 passed / 0 failed |
| 3 | 2026-11-26 01:07 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test` | 643 passed / 1 skipped / 0 failed |
| 4 | 2026-11-26 01:07 +03:00 | `pnpm lint` and `pnpm --filter kimi-code-kaif typecheck` | Both exit 0 |
| 5 | 2026-11-26 01:09 +03:00 | `pnpm --filter kimi-code-kaif package:platform --target win32-x64` | Build 34 packaged; 44 files; static/package audit passed |
| 6 | 2026-11-26 01:09 +03:00 | `code --install-extension apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix --force` and `node .tmp/k5-install.mjs` | Both installations succeeded |
| 7 | 2026-11-26 01:10 +03:00 | `node .tmp/k5-close.mjs`, previous-PID check, `node .tmp/k5-vscode-ui.mjs launch`, existing-session open, `.tmp/k34-header-style.js`, and `node .tmp/k5-vscode-ui.mjs capture 95-build34-header-after` | New process 26332 replaced 44964; computed styles and WebP were read |
| 8 | 2026-11-26 01:11 +03:00 | `node .tmp/k5-cdp.mjs eval .tmp/k25-tooltips.mjs` | The live Russian Compact tooltip contained the requested new sentence |
| 9 | 2026-11-26 01:13–01:16 +03:00 | `.tmp/k34-main-reload.ps1` targeting main PID 42660 | Failed: focus/command-palette automation did not reach Reload Window; the main window was left running and no reload is claimed |
| 10 | 2026-11-26 01:21 +03:00 | Judge re-run: targeted Vitest, `pnpm lint`, typecheck, `pnpm --filter kimi-code-kaif package:verify --target win32-x64`, and `node .kaif/tools/kaif-testrun-lint.mjs check` | 14/14; all checks exit 0; 36 reports / 0 findings |
| 11 | 2026-11-26 01:22 +03:00 | Judge relaunched the isolated VSIX, opened the accumulated isolated session, and re-ran the header geometry and tooltip probes | Same four computed contours, Session 8px padding and 8.8px text gaps; requested Russian tooltip read again |

## 4. Checks

Hygiene: targeted checks were red on build-33 behavior and green after the change; the full extension suite is 643 passed / 1 skipped. Root lint, extension/webview typecheck, packaged build and VSIX static audit passed.

Functional run: the packaged build 34 was restarted, an accumulated isolated session was opened, and its header was read through computed CSS and a WebP screenshot. Session, tokens, History, and new-chat all computed to `oklch(0.274 0.006 286.033)`, 0.8 px solid borders and 8 px radius. Session padding changed from 1 px left / 4 px right to 8 px / 8 px; measured text-to-border gaps were 8.8 px on both sides. The live Compact tooltip was read with the new Russian sentence.

The visible mismatch came from the important alpha-40 border utility overriding the project's global border color on Session and History, while the normal declarations on tokens and new-chat did not override it. The fix removes that opacity difference instead of adding another layer of selector specificity.

| Case | Status | Observation |
|---|---|---|
| Shared header contour | pass | Four controls share the same computed border color, width, style, and radius |
| Session inner space | pass | 8 px computed side padding; 8.8 px measured text gaps; screenshot read |
| Russian Compact copy | pass | Live tooltip exactly contains `при заполнении контекстного окна модели на 85% её номинала` |
| Existing extension behavior | pass | 643 passed / 1 skipped; lint, typecheck, build, and package audit green |
| Main accumulated running profile | blocked | Build 34 installed; automated Reload Window did not execute, so running main geometry is not claimed |

## 5. Found

- `bugs/35_attachment_composer_chat_race.md` — the owner separately reported a text/image/composer timing race; it is recorded and not fixed by this UI-only run.
- Main-window UI Automation could not reload the owner's active window; this is a harness limitation, not evidence of a product defect.

## 6. Traces

- `.tmp/k5-vscode/95-build34-header-after.webp` — packaged header, opened and read at full-header crop
- `.tmp/k34-header-style.js` — before/after computed-style probe
- `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix`
- `.tmp/k5-vscode/96-main-reload-failed.png`, `97-main-reload-palette.png`, `98-main-view-menu.png` — failed main-reload harness evidence

## 7. Verdict

partial — the isolated packaged product and all hygiene pass; main-profile running-build observation remains blocked by the reload harness.
