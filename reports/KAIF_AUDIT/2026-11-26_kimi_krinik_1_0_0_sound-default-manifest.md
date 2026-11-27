# Audit 001 · Family: sound defaults manifest drift

**Mechanism:** the valid manifest-provided object survives normalization and overrides the owner-approved shared defaults with different values.
**Already guarded by:** shared-constant tests; no manifest-to-constant equality or fresh-host assertion.
**Occurrences:** F1, independently raised by the UI and host reviewers.

## F1 — Fresh installs receive Voice/Voice/Off instead of Glass/Alert/Chime

**Quote:** `apps/vscode/package.json:99` — `"sound": "voice",`; the full default block currently maps approval=voice, question=voice, error=voice and turnComplete=off. Required values are in `apps/vscode/shared/sounds.ts:15-20`: Glass / Voice / Alert / Chime.

**Failure scenario:** on a fresh profile, open Sound Settings without changing anything and trigger approval, error and completion. The manifest's valid values survive normalization, so the UI and playback use the stale defaults.

**Severity:** Act — every fresh install misses the owner-approved defaults; certain on an untouched profile. Existing explicit choices are unaffected.

**Baseline:** new.

kaif-fp: apps/vscode/package.json :: sound-default-mirror-drift :: v2.10

**Dedup attestation:** both reviewers searched sound/default/approval/turn patterns across bugs/plans/testcases and found no matching ticket or third writer correcting the manifest.

**Fix sketch:** make the manifest byte-equivalent to `DEFAULT_SOUND_SETTINGS`, add manifest/shared deep-equality and fresh-host assertions, and update the manifest's sound-choice description to include Triple and Glass.

**Fix accepted when:** `sound defaults match` is printed by the documented manifest/deep-equality probe and the real fresh Extension Host exposes Glass/Voice/Alert/Chime. Today the probe exits 1 with actual Voice/Voice/Voice/Off versus expected Glass/Voice/Alert/Chime; the universal VSIX carries the same mismatch.

**Do not touch:** persisted user choices, legacy partial-map normalization, sound-write race handling, replay silence and audio paths.

**Meta:** links GOAL.md:35, bugs 17/24, EXP-0002/0007 and the truth↔mirror rule. Both skeptics independently confirmed the mismatch. The host skeptic corrects the address to package.json:98-102 for the approval block and notes that fresh-profile UI presentation remains unobserved.

## Remediation — 2026-11-27 09:44 +03:00

Hygiene: manifest/shared deep equality and the fresh-host assertion were both red on the original source and packaged build 53 with actual Voice/Voice/Voice/Off. After aligning only the manifest values and choice description, 69/69 affected tests, extension/webview typecheck, build-54 package/static audit and root lint pass. Existing saved choices, partial maps, normalization and sound-write controls remain green.

Functional run: PASS for the scoped fresh-install finding. The real packaged build-54 Extension Host on VS Code 1.123.0 read and printed Glass/Voice/Alert/Chime with volumes 80/80/80/60; 10 commands registered and the webview opened. Build 54 is installed on main and isolated profiles; both installed manifests and source/installed extension/webview hashes match. The main window was not reloaded, and audible output was not measured. Evidence: `testcases/reports/2026-11-27_phase2_sound_defaults.md`.

TWINS: searched `kimi.sounds`, `DEFAULT_SOUND_SETTINGS` and approval/turnComplete sound literals across source and manifests — found 0 other contributed sound-default writers.

TWINS-MECH: searched all forms of a valid fresh-install mirror overriding shared fallback defaults: manifest object, normalizer fallback and webview initial state. Only the manifest drifted; the other two already use the shared constant.

BOTH-WAYS: deep equality guards either direction of source/mirror drift, while the fresh Extension Host independently checks what the consumer actually receives.

Deleted-text sweep: remaining stale-value mentions are historical pre-fix records or the pre-existing untracked `.vscode-test` installation, not current source defaults.
