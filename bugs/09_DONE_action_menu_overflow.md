# Bug 09 — Action menu can exceed the viewport and duplicates behavior settings

**Status:** 🔴 OPEN
**Version/build:** KIMI KRINIK 1.0.0 after C24 · **When/context:** 2026-11-24, owner UI review during K5 polishing
**Severity:** S2
**Fixing:** this session
**Fix accepted when (observable):** the Action menu contains no `BEHAVIOR` / Compact / Steer switches; all menu items remain reachable in a short viewport through vertical scrolling; Control Panel and General settings keep their existing behavior and values.

## Symptom

A long Action menu can extend beyond the available height without a vertical scroll path. It also duplicates Compact and Steer switches even though their ownership belongs to Control Panel and General settings.

## Repro (deterministic)

1. Open KIMI KRINIK and click the settings gear.
2. Reduce the available vertical space or use a long menu.
3. Inspect the menu height, overflow behavior and duplicated `BEHAVIOR` section.

## Forensics

- Owner screenshot shows the menu extending beyond the visible area.
- `ActionMenu.tsx` has a fixed-width Popover but no vertical overflow class; `BEHAVIOR` contains Compact and Steer `SwitchItem` rows duplicating existing controls.

## Root cause

The menu lacks a viewport-relative maximum height and vertical overflow behavior, while its composition retained an obsolete duplicate settings section.

## Fix plan

Remove the duplicate section and its now-unused code, constrain the popover to the available height with vertical scrolling, then verify the class contract and live wheel reachability.

## Decisions made without the owner

Used the popover's available-height CSS variable with vertical overflow and preserved keyboard focus through a brand-colored ring instead of removing it. Kept the explicit `blue` Switch variant for active-blue controls while making default checked switches and checkboxes pink. Added the project link as a no-params host RPC so the webview cannot supply an arbitrary URL.

## ✅ STATUS: DONE (2026-11-24 11:44 +03:00)

Hygiene: menu composition, language order, About RPC/localization, Switch and Checkbox checks were red before and green after. Full extension suite: 546 passed, 1 skipped; typecheck and root lint passed.
Functional run: short viewport menu measured 225/526 px and wheel moved scrollTop 0→200→160; WebP 23 shows Support/Account and the scrollbar. Language order is English→Русский→中文, `BEHAVIOR` is absent, checked controls compute `rgb(255, 26, 140)`, range outlineStyle is `none`, and `openProjectPage ok=true` was read in the Extension Host log.
