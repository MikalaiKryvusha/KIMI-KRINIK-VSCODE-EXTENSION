# Bug 39 — Collapsed sticky: the second line is almost invisible

**Status:** 🔧 fixed; full suite 651/1 green; real visual acceptance pending
**Version/build:** owner's accumulated main profile, KIMI KRINIK 1.0.0 build 39 · **When/context:** 2026-11-26 10:10 +03:00, tossed by the owner mid-task during the UI-polish review
**Severity:** S3 (cosmetic, owner-flagged)
**Fixing:** this session, together with bugs 37–38
**Fix accepted when (observable):** in the collapsed sticky the second text line is noticeably more readable than now (owner's eye on a real screenshot is the verdict), while the fade still signals truncation.

## Symptom

In the collapsed sticky message the second line is faded so strongly it is almost invisible. Owner's words: «сейчас вторую строчку почти не видно в свернутом стики сообщении. нужно чуть-чуть сильнее её показывать» (with a screenshot crop).

## Repro

1. Get a multi-line message into the collapsed sticky.
2. Read the second line — it is nearly illegible.

## Root cause

The collapsed preview is 32 px tall: one clear line plus ~64 % of the second, and the bottom 20 px fade gradient peaked at 85 % bubble-color opacity, veiling almost the entire visible second line.

## Fix plan

1. Fade midpoint softened from `via-zinc-100/85` to `via-zinc-100/60` (and `dark:via-zinc-800/85` → `dark:via-zinc-800/60`); the bottom still fades to solid bubble color, keeping the truncation cue. Preview height unchanged — one knob, per the owner's «чуть-чуть сильнее».
2. The component test pins the new via-opacity classes; verify on a real screenshot (HOUSE_RULES R2), the owner's eye accepts.

## Decisions made without the owner

[AI] 60 % midpoint chosen as the «slightly stronger» reading; if the owner wants it stronger or weaker after seeing it, the single via-opacity value is the knob.

## Links

- `bugs/31_expanded_sticky_scroll_oscillation.md` (the fade/collapse contract) · `bugs/38_sticky_container_bottom_padding.md`
