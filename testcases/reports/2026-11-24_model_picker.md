# Test run report — combined model and reasoning-effort picker

**Created:** 2026-11-24 01:48 +03:00 · **Run by:** project agent ·
**Version/build:** KIMI KRINIK 1.0.0 · `kaif/no-auto-compaction` working tree

## 1. Work

Port the reference `ModelPicker`/`ModelPickerDialog` into the target `InputArea` without replacing its newer file search, media, retry, quota or steer behavior. Basis: `D:/work/ai_sandbox/KAIF/plans/149_epic147_K1_ui_convergence.md` K1.6 and `researches/52` §3.1. The old separate model dropdown and `ThinkingButton` become one combined control; attachment, permission, behavior/mode buttons, secondary-model robot, quota rings, settings and stop/send keep their positions.

Reference inventory carried into the implementation: readable model+effort label, current-provider quick list, thinking on/off and effort tiers, prompt-cache note, full search, provider filters, starred models, keyboard navigation, media-safe model list and SDK context-size descriptions. Favorites use one shared Zustand store so a star updates both views immediately and persists in webview local storage.

## 2. Contour

Windows, Vitest jsdom, real React components and Zustand stores, mocked config bridge, localStorage favorites, real `InputArea` composition tests, and the real bridge model mapper for `max_context_tokens`. Reference source read at pinned `4298cb7f0cbe25afc147bd7b2aaca8ae39b71390` under `D:/work/ai_sandbox/KAIF/scratchpad/kimi-reference`.

REAL WORLD: accumulated — the owner's working tree and reference snapshot; data and machine — the owner's Windows machine; path — webview component interaction through Testing Library. Component behavior and composition verified; the owner's accumulated VS Code profile, actual narrow Second Side Bar layout and live Extension Host were not exercised.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-24 01:43 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/model-picker.test.tsx apps/vscode/test/webview/input-area-file-picker.test.tsx` | 0 · 8 tests passed: five new picker scenarios and three existing InputArea cases |
| 2 | 2026-11-24 01:44 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/bridge-handler.test.ts` | 0 · 34 passed, including `max_context_tokens: 200_000` from SDK `maxContextSize` |
| 3 | 2026-11-24 01:45 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test` | 0 · 42 files, 519 passed, 1 skipped, 0 failed |
| 4 | 2026-11-24 01:45 +03:00 | `pnpm --filter kimi-code-kaif run typecheck` | 0 · extension and webview checks passed |
| 5 | 2026-11-24 01:45 +03:00 | `pnpm lint` | 0 · comments, oxlint, import boundaries, guards, ratchet and instructions passed |
| 6 | 2026-11-24 01:46 +03:00 | `pnpm --filter kimi-code-kaif run build` | 0 · extension and webview production builds passed |

## 4. Checks

Hygiene: new component suite green; existing InputArea and bridge suites green; full extension suite 519 passed / 1 skipped; typecheck, root lint and both builds green. A deleted-symbol sweep found no remaining `ThinkingButton`, `SWITCH_CACHE_NOTE` or reference storage-key use in the product.
Functional run: NONE — jsdom interaction is hygiene evidence, not a live Extension Host walk or a visual narrow-sidebar acceptance.

| Reference row / case | Status | Observation |
|---|---|---|
| Readable model + effort button | pass | `Reasoning · High` remained in a non-truncated `shrink-0 whitespace-nowrap` label |
| Effort tiers in the same dropdown | pass | Low produced `saveConfig({ model: "reasoning", thinking: true, effort: "low" })`; cache note was visible |
| Switch and always-thinking modes | pass | Switch offered On/Off and saved On; always-thinking offered Low/High without Off |
| Current-provider quick list and favorites | pass | Starring Other updated shared state and localStorage; Other appeared in the quick list after reopening |
| Full search and keyboard selection | pass | Search found Other; Enter selected it and saved `thinking: false, effort: "off", effortChanged: true` |
| Provider filter and fresh reopen state | pass | `other` hid Reasoning; reopening cleared the query and restored all models |
| SDK context-size mapping | pass | `maxContextSize: 200_000` became `max_context_tokens: 200_000` for dialog descriptions |
| InputArea composition | pass | Existing attachment-toggle, visibility and Stop-shape tests remained green |
| Narrow Second Side Bar and live controls | skipped | Actual layout, pointer interaction and Extension Host acceptance remain K5 |

TWINS: searched the old separate-control symbols and storage key — no remaining product use of `ThinkingButton`, `SWITCH_CACHE_NOTE` or `kimi-fork-favorite-models`; the barrel export now exposes `ModelPicker`.

## 5. Found

- none

## 6. Traces

- `apps/vscode/webview-ui/src/components/ModelPicker.tsx`
- `apps/vscode/webview-ui/src/components/ModelPickerDialog.tsx`
- `apps/vscode/webview-ui/src/components/inputarea/hooks/useFavoriteModels.ts`
- `apps/vscode/webview-ui/src/components/inputarea/InputArea.tsx`
- `apps/vscode/test/webview/model-picker.test.tsx`
- `apps/vscode/test/bridge-handler.test.ts`
- `D:/work/ai_sandbox/KAIF/scratchpad/kimi-reference/apps/vscode/webview-ui/src/components/ModelPicker.tsx`

## 7. Verdict

partial — the full reference picker inventory and existing composition guards passed with complete hygiene; live Second Side Bar layout and Extension Host acceptance remain unobserved.
