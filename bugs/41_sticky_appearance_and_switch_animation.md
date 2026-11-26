# Bug 41 — Abrupt sticky disappearance at the top and abrupt one/two-line sticky switches

**Status:** 🔴 OPEN
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

## Root cause / Hypotheses

`StickyUserPrompt` returns `null` when no prompt is active, so its flow space collapses instantly; single-line prompts render without the expansion container while multiline prompts render a 32px preview, so replacements swap DOM structure with no height transition.

## Fix plan

1. Animate the bar's exit (height/opacity to zero before unmount) and unify the collapsed single-line/multiline rendering so replacements transition height smoothly; respect reduced motion.
2. Keep the existing expand/collapse max-height animation and the new selection rule intact.
3. Component tests for the animated exit/switch; verify by real scrolling on the isolated build (R2).

## Decisions made without the owner

To fill at closing.

## Links

- `bugs/37_sticky_shows_visible_message.md` · `bugs/39_sticky_collapsed_second_line_fade.md` · `plans/03_sticky_viewport_prompt.md`
