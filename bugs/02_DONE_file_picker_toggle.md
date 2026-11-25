# Bug 02 — Attachment button reopens the file picker instead of closing it

**Status:** ✅ DONE
**Version/build:** 1.0.0 · owner live report during K1 · **Severity:** S2
**Fixing:** this session
**Fix accepted when (observable):** with the file picker open, one click on the attachment button closes it and removes the trigger `@`; no new `@` is appended and the picker stays closed.

## Symptom

The attachment button opened the file picker, but clicking it again while open did not close the picker.

## Repro (deterministic)

1. Click the attachment button once.
2. Wait for the file picker to appear.
3. Click the same attachment button again.

## Forensics

`InputArea.handleAddButtonClick` originally always appended `@`. The picker button was outside the refs passed to `useClickOutside`, so the press first closed the active token and the click handler then appended a new token and reopened the menu.

## Root cause

Confirmed event-order race between outside-click dismissal and the button's unconditional append behavior.

## Fix

The attachment button belongs to the click-outside boundary and explicitly toggles the active picker. Component regression coverage guards open → close.

TWINS: searched the picker trigger, click-outside boundary and active-token handling; the same button is the only attachment-toggle site.

## Decisions made without the owner

Used the existing click-outside and active-token state instead of adding a second picker visibility store.

## Links

`bugs/03_file_picker_flicker.md`

## ✅ STATUS: DONE (2026-11-24 07:14 +03:00)

Hygiene: existing component open→close regression remains green.
Functional run: on the real installed VSIX in Second Side Bar, the first attachment click produced `@` plus the picker loading state; the second removed `@` and the picker stayed closed. The scenario was repeated after Kimi/OS home isolation with the same observed result.
Run report: `testcases/reports/2026-11-24_k5_live_acceptance.md`.
