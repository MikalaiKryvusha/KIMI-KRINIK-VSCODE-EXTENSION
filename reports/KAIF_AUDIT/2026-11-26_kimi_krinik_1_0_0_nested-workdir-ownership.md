# Audit 001 · Family: selected-workdir ownership target

**Mechanism:** ownership synchronization always writes the first workspace root instead of the active custom workdir and does not run during selection.
**Already guarded by:** direct workdir projection tests; no nested-marker ownership case.
**Occurrences:** F1.

## F1 — Context configuration can mutate the root marker instead of the selected nested project

**Quote:** `apps/vscode/src/bridge-handler.ts:290-292` — `syncKaifContextWindowOwnership(this.workspaceRoot, VSCodeSettings.contextWindowControl);`.

**Failure scenario:** select `workspace/apps/web` with its own `.kaif/kaif.json`. A later Context Window Control or threshold change rewrites the root marker while the nested marker remains unowned; selection itself does not synchronize ownership.

**Severity:** Attend — wrong-project configuration mutation and possible duplicate KAIF/KRINIK delivery; medium likelihood on supported custom-workdir/nested-marker paths.

**Baseline:** new.

kaif-fp: apps/vscode/src/bridge-handler.ts :: ownership-sync-root-not-active-workdir :: v2.10

**Dedup attestation:** custom-workdir/nested-marker/ownership searches found no equivalent ticket or combined regression.

**Fix sketch:** synchronize the active per-view workdir on selection and configuration changes; process each distinct active workdir where views differ. Preserve parent-marker discovery when no nested marker exists.

**Fix accepted when:** a root+nested regression proves selection and later threshold changes update only the nested marker. Run `pnpm exec vitest run --reporter=agent apps/vscode/test/bridge-handler.test.ts apps/vscode/test/behavior-handler.test.ts -t "custom workdir|nested.*marker"`. Today's real handler probe selected `<repo>\apps` but synced `{workDir:"<repo>",enabled:false}`; no call occurred at selection.

**Do not touch:** KAIF-independent operation, parent-marker discovery, threshold text and manual compaction.

**Meta:** links GOAL.md:30, internal-map invariant 4, bugs/28 and EXP-0004. Host skeptic confirmed the wrong-target mechanism with the writer stubbed; actual nested-marker mutation and duplicate delivery remain potential consequences, not observed outcomes.
