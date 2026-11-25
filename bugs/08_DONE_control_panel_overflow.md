# Bug 08 — Composer controls overlap and the model picker is on the wrong side

**Status:** 🔴 OPEN
**Version/build:** KIMI KRINIK 1.0.0 after C24 · **When/context:** 2026-11-24, owner screenshot and isolated K5 reproduction
**Severity:** S2
**Fixing:** this session
**Fix accepted when (observable):** at 299, 320 and 640 CSS px, the reference layout keeps attachment/permission/K2/mode controls on the left and rings/model+effort/settings/stop-send on the right; right controls do not overlap and remain clickable, the left group wheel-scrolls forward and backward, and a non-interactive fade covers its clipped right edge. Wide-layout actions and EN/RU/ZH labels keep working.

## Symptom

With many visible controls, Plan/Goal/Swarm/secondary-model overlap the attachment, settings and send controls. The owner also identified that the model picker must be on the right as in KIMI FORK, not on the left.

## Repro (deterministic)

1. Install the VSIX in the isolated VS Code profile and open KIMI KRINIK in Second Side Bar with all Control Panel buttons enabled.
2. Narrow the view and compare the composer groups with the reference row.
3. Measure the left group's client/scroll widths and the secondary-model/right-group rectangles.

## Forensics

- Owner screenshot: Goal/Swarm/settings/send render on top of one another.
- Isolated run at 635 CSS px: left `clientWidth=513`, `scrollWidth=627`; secondary-model right edge `641.776` exceeds right-group left edge `532`; `secondaryOverlapsRight=true`.
- `apps/vscode/webview-ui/src/components/inputarea/InputArea.tsx:382-425`: the left flex group has no overflow container or intrinsic-width inner row; the right group has no background or z-layer. ModelPicker and attachment are on the opposite sides from the reference.
- Reference `InputArea.tsx:455-504`: attachment/permission/mode/robot on the left; rings/model/settings/stop-send on the right. Inventory: `researches/53_control_panel_parity.md`.

## Root cause

Unclipped intrinsic-width content overflows its flex box and paints over the unpositioned right controls. The initial target layout also diverged from the accepted reference parity.

## Fix plan

1. Restore reference element order while preserving current target handlers and K2 Compact/Steer/Control additions.
2. Give the left group an intrinsic-width row and native non-passive horizontal wheel scrolling in both directions.
3. Put the right controls above it on an opaque background with a left transparent-to-background fade outside the hit-testing path.
4. Add red-to-green component checks and live 299/320/640 px geometry, wheel, click, screenshot and localization acceptance.

## Decisions made without the owner

Kept K2 Compact/Steer/Control additions in the left group while restoring the reference model-right layout. Did not port `ComposerOverflowMenu`: the owner explicitly chose wheel-scroll + fade. Made fade padding conditional on actual overflow, used native non-passive wheel events, preserved the robot's natural aspect ratio at 24×16 and removed its rounded class. Used the owner's pink `#FF1A8C` for step dots and scroll-to-bottom and the existing active-blue for Auto.

## ✅ STATUS: DONE (2026-11-24 11:44 +03:00)

Hygiene: reference-side, fade, bidirectional wheel and no-fit-wheel checks were red before and green after; paperclip, robot, dot, scroll-button and Auto checks are green. Full extension suite: 546 passed, 1 skipped; typecheck and root lint passed.
Functional run: rebuilt VSIX on VS Code 1.123.0. At 319 CSS px the left area scrolls (118/310, wheel 0→192→152); model/settings/send stay on the right under a 32 px `pointer-events:none` fade. At 1000 px wheel leaves scrollLeft 0 in both directions. Real attachment is a paperclip, robot is 24×16 without rounded, and computed brand styles were read. WebP 21–24.
TWINS: searched `ModelPicker` and `attachment-picker-toggle` placement in the composer and `bg-blue-400` path/scroll indicators — the offending composer, step-dot and scroll-button sites were the only matches; the Auto-only cyan path was also replaced.
