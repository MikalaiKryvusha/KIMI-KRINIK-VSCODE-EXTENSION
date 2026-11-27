# Test run report — Phase 2 fresh-install sound defaults (build 54)

**Created:** 2026-11-27 09:44 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK 1.0.0 build 54, win32-x64 VSIX

## 1. Work

Close `sound-default-manifest#F1`. Basis: `GOAL.md` owner-approved defaults, `plans/06_epic04_phase2_act_findings.md` §4.4 and the owning audit card. Required fresh values are Glass/Voice/Alert/Chime; saved choices, partial-map normalization, migration and audio playback are controls, not redesign targets.

## 2. Contour

Windows 11, Node 24.15.0, VS Code 1.123.0. Manifest/shared deep equality runs in Vitest. The functional boundary is the packaged VSIX installed into a fresh isolated Extension Host; `workspace.getConfiguration("kimi").get("sounds")` is read and printed. Build 53 supplied the pre-fix packaged control, build 54 the fixed artifact. Build 54 was also installed on the main and accumulated isolated CDP profiles without reloading the main window.

REAL WORLD: accumulated — the owner's main profile, saved settings and running Extension Host; data and machine — his Windows machine; path — installed KIMI KRINIK extension. Build 54 and its real installed manifest were read on that path, and source/installed hashes match. Live main-host behavior was not verified because the main window was not reloaded; no production DONE or audible-output claim is made.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-27 09:39:35 +03:00 | `pnpm --filter kimi-code-kaif test:extension-host --version 1.123.0` | red on packaged build 53: fresh host read Voice/Voice/Voice/Off instead of Glass/Voice/Alert/Chime |
| 2 | 2026-11-27 09:39:42 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/sounds.test.ts` | red before fix: manifest differed from `DEFAULT_SOUND_SETTINGS` at approval, error and turnComplete |
| 3 | 2026-11-27 09:40:21 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/sounds.test.ts apps/vscode/test/attention-handler.test.ts` | 13/13 pass after the manifest edit |
| 4 | 2026-11-27 09:40:51 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/sounds.test.ts apps/vscode/test/attention-handler.test.ts apps/vscode/test/behavior-handler.test.ts apps/vscode/test/webview/sound-settings-modal.test.tsx apps/vscode/test/webview/chat-store.test.ts` | 69/69 pass, including saved choices, partial-map normalization and sound-write controls |
| 5 | 2026-11-27 09:40:50 +03:00 | `pnpm --filter kimi-code-kaif run typecheck` | exit 0 for extension host and webview |
| 6 | 2026-11-27 09:41 +03:00 | `pnpm --filter kimi-code-kaif package:platform --target win32-x64` | build 54 packaged; 44 files, 19,462,999 unpacked bytes; package/static checks pass |
| 7 | 2026-11-27 09:41:43 +03:00 | `pnpm --filter kimi-code-kaif test:extension-host --version 1.123.0` | fresh packaged host prints Glass/Voice/Alert/Chime; 10 commands, webview opened, exit 0 |
| 8 | 2026-11-27 09:44:59 +03:00 | Main `code --install-extension apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix --force`; isolated `node .tmp/k5-install.mjs`; installed manifest/hash readback | both profiles read build 54 and Glass/Voice/Alert/Chime; source/main/isolated extension and webview SHA-256 values match |
| 9 | 2026-11-27 09:44:00 +03:00 | `pnpm lint` | exit 0; all repository checks pass |

## 4. Checks

Hygiene: manifest/shared deep equality and full choice-description checks were red before the fix and green afterward. The affected set is 69/69; typecheck, build-54 static/package audit and root lint pass. Existing explicit choices, invalid-value normalization, partial maps and attention behavior remain covered and green.

Functional run: the real packaged Extension Host was entered on fresh isolated profiles twice. Build 53 was READ as Voice/Voice/Voice/Off and rejected; build 54 was READ as Glass/Voice/Alert/Chime with volume 80/80/80/60 and passed. The webview opened. No audible playback was measured.

| Case | Status | Observation |
|---|---|---|
| Manifest ↔ shared defaults | pass | deep equality with `DEFAULT_SOUND_SETTINGS` |
| Manifest choice description | pass | voice, chime, bell, pop, alert, triple, glass and off are all named |
| Fresh packaged host | pass | build 54 returns Glass/Voice/Alert/Chime |
| Saved choices and partial maps | pass | existing behavior/modal suites remain green |
| Main and isolated installed artifact | pass | build 54, expected defaults and matching source/installed hashes |
| Running accumulated main Extension Host | not verified | installation only; no reload by R7 |
| Audible output | not verified | outside this manifest-only observation |

## 5. Found

- Fixed the fresh-install mismatch at its manifest mirror; shared normalization and saved settings were not changed.
- The fresh host now exposes the owner-approved defaults through the actual VS Code configuration API.
- Open: accumulated running-main observation and any separate audio-quality/audibility questions.

TWINS: searched `kimi.sounds`, `DEFAULT_SOUND_SETTINGS` and approval/turnComplete sound literals across source and manifests — found 0 other contributed sound-default writers. The webview and normalizer already use the shared constant.

TWINS-MECH: a valid independently maintained fresh-install mirror overrode shared fallback defaults. Searched manifest object defaults, normalizer fallbacks and webview initial settings; only the VS Code manifest drifted.

BOTH-WAYS: deep equality is symmetric for source→mirror and mirror→source drift; the fresh host independently guards the consumer direction rather than merely comparing two files.

Deleted-text sweep: remaining Voice/Voice/Voice/Off mentions are historical pre-fix records in the audit/research/plan or the pre-existing untracked `.vscode-test` old installation; none is a current source default.

## 6. Traces

- `apps/vscode/package.json` — build 54 and corrected `kimi.sounds` contribution.
- `apps/vscode/test/sounds.test.ts` — manifest/shared and choice-description oracle.
- `apps/vscode/test/extension-host/index.cjs` — independent fresh-host expected values and printed actual settings.
- `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix` — packaged build 54.
- `plans/06_epic04_phase2_act_findings.md` §4.4 and the owning audit card.

## 7. Verdict

pass — the scoped fresh-install manifest finding is closed on packaged build 54 with red-before and green-after observations. Accumulated running-main behavior and audible output are not claimed by this verdict.
