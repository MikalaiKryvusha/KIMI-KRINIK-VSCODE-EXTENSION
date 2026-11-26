# Bug 27 — MAX reasoning effort appears as High in a new VS Code session and effort labels are not localized

**Status:** 🔧 isolated build-18 persistence, wire and RU/EN/ZH label checks passed; main-profile acceptance pending
**GitHub issue:** https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues/17
**Version/build:** KIMI KRINIK 1.0.0 build 12 · owner's accumulated VS Code profile · **When/context:** 2026-11-25 01:03 +03:00, owner new-session model review
**Severity:** S2
**Fixing:** this session after `bugs/26`
**Fix accepted when (observable):** selecting MAX and fully restarting VS Code preserves and displays MAX for a new session without overwriting a resumed session's own effort; the actual engine status/config and outgoing request use max. Russian Control Panel shows «Низк.», «Выс.», «МАКС» for low/high/max, while the open picker shows «Низкий», «Высокий», «МАКС». English and Chinese labels are localized through the same dictionary rather than raw effort identifiers.

## Symptom

[OWNER] «у меня есть ощущение, что между сессиями уровень рассуждений не сохраняется. Я ставлю на MAX, но в новых сессиях вс код ты открываештся на High. И нужно эти уровни усилий локализовать. Низкий Высокий МАКС» · 2026-11-25 01:00 +03:00 (чат)
[OWNER] «вот тут в Control Panel на русском можно сокращать Низк. Выс. МАКС», «а внитри писать полные слова» · 2026-11-25 01:02 +03:00 (чат)

The owner supplied a Control Panel screenshot with raw `High`. MAX appearing as High after reopening is an owner observation, not yet a confirmed engine/config reset.

## Repro

1. Select a model supporting low/high/max and choose MAX.
2. Fully restart VS Code and open a new KIMI KRINIK session.
3. Read the persisted global config, engine session status, compact Control Panel label and open picker labels.
4. Resume an older session with a different effort and confirm it is not overwritten by the global default.

## Forensics

Before the fix, `ModelPicker.tsx` capitalized raw effort identifiers for both compact and expanded surfaces. The host's `thinkingConfig` and webview `persistsAsDefaultEffort` deliberately discarded a concrete pick above the model's delivered `default_effort`; with default High, selecting MAX wrote only `thinking.enabled` and future sessions resolved High again.

## Root cause / Hypotheses

1. Confirmed: one raw-label formatter served both compact and expanded UI, with no localization.
2. Confirmed: host and webview policies kept above-default choices session-only, so MAX was not written as the global default.
3. The new contract persists each explicitly selected supported effort; resumed sessions still use their own engine status.

## Fix

Persist each explicitly selected supported effort in the existing global config and webview seed; preserve the resumed-session engine-status boundary. Use separate full and compact localized label maps for EN/RU/ZH with the owner's exact Russian forms. Guard save/reload, resumed-session effort and the outgoing request body.

## Decisions made without the owner

Grouped persistence and labels in one model-picker work item because they share the same restart acceptance path; their causes remain separate. No second persisted effort store will be introduced.

## Fix evidence — 2026-11-25 01:43 +03:00

Removed the above-default persistence ceiling in both host and webview, not the resumed-session boundary. Added dictionary-owned full/compact labels for low/medium/high/xhigh/max in EN/RU/ZH. The changed old tests are justified by the owner's explicit new persistence requirement; 84 affected checks pass.

Functional run: isolated testkit model declared default High and supported low/high/max. Selecting MAX wrote `config.toml` `[thinking] enabled=true, effort="max"`; a raw-CDP full VS Code restart displayed `testkit-model · МАКС`. The open picker exposed «Низкий / Высокий / МАКС». The real outgoing request body contained `thinking: { type: "enabled", effort: "max", keep: "all" }`. WebP `.tmp/k5-vscode/47-build-18-effort-menu.webp` was opened and read. EN/RU/ZH compact/full component cases pass; live Russian restart/wire evidence is observed, main-profile acceptance remains pending.

TWINS: searched `persistsAsDefaultEffort`, `defaultEffort` ceilings and raw `effortLabel` formatting — removed the host/webview persistence pair; the compact and expanded label consumers now share the same localized map.

Report: `testcases/reports/2026-11-25_ui_controls_build_18.md`.

## Links

- `apps/vscode/test/bridge-handler.test.ts` effort persistence cases
- `apps/vscode/test/kimi-runtime.test.ts` resumed-session effort cases
- `HOUSE_RULES.md` R4
