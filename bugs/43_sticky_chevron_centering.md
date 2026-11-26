# Bug 43 — Sticky expand/collapse chevron sits off-center in its button container

**Status:** 🔧 fixed and verified on isolated build 42 — chevron center delta 0/0 on both axes; accumulated main-profile acceptance pending
**Version/build:** owner's accumulated main profile, KIMI KRINIK 1.0.0 build 40 · **When/context:** 2026-11-26 ≈11:06 +03:00, tossed by the owner mid-task during the UI-polish review
**Severity:** S3 (cosmetic, owner-flagged)
**Fixing:** this session, together with bugs 41–42
**Fix accepted when (observable):** the chevron is optically centered horizontally and vertically inside the sticky expand/collapse button at every state.

## Symptom

Owner's words: «у стики у кнопки разворачивания и сворачивания очень кривой контейнер, шеврон не по центру» (screenshot: the chevron pushed toward the bottom-right of its rounded container).

## Root cause

The chevron icon carries `ml-auto`, which in the square `size-5` flex button pushes the icon to the right edge despite `items-center justify-center`. The class was meaningful in the old full-width control row and is wrong in the overlay square button.

## Fix plan

1. Removed `ml-auto` from the chevron (it renders only in the square-button form, so the class was always wrong); the component test now pins the chevron without `ml-auto`.
2. Verified on isolated build 42: the icon's center equals the button's center on both axes (delta 0/0), WebP 119/121.

## Decisions made without the owner

None — the minimal class removal matching the owner's report.

## Links

- `bugs/41_sticky_appearance_and_switch_animation.md` · `testcases/reports/2026-11-26_build_42_sticky_animation_subagent_chevron.md`
