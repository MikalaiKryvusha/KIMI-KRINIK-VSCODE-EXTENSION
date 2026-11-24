# Bug 07 — Header robot uses a non-existent dist resource

**Status:** ✅ DONE
**Version/build:** 1.0.0 · VSIX win32-x64 · **When/context:** 2026-11-24, K5 Second Side Bar acceptance
**Severity:** S2
**Fixing:** this session
**Fix accepted when (observable):** the real installed VSIX in Second Side Bar loads the header robot with `naturalWidth > 0`, a read-back WebP shows no broken-image icon, and the unmocked header test resolves the existing `resources/krinik-robot-logo.png` URL.

## Symptom

The KIMI KRINIK header showed a broken-image icon instead of the pink robot in the real Extension Host.

## Repro (deterministic)

1. Package and install the win32-x64 VSIX into an isolated VS Code profile.
2. Open KIMI KRINIK and move its view to New Secondary Side Bar Entry.
3. Inspect the header image and capture the screen.

## Forensics

- Live DOM before the fix: image `src` ended in `/dist/krinik-robot-logo.png`; `complete && naturalWidth > 0` was false.
- The installed extension had no such dist file. The VSIX contained `extension/resources/krinik-robot-logo.png` (29,379 bytes), and the source PNG was valid when read as an image.
- `useExtensionImageUrl` unconditionally constructed `${baseUri}/dist/${imageName}`.
- `header.test.tsx` mocked that hook as `/resources/${name}`, hiding the production path mismatch.
- Broken WebP: `.tmp/k5-vscode/05-secondary-sidebar-ready.webp`; fixed WebP: `.tmp/k5-vscode/06-header-robot-fixed.webp`.

## Root cause

Confirmed resource-root mismatch: existing banner assets are copied from `webview-ui/public` into dist, while the new robot is packaged only under resources for use by the README and extension UI.

## Fix

The existing hook now accepts a path relative to the extension root. The mascot passes `dist/<banner>` and the header passes `resources/krinik-robot-logo.png`. The header test uses the real hook with a known base URI.

Red-to-green: the unmocked test received `https://extension.test/dist/krinik-robot-logo.png` before the fix and expected the resources URL; it passed afterward. A rebuilt and reinstalled VSIX loaded both the robot and the banner in a new real VS Code process.

TWINS: searched all `useExtensionImageUrl` callers — only the header robot and dark/light mascot banners exist; both use the corrected convention and both loaded in the live header.
TWINS-MECH: a resource URL rooted at the wrong package directory can affect every image resolved through the shared hook. Searched every hook caller and inspected both live image URLs and load states.

## Decisions made without the owner

Kept the README robot as the single asset source under resources instead of copying it into the webview public directory. Generalized the existing hook's path argument rather than adding a second image-url helper.

## Links

- `D:/work/ai_sandbox/KAIF/plans/153_epic147_K5_live_release.md`
- `apps/vscode/webview-ui/src/components/hooks/useExtensionImageUrl.ts`
- `apps/vscode/webview-ui/src/components/KimiLogo.tsx`
- `apps/vscode/webview-ui/src/components/KimiMascot.tsx`

## ✅ STATUS: DONE (2026-11-24 05:19 +03:00)

Hygiene: unmocked header regression red before and green after; affected webview test 1/1.
Functional run: rebuilt VSIX installed into the isolated profile; a new VS Code 1.123.0 process in Second Side Bar reported robot `loaded: true` and banner `loaded: true`. The fixed WebP was read and shows the pink robot without a broken-image icon.
Run report: `testcases/reports/2026-11-24_k5_live_acceptance.md`.
