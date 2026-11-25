# Test run report — build 38 single-line sticky boundary

**Created:** 2026-11-26 02:52 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK 1.0.0 build 38, VSIX SHA-256 `45eb94d10ff97173340e424547baf90e50d9d4094bb1420ba7cad17856357458`

## 1. Work

Verify the owner's new boundary in `bugs/31` and `plans/03`: a sticky prompt containing one line must have no fade, expand/collapse control or collapsed ARIA state, even when horizontal truncation is present. Multiline/media prompts must retain expansion, fade and scroll-preservation behavior.

## 2. Contour

Windows 11, Node 24.15.0, pnpm 10.33.0, Vitest/jsdom with explicit horizontal-overflow geometry, VS Code 1.123.0 isolated win32-x64 VSIX, testkit long response, CDP viewport/scroll control and WebP readback.

REAL WORLD: accumulated — the owner's main profile and current chat; data and machine — his Windows machine with build 38 installed; path — Second Side Bar. The isolated product was restarted and observed with a real one-line prompt and a previously saved multiline session. The main running Extension Host has not been reloaded, so main-profile acceptance is not claimed.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-26 02:40 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-area.test.tsx` | Expected red on `aria-expanded="false"` for the horizontally truncated single-line case; 1 failed / 11 passed |
| 2 | 2026-11-26 02:42 +03:00 | Same targeted command | 12 passed / 0 failed |
| 3 | 2026-11-26 02:42 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test`, `pnpm --filter kimi-code-kaif typecheck`, `pnpm lint` | 647 passed / 1 skipped; typecheck and lint exit 0 |
| 4 | 2026-11-26 02:44 +03:00 | `pnpm --filter kimi-code-kaif package:platform --target win32-x64` | Build 38 packaged; 44 files; static/package audit passed |
| 5 | 2026-11-26 02:44 +03:00 | Main `code --install-extension … --force` and isolated `node .tmp/k5-install.mjs` | Both installations succeeded |
| 6 | 2026-11-26 02:46–02:49 +03:00 | New build-38 process, one-line prompt, long fake-model response, `.tmp/k38-scroll-read.js` | Initial stands did not overflow: no sticky was shown at `scrollTop=0`; later geometry measured 263px content in 434px viewport, so no false pass was accepted |
| 7 | ≈ 2026-11-26 02:50 +03:00 | `.tmp/k38-activate-sticky.mjs` with reduced viewport and real scroll, then `.tmp/k38-sticky-read.js` | Active one-line sticky: no expansion/fade/ARIA collapse; horizontally truncated `scrollWidth=498`, `clientWidth=149`; WebP captured |
| 8 | 2026-11-26 02:51 +03:00 | Reopen saved multiline session, activate sticky, `.tmp/k38-sticky-read.js`, then `.tmp/k33-sticky-run.mjs` | Multiline control retained Expand, fade and ARIA; expansion 32→165px, wheel preserved expansion, manual collapse returned to 32px |
| 9 | 2026-11-26 02:57 +03:00 | Judge re-ran targeted Vitest, VSIX verify, report lint, one-line replay and the multiline expand/wheel/collapse path | 12/12; package audit green; 39 reports / 0 findings; both live paths reproduced |

## 4. Checks

Hygiene: the new horizontal-overflow boundary was red before implementation and green afterward. Existing sticky top, ownership, media, animation and steering checks remain green. Full extension is 647 passed / 1 skipped; typecheck, lint, build and VSIX audit pass.

Functional run: on the final isolated build 38, a real one-line prompt became sticky after viewport overflow and scrolling. It showed a plain one-line ellipsis without fade or chevron; its disabled button had no `aria-expanded` or `aria-controls`. A saved multiline prompt still had Expand, fade and collapsed ARIA, expanded to 165px, stayed expanded through wheel and manually collapsed to 32px. The single-line WebP was opened and read.

| Case | Status | Observation |
|---|---|---|
| One-line prompt | pass | No expansion, fade, Expand button or collapsed ARIA |
| One-line horizontal overflow | pass | Real geometry 498px scroll / 149px client; same clean presentation |
| Multiline prompt | pass | Expand + fade remain; 32→165→32px; wheel preserves expansion |
| Existing extension behavior | pass | 647 passed / 1 skipped; lint/typecheck/build/package green |
| Main accumulated running profile | blocked | Build 38 installed; main-window reload and observation remain pending |

## 5. Found

- `bugs/31_expanded_sticky_scroll_oscillation.md` — the old `truncated` measurement promoted a single line into expansion/fade. That state and observer were removed; multiline and media ownership remain unchanged.
- The first two live stands lacked viewport overflow and correctly showed no sticky at the top. They were not counted as passing the target case.
- Two viewport-adjustment commands printed their measured result and then hit a Node `UV_HANDLE_CLOSING` assertion on exit. The follow-up DOM read was executed separately; this is a harness-process caveat, not a product failure.

## 6. Traces

- `.tmp/k5-vscode/106-build38-one-line-sticky.webp` — one-line horizontal ellipsis with no fade/chevron, opened and read
- `.tmp/k38-sticky-read.js`, `.tmp/k38-activate-sticky.mjs`, `.tmp/k38-scroll-read.js`
- `bugs/31_expanded_sticky_scroll_oscillation.md`, `plans/03_sticky_viewport_prompt.md`
- `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix`

## 7. Verdict

partial — the final isolated build-38 single-line and multiline paths plus all hygiene pass; main-profile acceptance remains pending.
