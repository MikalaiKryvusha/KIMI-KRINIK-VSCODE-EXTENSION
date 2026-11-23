# Bug 02 — Attachment button reopens the file picker instead of closing it

**Status:** 🔴 OPEN
**Version/build:** 1.0.0 · owner live report during K1 · **Severity:** S2
**Fixing:** this session
**Fix accepted when (observable):** with the file picker open, one click on the attachment button closes it and removes the trigger `@`; no new `@` is appended and the picker stays closed.

## Symptom

The attachment button opens the file picker, but clicking it again while open does not close the picker.

## Repro (deterministic)

1. Click the attachment button once.
2. Wait for the file picker to appear.
3. Click the same attachment button again.

## Forensics

`InputArea.handleAddButtonClick` always appends `@`. The picker button is outside the refs passed to `useClickOutside`, so the press first closes the active token and the click handler then appends a new token and reopens the menu.

## Root cause / Hypotheses

Confirmed event-order race between outside-click dismissal and the button's unconditional append behavior.

## Fix plan

Include the attachment button in the click-outside boundary and make its click handler explicitly toggle the active picker. Add a component regression test for open → close.

## Decisions made without the owner

Pending closure.

## Links

`bugs/03_file_picker_flicker.md`
