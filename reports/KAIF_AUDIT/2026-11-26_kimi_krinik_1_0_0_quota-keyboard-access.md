# Audit 001 · Family: quota details keyboard access

**Mechanism:** the tooltip trigger wraps a non-focusable span, so Radix's focus handlers never receive keyboard focus.
**Already guarded by:** hover behavior; no keyboard-focus case.
**Occurrences:** F1.

## F1 — Keyboard users cannot reveal quota percentages and reset times

**Quote:** `apps/vscode/webview-ui/src/components/UsageStatusBar.tsx:207` — `<span className="flex items-center" data-testid="quota-rings">`.

**Failure scenario:** Tab through the composer toward the rings. Focus skips the span and the only detail view never opens. Hover correctly shows both details, proving the missing keyboard route.

**Severity:** Attend — quota information is unavailable to keyboard-only users on every visit.

**Baseline:** new.

kaif-fp: apps/vscode/webview-ui/src/components/UsageStatusBar.tsx :: quota-tooltip-not-focusable :: v2.10

**Dedup attestation:** quota/keyboard/focus searches found no existing defect. The installed Radix trigger provides focus handlers but no tabIndex; existing tests are hover-only.

**Fix sketch:** use a focusable button with a localized accessible summary, or equivalent keyboard semantics without a fake action; retain Radix's existing focus-to-open behavior.

**Fix accepted when:** `user.tab()` focuses the quota trigger and reads both quota sections in `apps/vscode/test/webview/usage-status-bar.test.tsx -t "keyboard"`. Today's real component probe produced activeTag BODY and zero details after Tab, versus two details after hover.

**Do not touch:** polling, ring colors, the context-ring button and mouse hover.

**Meta:** links bugs/08 and EXP-0009. UI skeptic used the real Radix tooltip and userEvent.tab; no real-account or packaged-VSIX claim.
