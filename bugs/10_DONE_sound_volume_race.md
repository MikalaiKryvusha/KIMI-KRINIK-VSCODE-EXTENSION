# Bug 10 — Volume sliders jump during rapid changes

**Status:** 🔴 OPEN
**Version/build:** KIMI KRINIK 1.0.0 after C24 · **When/context:** 2026-11-24, owner report during Sound Settings review
**Severity:** S2
**Fixing:** this session after the current responsive/brand UI cut
**Fix accepted when (observable):** a rapid series of volume changes keeps the latest pointer value through host configuration events and completion of all writes; every event keeps its own selected sound, and the final persisted value equals the last input.

## Symptom

Quickly moving a volume slider makes its value jump unexpectedly instead of following the latest input.

## Repro (deterministic)

1. Open Sound Settings.
2. Change one event's volume rapidly through a sequence such as 10 → 20 → 40 → 80 → 100.
3. Emit configuration updates and resolve writes in the same sequence; separately verify an older failure or event cannot roll back the latest value.

## Forensics / hypotheses

- `SoundSettingsModal` uses controlled `value={setting.volume}` and optimistic `changeSounds`.
- `settings.store.ts:446-455` starts one async host update per input and rolls back on any failure without a latest-revision guard.
- `App.tsx` and `useAppInit.ts` replace the whole extension config on `ExtensionConfigChanged`, so stale sound configuration can overwrite a newer optimistic value.
- `behavior.handler.ts:10-12` does not serialize sound writes, so host events may arrive while earlier updates are still pending. The exact failing ordering will be proven by a regression, not assumed from code alone.

## Fix plan

Add a latest-write revision guard and preserve the optimistic sound value while writes are pending; serialize host sound updates. Test mixed stale events, out-of-order failures and final persistence without changing other sound settings.

## Decisions made without the owner

Did not add debounce: [React requires a controlled input to update synchronously](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable), while [Lodash debounce only delays invocation](https://lodash.com/docs/4.17.15#debounce) and cannot prevent stale events/responses. Serialized host sound writes and added a latest-revision guard plus pending-value preservation in the store. Kept volume tracks neutral and the focus ring pink for accessibility. Global mute reads the settings store directly, avoiding a public signature change.

## ✅ STATUS: DONE (2026-11-24 12:16 +03:00)

Hygiene: rapid 10→20→40→80→100 with a stale event and older failed write remains 100; host writes serialize; global mute and Triple/Glass/Eugeny checks are green. Full extension suite: 556 passed, 1 skipped; typecheck and lint passed.
Functional run: rebuilt 31-file VSIX including `resources/glass.opus`; UI rapid volume remains 100, Triple preview returns 880/660/990, Glass preview loads the packaged URL with volume 1, global OFF disables preview and creates no audio. WebP 28/29 read: neutral tracks and the global switch.
TWINS: searched `changeSounds`, `updateExtensionSetting` and `previewSound` callers — global mute covers real attention, preview and per-event settings without changing their existing call signatures.
