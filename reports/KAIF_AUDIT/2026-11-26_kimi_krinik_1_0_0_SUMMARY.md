# Audit 001 — KIMI KRINIK 1.0.0 complete release diff (2026-11-26)

**Verdict (before the evidence): RELEASE BLOCKED.** Three reviewers raised 16 cards; one sound-default claim was duplicated, leaving 15 unique mechanisms. Independent skeptics confirmed all 15, with one concurrency issue explicitly limited to a potential live race. Five findings are Act and must be fixed before publication. Green suites did not cover the failing orders and keyboard/geometry paths.

## Scope and methodology

| Field | Value |
|---|---|
| Commit / tree state | pinned official base `56145f849`; reviewed product changes through `08930ec70` plus the intentional build-45 worktree changes |
| Slice | complete `apps/vscode` diff (161 files, 11,950 insertions / 1,027 deletions at review start) plus directly used node-sdk and agent-core-v2 paths; unrelated upstream engine changes excluded |
| Axes run | defects, vulnerabilities, data loss, race conditions, frauds, contradictions and omitted promised behavior; checks that cannot fail; one-directional invariants; source/mirror drift; progress ordering; old sessions/restarts; two clients; cancellation/mid-turn events; Windows paths/CRLF/BOM; invalid config; tests green for the wrong reason |
| Model / reviewers | `kimi-code/k3.1-pro` max; three independent zone reviewers and three independent skeptics; no reviewer judged its own card |
| Deterministic layer | `node .kaif/kaif-core.mjs check` passed; full extension 656 passed / 1 skipped; typecheck and root lint passed; seven build-45 VSIX audits and import smoke passed; `vsce` packaged the independent README/CHANGELOG successfully |
| Excluded classes | style/formatting/naming-only preferences, unreachable resource exhaustion, generic validation without concrete misuse, deliberate documented duplication and already named/dated deferred debt |
| Previous run | none; previous effective FP metric not applicable |
| Run | first full revision; the next run must change axes/data rather than repeat the same read |

## Coverage map

| Zone | Looked at | Not looked at | Why |
|---|---|---|---|
| Chat/runtime | all assigned runtime, handlers, shared, stores and chat/sticky/status/queue source whole; changed tests whole or complete diff | packaged-VSIX/live reproduction of the new findings | skeptics used real public modules/stores and controlled component probes; packaged timing is the next gate |
| UI/settings/localization/sound | all assigned current components, hooks, i18n, lib, styles, settings and tests whole; deleted-component replacement diffs read; image assets inspected; audio metadata inspected | audible content; ChatArea/ChatMessage/Sticky/StatusPills/QueuedMessagesPanel | those chat files belong to zone 1; no audio was played |
| Host/SDK/packaging | assigned host/config/scripts/shared, direct SDK/engine paths and affected consumers whole; named tests partly read at changed hunks and relevant sections | unrelated upstream engine/SDK changes and reviewer 1's chat territory | scope boundary and no duplicate reading |
| Platforms | real win32-x64 VSIX; universal and six targets statically audited/imported | macOS/Linux real installs and other architectures | no matching host available |

## Families found

