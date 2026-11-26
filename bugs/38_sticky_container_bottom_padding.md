# Bug 38 — No bottom padding between the sticky container edge and the message bubble

**Status:** 🔧 fixed; full suite 651/1 green; real visual acceptance pending
**Version/build:** owner's accumulated main profile, KIMI KRINIK 1.0.0 build 39 · **When/context:** 2026-11-26 10:08 +03:00, tossed by the owner mid-task during the UI-polish review
**Severity:** S3 (cosmetic, owner-flagged)
**Fixing:** this session, together with bug 37
**Fix accepted when (observable):** the sticky message container shows a visible gap between the bottom edge of the container and the bottom edge of the message bubble, matching the container's side padding.

## Symptom

In the sticky message container the message bubble touches the container's bottom edge — the bottom padding is missing. Owner's words: «в контейнере стики сообщений не хватает отсутпа между нижней границей оконтейнера и нижней границей пузыря сообщения» (with a screenshot crop showing the bubble flush against the container bottom).

## Repro

1. Get any message into the sticky bar.
2. Look at the gap under the message bubble inside the sticky container — there is none.

## Root cause

The sticky container had `px-2 pt-2` and no bottom padding, so the bubble sat flush against the container's `border-b`.

## Fix plan

1. Added `pb-2` to the container, matching the other sides; the existing component test now pins `pb-2` alongside `px-2`/`pt-2`.
2. Verify on a real screenshot of the sticky bar (HOUSE_RULES R2).

## Decisions made without the owner

None — the owner's requested change applied as stated.

## Links

- `bugs/37_sticky_shows_visible_message.md` · `bugs/31_expanded_sticky_scroll_oscillation.md`
