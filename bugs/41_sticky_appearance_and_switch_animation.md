# Bug 41 — Abrupt sticky disappearance at the top and abrupt one/two-line sticky switches

**Status:** 🔧 fixed and verified on isolated build 42 — computed max-height collapses 61 → 0px over ~200ms before unmount, replacements animate between measured heights; accumulated main-profile acceptance pending
**Version/build:** owner's accumulated main profile, KIMI KRINIK 1.0.0 build 40 · **When/context:** 2026-11-26 ≈10:55 +03:00, tossed by the owner mid-task during the UI-polish review
**Severity:** S3 (cosmetic, owner-flagged)
**Fixing:** this session, after the build-40 commit
**Fix accepted when (observable):** scrolling to the very top no longer makes the chat canvas jump into the sticky's freed space, and sticky replacements between one-line and two-line previews animate smoothly instead of snapping.

## Symptom

Owner's words: «когда листаешь в самый вверх - стики сообщение исчезает, а все полотно чата ПРЫГАЕТ выше на освободившееся место. Когда скролишь чат и стики сообщения меняют друг друга - то в одну стройку, то в две строчки - это изменение РЕЗКОЕ. Можно добавить планые анимации какие-то на эти два моммента?»

Two moments: (1) at `scrollTop = 0` the sticky unmounts, its flow space collapses and the chat jumps up; (2) sticky replacement between a single-line prompt and a multiline collapsed preview changes the bar's height abruptly.

## Repro

1. Scroll a long chat to the very top — the sticky vanishes and the content jumps upward by the bar's height.
2. Scroll between turns whose prompts differ (one line vs multiline) — the sticky height snaps.

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
