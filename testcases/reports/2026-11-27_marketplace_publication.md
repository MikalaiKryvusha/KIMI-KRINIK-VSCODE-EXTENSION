# Test run report — Visual Studio Marketplace 1.0.0 publication

**Created:** 2026-11-27 17:55 +03:00 · **Run by:** project agent ·
**Version/build:** KIMI KRINIK 1.0.0, build 62

## 1. Work

Verified the universal-publish and GitHub Trusted Publishing path against `researches/58_vscode_marketplace_publication.md`, the owner's Marketplace authorization and `interviews/interview_003_marketplace_publisher_access.md`. The run covered release-artifact integrity, the Marketplace icon rejection and remediation, OIDC upload, the public item page and installation by extension ID. It also covered the owner-reported voice-route defect fixed while Marketplace propagation was pending.

## 2. Contour

Local Windows 11 and Node 24.15.0; GitHub Actions Ubuntu with the repository's pinned Node and pnpm; VS Code 1.123.0 fresh Extension Host; public Visual Studio Marketplace; a clean temporary VS Code profile.

REAL WORLD: accumulated — the owner's main VS Code profile retained its sessions and was not reloaded; data and machine — the owner's Windows machine and GitHub/Microsoft publisher accounts; path — GitHub Release `v1.0.0`, GitHub Actions OIDC and the public Marketplace extension ID. Build 62 installation on the main profile was observed. Running accumulated-profile product scenarios were outside this publication run and remain separate acceptance work.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-27 16:38 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/vsix-package.test.ts` | Red before implementation: unknown `--oidc`; 16 other tests passed |
| 2 | 2026-11-27 16:42 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/vsix-package.test.ts` | 17/17 passed |
| 3 | 2026-11-27 17:34 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/vsix-package.test.ts` | Red on the exact rejected build-61 icon hash |
| 4 | 2026-11-27 17:38 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/vsix-package.test.ts` | 18/18 passed on build 62 |
| 5 | 2026-11-27 17:38 +03:00 | `pnpm --filter kimi-code-kaif run test:extension-host -- --version 1.123.0 --vsix artifacts/vsix/kimi-code-universal.vsix` | Extension Host 0; commands registered and webview opened |
| 6 | 2026-11-27 17:40–17:41 +03:00 | `gh workflow run vscode-marketplace-publish.yml -f release_tag=v1.0.0` | Run 46017994560 passed download, SHA-256, audit and OIDC publish |
| 7 | 2026-11-27 17:48 +03:00 | `node .kaif/tools/contour/voice-soft.mjs --selftest` and `node .kaif/tools/contour/review.mjs --selftest` | 16/16 and 193/193 passed |
| 8 | 2026-11-27 17:54 +03:00 | `curl -sSL "https://marketplace.visualstudio.com/items?itemName=mikalai-kryvusha.kimi-code-kaif"` | HTTP 200; public EN/RU/ZH content and Known issues read |
| 9 | 2026-11-27 17:55 +03:00 | `code --user-data-dir .tmp/marketplace-install-check/user-data --extensions-dir .tmp/marketplace-install-check/extensions --install-extension mikalai-kryvusha.kimi-code-kaif --force` | Version 1.0.0 installed; manifest build 62 and approved icon hash read |

Repository hygiene during the run: `pnpm lint` passed, `pnpm --filter kimi-code-kaif run typecheck` passed, all seven build-62 VSIX files passed static and entry-import audits, and all seven local/GitHub SHA-256 pairs matched.

## 4. Checks

Hygiene: 18/18 VSIX tests · lint 0 errors · typecheck 0 errors · seven package audits · voice-soft 16/16 · contour 193/193.

Functional run: the real build-62 universal VSIX opened its webview in a fresh VS Code 1.123.0 Extension Host. GitHub Actions published that exact asset through OIDC. The public Marketplace page was read after HTTP 200, and a clean VS Code profile installed the extension by its public ID. The installed manifest and icon were read.

| Case | Status | Observation |
|---|---|---|
| Universal argument and OIDC boundary | pass | Red-before parser failure became green; Open VSX still rejects the Marketplace-only options |
| Rejected icon guard | pass | Exact build-61 hash failed the new check; build-62 pink robot passed |
| Artifact identity | pass | Marketplace VSIX SHA-256 `5cf8731783d417d60b4ed611cc29f4d85582d4fd7e3180ba5e25b0711a51ccd8` equals local and GitHub |
| Public Marketplace page | pass | HTTP 200; KIMI KRINIK, EN/RU/ZH features and Known issues read |
| Public installation | pass | Clean profile installed version 1.0.0; build 62 and icon hash verified |
| Voice route | pass for no-sound contract | Dry-run selects `contour.voiceFileTool` and explicitly excludes contour beeps; audible output was not replayed in this run |
| Accumulated-profile product behavior | skipped | Main-profile installation observed; no window reload or accumulated chat acceptance performed |

## 5. Found

- Build 61's black K icon was rejected by Marketplace. Fixed in build 62 with a red-first regression guard and the owner's explicit pink-robot approval.
- `bugs/KAIF/07_review_file_voice_bypass.md` / KAIF origin issue #208 — review and voice-soft bypassed the configured file voice. Fixed locally with selftests and no-sound dry-run evidence; origin absorption remains open.
- Initial public URL and installation returned 404 while the accepted upload propagated. At 17:54 +03:00 the page became available and installation subsequently passed; no duplicate upload was made.
- The published 1.0.0 short description and packaged README retain future-version wording/priority polish. No complete public-text polish is claimed for those packaged surfaces.

## 6. Traces

- https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/actions/runs/46016559851 — rejected build-61 icon run
- https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/actions/runs/46017994560 — successful build-62 OIDC run
- https://marketplace.visualstudio.com/items?itemName=mikalai-kryvusha.kimi-code-kaif — public item
- https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases/tag/v1.0.0 — seven build-62 assets and major-capability notes
- `bugs/KAIF/07_review_file_voice_bypass.md` and https://github.com/MikalaiKryvusha/KAIF/issues/208

## 7. Verdict

pass — Marketplace 1.0.0 is publicly readable and installable with the verified build-62 universal package. Accumulated-profile behavior and future-version packaged-text polish remain explicitly outside this publication verdict.
