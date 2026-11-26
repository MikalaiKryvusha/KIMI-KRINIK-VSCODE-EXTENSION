# Bug 41 — Abrupt sticky disappearance at the top and abrupt one/two-line sticky switches

**Status:** 🔧 fixed and verified on isolated build 44 — expand and collapse share 200ms ease-in-out and equal progress per frame; accumulated main-profile acceptance pending
**Version/build:** owner's accumulated main profile, KIMI KRINIK 1.0.0 builds 40 and 43 · **When/context:** reopened 2026-11-26 13:10 +03:00 during the owner's pre-release positive smoke
**Severity:** S3 (cosmetic, owner-flagged)
**Fixing:** this session, before the 1.0.0 release
**Fix accepted when (observable):** scrolling to the very top no longer makes the chat canvas jump into the sticky's freed space; sticky replacements between one-line and two-line previews animate smoothly; expanding the sticky viewer animates the message bubble and outer container with the same duration and timing function, matching the already synchronous collapse.

## Symptom

Owner's words: «когда листаешь в самый вверх - стики сообщение исчезает, а все полотно чата ПРЫГАЕТ выше на освободившееся место. Когда скролишь чат и стики сообщения меняют друг друга - то в одну стройку, то в две строчки - это изменение РЕЗКОЕ. Можно добавить планые анимации какие-то на эти два моммента?»

Two moments: (1) at `scrollTop = 0` the sticky unmounts, its flow space collapses and the chat jumps up; (2) sticky replacement between a single-line prompt and a multiline collapsed preview changes the bar's height abruptly.

## Repro

1. Scroll a long chat to the very top — the sticky vanishes and the content jumps upward by the bar's height.
2. Scroll between turns whose prompts differ (one line vs multiline) — the sticky height snaps.

## Reopened on main build 43 — expansion desynchronization

[OWNER] «при разворачиваниистики сообщения с разной скоростью разворачиваются пузырь сообщения и весь контейнер, в котором находится пузырь. Сворачиваются синхронно, но при разворачивании выглядит некрасиво. Должны с одинаковой скоростью разворачиваться» · 2026-11-26 13:10 +03:00 (chat)

The owner's positive smoke therefore fails on the accumulated main profile. The bubble and outer container must use one expansion duration and timing function; the release remains blocked until a packaged build demonstrates synchronized expand and collapse.

Build 43 was confirmed running on the isolated packaged product through the action menu `v1.0.0 (43)`. A real expand probe read outer `transitionDuration: 0.2s` versus inner `0.3s`; both used `cubic-bezier(0.4, 0, 0.2, 1)`. The inner preview reached its final 41px at ≈303ms while the outer max-height was still 69.98px at ≈407ms. The outer target was repeatedly recomputed from the bubble while that bubble's own expansion was still animating, so the outer animation chased intermediate heights instead of sharing the inner animation's final target.

## Root cause

`StickyUserPrompt` returned `null` the moment no prompt was active, collapsing its flow space instantly; single-line prompts rendered without the expansion container while multiline prompts rendered a 32px preview, so replacements swapped DOM structure with no height transition.

## Fix

- The sticky outer container now animates `max-height` and `opacity` (200ms, `motion-reduce:transition-none`). Its target height is measured on the inner bubble (independent of the animated element, so there is no self-measurement feedback) plus the 17px outer padding/border constant.
- On disappearance the last prompt stays mounted with `max-height: 0`/`opacity: 0` and unmounts after 200ms (immediately under reduced motion), so the chat canvas slides up smoothly instead of jumping.
- Prompt replacements and single-line ↔ multiline switches animate between measured heights; appearances grow from zero.
- The selection rule (bugs/37), padding (bugs/38), fade (bugs/39) and the expand/collapse animation are untouched. `window.matchMedia` is guarded the same way the file already guards `ResizeObserver`.
- New component test pins the transition classes, the measured height, the animated exit and the unmount-after-timer behavior.

## Decisions made without the owner

[AI] 200ms duration matching the existing chevron/color transitions; enter animations included for symmetry with the owner's exit request; the inner bubble (not the animated container) is measured to avoid transition feedback.

## Links

- `bugs/37_sticky_shows_visible_message.md` · `bugs/39_sticky_collapsed_second_line_fade.md` · `plans/03_sticky_viewport_prompt.md`
