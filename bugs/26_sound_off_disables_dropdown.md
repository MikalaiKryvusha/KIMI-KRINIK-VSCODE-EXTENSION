# Bug 26 — Selecting Off disables the sound dropdown instead of only its playback controls

**Status:** 🔧 isolated build-18 fix verified; main-profile acceptance pending
**Version/build:** KIMI KRINIK 1.0.0 build 12 · owner's accumulated VS Code profile · **When/context:** 2026-11-25 01:03 +03:00, owner sound-settings review
**Severity:** S2
**Fixing:** this session
**Fix accepted when (observable):** with global Sound enabled, choosing «Выкл» disables only volume and Preview; the event dropdown remains operable and can immediately select an audible choice again. With global Sound disabled, event dropdowns remain available for editing while volume and Preview stay disabled. EN/RU/ZH behavior is identical.

## Symptom

[OWNER] «в настройках звука если поставить Выкл, то пункт блокируется так, что его обратно включить даже нельзя, так как выпадающее меню блокируется - баг» · 2026-11-25 01:00 +03:00 (чат)

The supplied screenshot shows «Ошибка» and «Ответ завершён» set to «Выкл»; their dropdowns and playback controls appear disabled. The owner cannot use the same control to turn sound back on.

## Repro

1. Open Sound Settings with global Sound enabled.
2. Set any event to «Выкл».
3. Reopen that event's dropdown and choose Glass, Voice, Alert or Chime.

## Forensics

Before the fix, `SoundSettingsModal.tsx` computed one `disabled = !soundEnabled || setting.sound === "off"` flag and passed it to the event `Select` as well as volume and Preview.

## Root cause / Hypotheses

Confirmed code-level ownership error: one disabled flag was shared by the selector and its dependent controls.

## Fix

Keep the event selector enabled whenever settings can be edited; apply global/per-event disablement only to volume and Preview. User-boundary regressions select Off and then reselect an audible option and edit while global Sound is OFF.

## Decisions made without the owner

Kept global Sound as the master playback switch while allowing future event choices to be edited globally off. Volume and Preview remain disabled for Off events.

## Fix evidence — 2026-11-25 01:43 +03:00

The selector no longer consumes playback disablement; volume and Preview use `playbackDisabled`. The original two user-boundary tests were red before the change and both pass afterward, including Off → Glass and global-OFF editing.

Functional run: fresh isolated build 18, Russian Sound Settings. Selecting «Выкл» for «Ошибка» produced `selectorDisabled=false` and `volumeDisabled=true`; reopening the same selector and choosing «Стекло» produced `selectorDisabled=false` and `volumeDisabled=false`. WebP `.tmp/k5-vscode/48-build-18-sound-reenabled.webp` was opened and read. Main-profile and live EN/ZH passes remain pending; localized text does not own the enablement logic.

TWINS: searched `disabled` and `setting.sound === "off"` in the sound settings component — the single shared selector/playback construct was removed; volume and Preview intentionally retain playback disablement.

Report: `testcases/reports/2026-11-25_ui_controls_build_18.md`.

## Links

- `bugs/24_glass_preview_silent.md`
- `apps/vscode/test/webview/sound-settings-modal.test.tsx`
