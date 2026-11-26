# Audit 001 · Family: configuration writes lose confirmed state

**Mechanism:** asynchronous configuration writes restore captured optimistic state without preserving the newest accepted value or the last host-confirmed value; shared staging names add a second overlap hazard.
**Already guarded by:** model-specific revision handling and serialized sound-volume writes; most other setters and config/marker writers lack the same protection.
**Occurrences:** F1 stale rollback, F2 all-failed optimistic restore, F3 shared-staging race.

## F1 — An older failed write rolls back a newer successful choice

**Quote:** `apps/vscode/webview-ui/src/stores/settings.store.ts:269` — `set({ extensionConfig: { ...get().extensionConfig, language: previous } });`. Twins were identified at Context Window Control `:288`, thresholds `:307`, Control Panel visibility `:328`, order `:348`, General settings `:359` and global sound enabled `:502`.

**Failure scenario:** English → Russian → Chinese with deferred writes; Chinese succeeds, then the older Russian write rejects and restores English.

**Severity:** Attend — visible and persisted configuration diverge; medium likelihood requiring rapid changes and one failed write.

**Baseline:** known: 10, with previously unguarded non-sound twins.

kaif-fp: apps/vscode/webview-ui/src/stores/settings.store.ts :: stale-failure-overwrites-newer-setting :: v2.10

**Dedup attestation:** stale/out-of-order rollback searches found bug 10's sound-volume guard and a model guard only. No equivalent coverage exists for the listed setters.

**Fix sketch:** use per-setting revision checks or serialize mutations with latest-value projection; preserve pending optimistic values across host events. Do not suppress the genuine single-request failure restoration.

**Fix accepted when:** one regression family named `older failed setting write cannot roll back a newer choice` covers language and every listed setter family and passes with `pnpm exec vitest run --reporter=agent apps/vscode/test/settings-store.test.ts -t "older failed setting write cannot roll back a newer choice"`. Today's real-store probe ended with `afterNewerSuccess: "zh"` and `afterOlderFailure: "en"`.

**Do not touch:** working model/sound guards and host sound serialization. The skeptic narrowed the `soundEnabled` exact ordering claim because host writes are serialized; do not assume that ordering exists there.

**Meta:** links bugs/10, EXP-0002 and root failure-path rules. Skeptic confirmed the language path through the real store.

## F2 — Two failed sound writes restore a value that was never confirmed

**Quote:** `apps/vscode/webview-ui/src/stores/settings.store.ts:481` — `const previous = get().extensionConfig.sounds;`.

**Failure scenario:** from confirmed volume 80, issue 10 then 20; both writes reject. The latest rejection restores the intermediate optimistic 10 rather than confirmed 80.

**Severity:** Attend — saved and displayed configuration diverge until reload; requires two failed writes.

**Baseline:** new branch of known: 10.

**Dedup attestation:** searches for two/all-failed writes found no all-failed sound case. UI reviewer's in-memory probe did not run because its DOM initialization failed, so this remains source-proven until the executor's regression runs.

**Fix sketch:** retain last-host-confirmed values and latest-request revisions per setting; restore the confirmed value only on the latest failure and never mutate from older failures.

**Fix accepted when:** both-reject sound and older-reject/newer-success threshold cases pass in `apps/vscode/test/settings-store.test.ts`. Today's source branch deterministically selects the intermediate map; no live UI claim.

**Do not touch:** latest-write-wins success, genuine single-failure rollback and stale-event protection.

**Meta:** same paid class as F1. Await the UI skeptic's independent verdict before fixing this branch.

## F3 — Concurrent config/marker writes share a staging path

**Quote:** `apps/vscode/src/handlers/behavior.handler.ts:81-83` — ``const staging = `${marker}.${process.pid}.tmp`;`` followed by write and rename; `apps/vscode/src/config/secondary-model.ts:21-24` uses the same pattern.

**Failure scenario:** two overlapping writes read the same target, write the same PID-based staging path and race rename; one rejects ENOENT or an older value survives.

**Severity:** Track pending real-filesystem/live reproduction — controlled public-function overlap reproduced shared staging and one rejected ENOENT, but live frequency and user impact remain potential risks.

**Baseline:** new.

kaif-fp: apps/vscode/src/handlers/behavior.handler.ts :: shared-atomic-staging-race :: v2.10

**Dedup attestation:** searches for concurrent/rapid/staging/process.pid found only the sound race lesson and no marker/secondary coverage.

**Fix sketch:** serialize each target's full read→validate→write→rename operation, use unique staging names and clean failed staging files; retain atomic rename.

**Fix accepted when:** deferred overlapping writes preserve the latest value without rejection in behavior-handler and secondary-model tests. Today's controlled probes yielded `outcomes: ["first resolved","second rejected ENOENT"]`; no real-filesystem/live UI run.

**Do not touch:** serialized sound writes, unrelated marker fields and successful single-writer behavior.

**Meta:** links bugs/10 and the unique-staging implementation in `apps/vscode/src/managers/baseline.manager.ts`. Host skeptic confirmed the controlled mechanism and explicitly limited it to a potential live race.
