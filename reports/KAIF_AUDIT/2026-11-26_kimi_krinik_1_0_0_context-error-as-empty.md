# Audit 001 · Family: context inspection failure shown as empty

**Mechanism:** an explicit host failure is mapped to the same snapshot used for a genuine empty context.
**Already guarded by:** host `{ok:false}` behavior and successful UI loading; the UI failure branch is absent.
**Occurrences:** F1.

## F1 — Unavailable context appears as “No context yet”

**Quote:** `apps/vscode/webview-ui/src/components/ContextViewerDialog.tsx:34` — `setSnapshot(result.ok ? (result.snapshot ?? { tokenCount: 0, messages: [] }) : { tokenCount: 0, messages: [] });`.

**Failure scenario:** open Current Context without a live runtime. Host returns `{ok:false,snapshot:null}`; the dialog shows the empty state and no `context.loadFailed` feedback.

**Severity:** Attend — users cannot distinguish unavailable context from empty context; occurs whenever the host has no live runtime.

**Baseline:** new.

kaif-fp: apps/vscode/webview-ui/src/components/ContextViewerDialog.tsx :: context-failure-presented-as-empty :: v2.10

**Dedup attestation:** searches for ContextViewer/No context yet/context.loadFailed found the host fixture but no UI failure assertion or existing defect.

**Fix sketch:** branch on `!result.ok`, clear stale snapshot and show localized `context.loadFailed`; preserve `{ok:true,snapshot:null}` as genuine empty. Clear previous content when refresh begins so Copy all cannot use stale data while loading.

**Fix accepted when:** a UsageStatusBar case resolving `{ok:false,snapshot:null}` shows failure feedback and no “No context yet”. Run `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/usage-status-bar.test.tsx -t "reports an unavailable context"`. Today's real component probe produced `{noContextYet:true,failureToastCount:0,visibleFailureText:false}`.

**Do not touch:** successful snapshot mapping, the no-Compact ring contract and genuine empty contexts.

**Meta:** links root “Silent failure is worse than a crash”, release test plan and EXP-0015. UI skeptic ran the real component with only the bridge call stubbed; no packaged-VSIX claim.
