# Audit 001 · Family: Sound Settings short-viewport overflow

**Mechanism:** a vertically centered dialog exceeds a short viewport without height bound or scrollable region, while the page itself is overflow-hidden.
**Already guarded by:** Off/global-Off behavior; no viewport geometry coverage.
**Occurrences:** F1.

## F1 — Lower sound controls become unreachable in a short panel

**Quote:** `apps/vscode/webview-ui/src/components/SoundSettingsModal.tsx:46` — `<DialogContent className="sm:max-w-md">`.

**Failure scenario:** open Sound Settings at 500×300. The dialog measured top=-123.039, bottom=423.039, height=546.078 with overflowY=visible; the last Preview remained at top=370.039, below the viewport. Wheel deltaY=400 changed nothing, and focusing that control left it offscreen.

**Severity:** Attend after the browser reproduction — lower event controls are unreachable at a reachable short size; likelihood depends on window height.

**Baseline:** new.

kaif-fp: apps/vscode/webview-ui/src/components/SoundSettingsModal.tsx :: short-viewport-no-scroll-path :: v2.10

**Dedup attestation:** Sound Settings height/viewport/scroll searches found no existing case. Bug 09 covers Action Menu, not this dialog.

**Fix sketch:** bound the dialog to available height and make the event region scrollable; keep the global switch reachable where possible.

**Fix accepted when:** a real packaged-VSIX case at a named short height can scroll to every selector and Preview. Add the case to `pnpm --filter kimi-code-kaif test:extension-host --version 1.123.0`. Today's real Chromium component observation is above; packaged-VSIX remains unobserved.

**Do not touch:** Off/global-Off editing, sound previews and current widths.

**Meta:** links bugs 09/26, HOUSE_RULES R2 and EXP-0018. UI skeptic rendered the real component and Tailwind CSS in headless Chromium at 500×300; audio functions were never called.
