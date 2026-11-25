# KIMI KRINIK 1.0.0

2026-11-25

KIMI KRINIK 1.0.0 combines the official Kimi Code 2.7.2 engine with the KIMI FORK interface and adds independent context management, reliable follow-ups and a three-language UI.

## What's new

- Turn off automatic compaction, including an operation already in progress. Manual `/compact` remains available.

- Use Context Window Control with configurable thresholds, without requiring KAIF. Threshold messages hand work over to a new chat before the window overflows.

- Send follow-ups immediately with AUTO STEER or restore the ordinary queue. Ordered batches join once, and rejected messages return to their original positions.

- Send images, video and media-only prompts with clickable thumbnails and the same viewer after replay. Preserve manual line breaks and blank lines.

- Keep the prompt that owns the visible response on top. Expand and collapse it with an animated chevron, and see localized send times inside user bubbles.

- Choose models and reasoning effort through one picker with search and favorites. Explicit MAX/XHigh choices persist, while resumed sessions keep their own effort.

- Use English, Russian or Chinese with a selected-first language dialog and localized interface controls.

- Configure a sound and volume per event with prerecorded clips in all three languages. Sound selectors remain editable after choosing Off.

- Use responsive Control Panel actions, live status panels, the Working indicator and the pink KIMI KRINIK robot. Read the version and build number in Action Menu.

- Keep history stable during replay and late request-setup errors. Internal instructions do not appear as assistant text, and unrelated turns are not deleted.

## Verification

The release candidate has 607 passing checks and 1 skipped check, green typecheck and lint, and successful static/import verification for six package targets. Build 19 passed isolated VS Code scenarios for steering, replay, media, context thresholds and sticky prompts. The accumulated main profile delivered the real 70% context warning.

Acceptance of the remaining corrected chat paths on the accumulated main profile is still being completed.

## Install

Download `kimi-code-win32-x64.vsix` and choose **Extensions → ⋯ → Install from VSIX…**. KIMI KRINIK installs beside the official Kimi Code and KIMI FORK extensions, preserving projects and sessions. Returning to the official extension does not remove them.

[README](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION#readme)
