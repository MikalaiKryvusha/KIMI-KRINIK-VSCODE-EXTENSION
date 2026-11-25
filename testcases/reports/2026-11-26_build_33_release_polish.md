# Test run report — build 33 release polish

## 1. Work

Verify the owner's release-polish scope from `ideas/02`, `ideas/03`, `plans/03`, `bugs/25` and `bugs/31`: skill inventory and animated descriptions, Control Panel order, custom General Settings, welcome/model/header/MCP presentation, sticky behavior and steering-response identity.

## 2. Contour

Windows 11, Node 24.15.0, pnpm 10.33.0, Vitest/jsdom, VS Code 1.123.0 isolated win32-x64 VSIX, CDP geometry and WebP readback. Builds 32–33 were packaged; both main and isolated profiles have build 33 installed.

REAL WORLD: accumulated — the owner's real project skills and current VS Code profile; data and machine — his Windows machine, isolated VS Code with the real packaged UI, and main-profile installation; path — Second Side Bar, skill dialog and live prompt. Build 32 visual paths were observed. Build 33 was installed but its sticky path and the accumulated running Extension Host were not observed.

## 3. Runs

| Moment | Command / action | Result |
|---|---|---|
| 2026-11-25 23:50 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test`, `pnpm lint`, `pnpm --filter kimi-code-kaif typecheck` | 643 passed / 1 skipped; lint and typecheck exit 0 |
| 2026-11-26 00:02 +03:00 | targeted skill/chat/i18n suites and typecheck | 48/48; typecheck exit 0 |
| 2026-11-26 00:13 +03:00 | `chat-area` and `control-panel-settings` suites | 38/38 |
| 2026-11-26 00:14 +03:00 | `pnpm --filter kimi-code-kaif package:platform --target win32-x64` | build 33, 44 files, static/package checks passed |
| 2026-11-26 00:15 +03:00 | `code --install-extension apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix --force` and `.tmp/k5-install.mjs` | build 33 installed on main and isolated profiles |
| 2026-11-26 00:15 +03:00 | full extension suite and `pnpm --filter kimi-code-kaif run build` | 49 files, 643 passed / 1 skipped; build exit 0 |
| 2026-11-26 00:06 +03:00 | build 32 CDP welcome/skill geometry and WebP | 32px margins, 42 rows, rejected skills absent, no compact toggle, `60 → 100 → 60px` description animation; robot 72×48.02, KIMI 144×48, 16px gap, no overflow |

## 4. Checks

Hygiene: final full extension suite is 643 passed / 1 skipped with 0 failures. Root lint, extension/webview typecheck, normal build, VSIX package/static audit and installation are green.

Functional run: packaged build 32 was driven through welcome and skill-dialog user paths and READ through DOM geometry and WebP. The skill fade carries the card hover classes, description expansion animates in both directions, and rejected engine/project skills are absent. A final basic model prompt left `K29 late original` visible. Build 33 sticky functional run: NONE. Held-first-chunk steering race: NOT EXERCISED; the fake-model script was already consumed and only the unscripted response was observed.

| Case | Status | Observation |
|---|---|---|
| Full hygiene | pass | 643 passed / 1 skipped; lint/typecheck/build/package green |
| Welcome geometry | pass | 48px robot/KIMI height, 16px gap, no overflow |
| Skill inventory and dialog | pass | 42 rows; rejected names absent; 32px margins; no compact toggle |
| Skill description animation | pass | `60 → 100 → 60px`; hover-matched fade |
| Sticky revised behavior | component pass / packaged not run | wheel/touch preservation, ownership collapse, max-height/fade checks green |
| Steering race | deterministic pass / held VSIX not run | adapter/store race red before and green after; real held-response path remains |
| Main accumulated profile | not run | build 33 installed; running Extension Host restart and observation remain |

## 5. Found

- `bugs/25`: adapter dropped turnId, allowing late original deltas and completion to target the steering assistant; prompt-only reconciliation could also append a duplicate assistant. Both deterministic boundaries now have regressions.
- `bugs/31`: owner superseded wheel/touch auto-collapse; sticky now preserves expansion until manual collapse or ownership change and has two-way max-height animation plus bubble-colored fade.
- Real build 27 exposed inline `height:auto` overriding the first welcome fix; the final 72px width produces the observed 48px height.
- MCP had three hardcoded Add labels and one Cancel; all now use the shared dictionaries.
- Open verification debt: build 33 sticky, accumulated running profile, and the true held-response steering race.
- Instrumentation debt: `node .kaif/hooks/test-after-code.mjs --status` printed `test debt: 43` after the final full suite; no `test debt: none` claim is made.

## 6. Traces

- VSIX: `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix`
- SHA-256: `1924bb5496f708f3e26d1e7812d6af1db634fcf648be625218e4756c4842ed7c`
- `.tmp/k5-vscode/93-build32-skill.webp`
- `.tmp/k32-skill.mjs`, `.tmp/k29-race-observe.mjs`
- `bugs/25_first_prompt_assistant_message_flicker.md`, `bugs/31_expanded_sticky_scroll_oscillation.md`, `plans/03_sticky_viewport_prompt.md`

## 7. Verdict

partial — implementation and all hygiene are green; build 32 visual smoke passed and build 33 is installed, but build 33 sticky, the accumulated running profile, and the held-response VSIX race still require observation.
