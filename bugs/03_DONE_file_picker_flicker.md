# Bug 03 — File picker replays stale search states on opening

**Status:** ✅ DONE
**Version/build:** 1.0.0 · owner live report during K1 · **Severity:** S2
**Fixing:** this session
**Fix accepted when (observable):** reopening the picker with an empty `@` query never displays results from the previous query; only the empty-query loading/result state appears before the current response.

## Symptom

The picker flickered several times when opened.

## Repro (deterministic)

1. Search one query in the picker and close it.
2. Reopen with a new empty `@` token before the old debounce expires.
3. Observe whether previous-query rows render before the empty-query request starts.

## Forensics

`useFilePicker` originally enabled React Query immediately while `debouncedQuery` still held the previous query for up to 100 ms. `keepPreviousData` could then render stale rows under the newly opened empty picker.

## Root cause

Confirmed stale debounced query plus previous-data placeholder on a newly opened empty search.

## Fix

Use the empty query immediately for a new empty picker, bypass the previous-data placeholder for that opening, and retain debouncing only for non-empty searches. The hook regression test guards the state transition.

TWINS: searched picker query/debounce/previous-data handling; the live hook is the single affected path.

## Decisions made without the owner

Kept the existing query and debounce machinery; changed only the empty-open state path.

## Links

`bugs/02_file_picker_toggle.md`

## ✅ STATUS: DONE (2026-11-24 07:14 +03:00)

Hygiene: existing hook regression remains green.
Functional run: real installed VSIX with `alpha.txt`, `beta.txt` and `README.md`. The filtered picker showed only `alpha.txt`; the immediate empty reopen showed no stale rows, and the next frame showed all three current files. The same filtered/immediate/current sequence was observed after full Kimi/OS home isolation. WebP: `.tmp/k5-vscode/03-file-picker-current.webp`.
Run report: `testcases/reports/2026-11-24_k5_live_acceptance.md`.
