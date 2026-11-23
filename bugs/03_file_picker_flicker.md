# Bug 03 — File picker replays stale search states on opening

**Status:** 🔧 fix pending live Extension Host verification
**Version/build:** 1.0.0 · owner live report during K1 · **Severity:** S2
**Fixing:** this session
**Fix accepted when (observable):** reopening the picker with an empty `@` query never displays results from the previous query; only the empty-query loading/result state appears before the current response.

## Symptom

The picker flickers several times when opened.

## Repro (deterministic)

1. Search one query in the picker and close it.
2. Reopen with a new empty `@` token before the old debounce expires.
3. Observe that the previous query's rows are rendered before the empty-query request starts.

## Forensics

`useFilePicker` enables React Query immediately, but `debouncedQuery` still holds the previous query for up to 100 ms. `keepPreviousData` then renders those stale rows under the newly opened empty picker.

## Root cause / Hypotheses

Confirmed stale debounced query plus previous-data placeholder on a newly opened empty search.

## Fix plan

Use the empty query immediately for a new empty picker, bypass the previous-data placeholder for that opening, and retain debouncing only for non-empty searches. Add a hook regression test.

## Decisions made without the owner

Pending closure.

## Links

`bugs/02_file_picker_toggle.md`