| # | Family | Occurrences | Mechanism (one sentence, no property names) |
|---|---|---|---|
| 1 | [Context blocked retry](2026-11-26_kimi_krinik_1_0_0_context-blocked-retry.md) | 1 | a rejected-at-delivery submission enters delivered history and cannot retry |
| 2 | [Queue accepted resubmission](2026-11-26_kimi_krinik_1_0_0_queue-accepted-resubmission.md) | 1 | an accepted queued item becomes sendable again before durable promotion |
| 3 | [Secondary primary default](2026-11-26_kimi_krinik_1_0_0_secondary-primary-default.md) | 1 | a secondary-only action writes the resumed primary model as the global default |
| 4 | [Sound default manifest](2026-11-26_kimi_krinik_1_0_0_sound-default-manifest.md) | 1 duplicate claim | valid manifest values override the approved shared defaults |
| 5 | [Model picker Enter bubbling](2026-11-26_kimi_krinik_1_0_0_model-picker-enter-bubbling.md) | 1 | nested-button Enter selects the highlighted model and closes the dialog |
| 6 | [Cross-client steer](2026-11-26_kimi_krinik_1_0_0_cross-client-steer.md) | 1 | sender-only identity leaves another client with nested or dropped content |
| 7 | [Settings write races](2026-11-26_kimi_krinik_1_0_0_settings-write-races.md) | 3 | asynchronous writes lose newest/confirmed state, and shared staging admits overlap |
| 8 | [Nested workdir ownership](2026-11-26_kimi_krinik_1_0_0_nested-workdir-ownership.md) | 1 | ownership sync targets the workspace root instead of the selected nested project |
| 9 | [Context error as empty](2026-11-26_kimi_krinik_1_0_0_context-error-as-empty.md) | 1 | explicit host failure becomes the empty-context presentation |
| 10 | [Quota keyboard access](2026-11-26_kimi_krinik_1_0_0_quota-keyboard-access.md) | 1 | a non-focusable tooltip trigger prevents keyboard access to quota details |
| 11 | [Sticky replay identity](2026-11-26_kimi_krinik_1_0_0_sticky-replay-identity.md) | 1 | multiple same-turn user actions collapse into one sticky key |
| 12 | [Commented TOML header](2026-11-26_kimi_krinik_1_0_0_toml-commented-header.md) | 1 | exact header matching duplicates a legal commented table and rejects the save |
| 13 | [Sound modal overflow](2026-11-26_kimi_krinik_1_0_0_sound-modal-overflow.md) | 1 | an unbounded centered dialog has no scrolling path in a short viewport |

## Inventory

**Act — fix before release (5):**
1. `context-blocked-retry#F1` — blocked forced closure is not retried.
2. `queue-accepted-resubmission#F1` — accepted Q1 can be submitted twice.
3. `secondary-primary-default#F1` — secondary selection changes the primary default.
4. `sound-default-manifest#F1` — fresh installs get Voice/Voice/Off instead of Glass/Alert/Chime.
5. `model-picker-enter-bubbling#F1` — Enter on a favorite/provider selects and closes a model.

**Attend (6):** cross-client steer · stale settings rollback · all-failed optimistic sound restore · nested-workdir ownership · context failure as empty · quota keyboard access.

**Track (3):** sticky same-turn identity · commented TOML header · shared-staging concurrency (potential live race).

**Confirmed browser component defect (1):** Sound Settings overflow at 500×300; packaged-VSIX verification is still owed.

**Refuted by skeptics (0):** none. Every skeptic independently verified the quoted source and reproduced the core mechanism. This is not treated as a rubber stamp: each output contains its own command/probe and observed output. Two additional UI suspicions were rejected before cards were formed because selected-first language and non-duplicated General Settings are recorded owner decisions.

## Next execution order

1. Fix the five Act findings with red-before-fix public-interface regressions, then run their real packaged paths.
2. Fix Attend findings by class, including all settings twins, and reproduce the shared-staging risk on a real filesystem.
3. Resolve Track findings and the short-viewport dialog without changing their documented boundaries.
4. Rebuild the final VSIX only after all fixes; current build 45 predates them and does not contain the final source documentation changes.
5. Run a fresh judge pass, commit/push, have the owner reload VS Code, and use a fresh `resume` session for the accumulated main-profile acceptance per `HOUSE_RULES.md` R7. Do not reload the self-hosting window from the active agent.

## Limits (honesty)

- “Confirmed” means the independent skeptic verified the address and reproduced the mechanism; it does not mean every consequence was observed in the owner's accumulated profile.
- No finding is a packaged-VSIX or real-account observation unless its family card explicitly says so. The next run must exercise the fixed behavior through real packaged entry points.
- Real macOS/Linux installs, audible voice quality, two physical VS Code clients and the live frequency of the shared-staging race remain uncovered.
- No fixes, Marketplace publication, GitHub Release, remote-tag deletion or main-window reload were performed by the reviewers or skeptics.
- Next run: use the fixes' real packaged paths, a real filesystem race test and different failure orderings rather than repeating this static read.
