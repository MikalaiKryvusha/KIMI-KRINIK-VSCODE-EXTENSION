# KAIF bug: review and voice-soft bypass the configured file voice and emit rejected beeps

kaif-fp: tools/contour/review.mjs + voice-soft.mjs :: configured-voice-bypass :: v2.10
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/208
**Severity:** S1 — the owner explicitly reported repeated unwanted beeps and loss of trust in the voice contour.
**Autocapture:** KAIF 2.10 · project KIMI KRINIK · sphere programming · language ru · i18n ru · tracking origin · agent system kimi-code · OS Windows 11 · Node 24.15.0
**Dedup attestation:** searched `bugs/KAIF/` with Grep pattern `voiceFileTool|voice-soft|three beeps|beeps|Glass` (no matches) and open origin issues with `gh issue list --repo MikalaiKryvusha/KAIF --state open --search "voice-soft voiceFileTool beeps"` (no matches). No match found.

## Expected per canon

`HOUSE_RULES.md` R1: «Для обращения владельца запускай `node .kaif/tools/contour/voice-soft.mjs --file <файл> --play`: он берёт настроенный `contour.voiceFileTool` и сохраняет единый Silero + Glass маршрут.»

The machine voice rules require one WAV with silence, Glass, a pause and Silero speech. The owner rejected the three synthesized beeps.

## Got in the field

`node .kaif/tools/contour/voice-soft.mjs --file voice/2026-11-27_17-05-36_restore_review_and_release_notes.txt --play` printed:

`voice-soft: no engine rendered the phrase (neither KAIF_VOICE_RENDER nor KAIF_VOICE_BASE_TOOL is set)`

The default page show printed `CALL: voice — eugene via KAIF_VOICE_TOOL; fallback — system voice of culture "ru" (I35). Rendering the voice first (--out) — beeps and voice in one sound file.` The owner then reported: «опять ты три писка делал а не глас.... я устал уже просить».

## Repro (deterministic)

1. Configure `contour.voiceFileTool` in `.kaif/kaif.json` and leave `KAIF_VOICE_FILE_TOOL` unset.
2. Run `node .kaif/tools/contour/voice-soft.mjs --file <existing-phrase> --dry-run`. Before the fix, the tool ignored the marker and selected its beep-based renderer; a real `--play` exited 2 when no generic renderer was configured.
3. Run `node .kaif/tools/contour/review.mjs --call "Test" --dry-run`. Before the fix, `sound:` named generic beeps and system voice instead of the configured file tool.

## Cost and violated invariant

The owner heard a signal he had explicitly rejected more than once. Stopping the generic call also stopped the review server, so the interactive page temporarily reported that its server was unavailable. Violated invariants: owner-work-safety and owner-decisions.

## What in KAIF led to this

`voice-soft.mjs` read `KAIF_VOICE_FILE_TOOL` only from the environment although the permission hook already read the same command from `.kaif/kaif.json`. `review.mjs` had no `contour.voiceFileTool` branch and always entered its generic beep/system-voice signal path.

TWINS: searched `voiceFileTool` across `.kaif`; the permission hook already used the marker, while `voice-soft.mjs` and `review.mjs` were the two bypass sites. Both are covered by the local remediation.

## Local remediation

`voice-soft.mjs` now resolves `contour.voiceFileTool` from the marker with the environment as an override. `review.mjs` gives a configured file tool ownership of the complete signal, without contour beeps or system-voice fallback, while preserving quiet hours and the one-voice lock.

Observed after the fix: voice-soft selftest 16/16, contour selftest 193/193, voice-soft dry-run names the configured Silero command, and review dry-run prints `configured contour.voiceFileTool only — the file tool owns its signal; no contour beeps`. No sound was played during these checks. The new selftest cases were not separately mutation-proved; the original field commands provide the red-before evidence.
