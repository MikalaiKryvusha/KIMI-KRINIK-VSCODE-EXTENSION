# Audit 001 · Family: commented TOML section handling

**Mechanism:** exact string matching fails to recognize a legal section header with trailing whitespace/comment, appends a duplicate table and rejects the save during validation.
**Already guarded by:** ordinary TOML persistence and validate-before-rename; commented headers are not covered.
**Occurrences:** F1.

## F1 — `[secondary_model] # note` prevents secondary-model changes

**Quote:** `apps/vscode/src/config/secondary-model.ts:38-42` — `if (trimmed === header) { skipping = true; continue; }`.

**Failure scenario:** existing config contains `[secondary_model] # owner note`. The old table is retained, persistence appends another table and validation rejects the duplicate. The user cannot change selection until repairing valid configuration.

**Severity:** Track — feature failure with a visible error, not silent data loss; low-to-medium likelihood because annotated TOML is valid and plausible.

**Baseline:** new.

kaif-fp: apps/vscode/src/config/secondary-model.ts :: legal-commented-toml-header-missed :: v2.10

**Dedup attestation:** header/comment/secondary_model searches found no existing case. Reviewer could not execute direct imports because of the TS/raw-text loading chain; skeptic subsequently reproduced through the real loader.

**Fix sketch:** recognize legal table-header whitespace and trailing comments for main sections and subsections, or use a TOML-aware section locator. Preserve validation before rename.

**Fix accepted when:** commented main/subsection cases leave one `[secondary_model]` table and preserve unrelated sections under `pnpm exec vitest run --reporter=agent apps/vscode/test/secondary-model.test.ts -t "comment"`. Today's real persistence rejected with KimiError about redefining an existing table and performed no writes.

**Do not touch:** intentional whole-recipe replacement, Follow-main cleanup, CRLF handling and validate-before-write.

**Meta:** links root older-configuration rules and EXP-0002. Host skeptic directly reproduced both the unchanged strip result and the rejected real save. This is a proven persistence failure even though its severity is Track.
