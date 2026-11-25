# Bug 06 — Extension Host smoke inherits Electron Node mode

**Status:** ✅ DONE
**Version/build:** 1.0.0 · `kaif/no-auto-compaction` · **When/context:** 2026-11-24, K5 isolated VSIX acceptance
**Severity:** S2
**Fixing:** this session
**Fix accepted when (observable):** with the caller's `ELECTRON_RUN_AS_NODE=1`, `pnpm --filter kimi-code-kaif test:extension-host --version 1.123.0` installs the VSIX, activates `mikalai-kryvusha.kimi-code-kaif`, opens its webview and exits 0 without an external `env -u` prefix.

## Symptom

The standard Extension Host smoke command exits 1 before loading the test harness. Electron reports `Cannot find module 'F:\Temp\kvh-<id>\ws'` and treats the workspace path as a Node entry point.

## Repro (deterministic)

1. Run the command from an official Kimi Code session where `ELECTRON_RUN_AS_NODE=1`.
2. Use the cached VS Code 1.123.0 installation to remove network variability.
3. Observe the Node `MODULE_NOT_FOUND` error before extension activation.

## Forensics

- Probe: `{"ELECTRON_RUN_AS_NODE":"1"}` in the calling process.
- `@vscode/test-electron/out/runTest.js:71-74` merges `extensionTestsEnv` over `process.env` and spawns VS Code with the result.
- Control run with `env -u ELECTRON_RUN_AS_NODE` passed: extension 1.0.0 activated, ten commands registered, webview opened, Extension Host exited 0.

## Root cause / Hypotheses

Confirmed: the smoke script does not override the inherited Electron Node-mode variable. The desktop test fixtures already use `ELECTRON_RUN_AS_NODE: undefined` for the same environment boundary.

## Fix plan

Set an own `ELECTRON_RUN_AS_NODE: undefined` property in `extensionTestsEnv`. Add a smoke-script unit check that requires this explicit override, then run the real installed-VSIX smoke with the caller variable still set to 1.

TWINS: searched project scripts and desktop fixtures for `ELECTRON_RUN_AS_NODE`; the desktop harness already removes it. No other VS Code Extension Host launcher exists in `apps/vscode/scripts`.

## Decisions made without the owner

Chose the existing `ELECTRON_RUN_AS_NODE: undefined` environment-boundary pattern already used by desktop tests. Changed only the smoke harness; no product runtime code changed.

## Links

- `D:/work/ai_sandbox/KAIF/plans/153_epic147_K5_live_release.md`
- `apps/vscode/scripts/extension-host-smoke.mjs`

## ✅ STATUS: DONE (2026-11-24 04:27 +03:00)

The smoke launcher now explicitly clears inherited Electron Node mode. The new check failed before the override (`Object.hasOwn(...)`: false) and passed afterward.

Hygiene: smoke harness 4/4; full extension 535 passed / 1 skipped; typecheck and root lint green.
Functional run: `pnpm --filter kimi-code-kaif test:extension-host --version 1.123.0` with the caller's inherited variable still set installed the real VSIX, activated extension 1.0.0, registered ten commands, opened the webview and exited 0; the activation JSON and host log were read.
Run report: `testcases/reports/2026-11-24_k5_live_acceptance.md` · runs 7 and 11.
