# Research 53 — Control Panel parity and overflow contract

> **Created:** 2026-11-24
> **Parent:** `D:/work/ai_sandbox/KAIF/researches/52_kimi_krinik_ui_convergence.md` §3.1 · `D:/work/ai_sandbox/KAIF/plans/149_epic147_K1_ui_convergence.md` K1.6/K1.8 · `bugs/08_control_panel_overflow.md`
> **Status:** reference and target source inventory verified; live geometry and fix acceptance pending
> **Outbound:** implementation and regression checks in bug 08; live evidence in `testcases/TC_K5_live_acceptance.md`

## Sources

- Reference: `gxgleo67/kimi-code-vscode-fork@4298cb7f0cbe25afc147bd7b2aaca8ae39b71390`, Apache-2.0. Local read-only snapshot `D:/work/ai_sandbox/KAIF/scratchpad/kimi-reference`, composer row at `apps/vscode/webview-ui/src/components/inputarea/InputArea.tsx:455-504`.
- Target: `apps/vscode/webview-ui/src/components/inputarea/InputArea.tsx:382-425`.
- Owner decisions, 2026-11-24: the whole panel follows KIMI FORK, model selection belongs on the right; when controls overflow, the left group scrolls horizontally with the mouse wheel and disappears under a fade/backdrop beneath the right group.

## Parity inventory

| Element | Reference | Target before bug 08 | Required target |
|---|---|---|---|
| Attachment | left, before permission | right, before rings | move to the first position in the left scroll group; keep the existing picker fix |
| Permission | left | left | keep the current functional component |
| Compact / Steer / Control | K2 additions, absent from the pinned reference row | left after permission/model | retain on the left as K2 features; do not remove their real actions |
| Plan / Goal / Swarm / secondary model | left | left | retain in this order after the K2 controls |
| Context/quota rings | right | right | keep on the right |
| Model + effort | right, after rings | left, before permission | move to the right after rings and before settings |
| Settings | right | right | keep on the right |
| Stop / send | right | right | keep on the right and always clickable |
| Responsive labels | width observer, icon-only below 560 px | container-query label hiding | retain current labels; live check covers EN/RU/ZH separately |
| Extreme overflow | left group becomes `ComposerOverflowMenu` below 340 px | unclipped left content overlaps right controls | do not port the overflow menu: the owner explicitly chose wheel scrolling plus fade |
| Runtime behavior | reference components and stores | newer target picker, attention, retry, media and steering fixes | move layout only; preserve all current handlers and stores |

## Implementation boundary

The reference's `useElementWidth`, `COLLAPSE_*` constants and `ComposerOverflowMenu` are consciously not ported. Their purpose is a different responsive behavior, which the owner has replaced. The target change is limited to `InputArea.tsx` layout/scrolling and its existing webview tests; no host, SDK, engine, configuration or persisted-state contract changes.

The left scroll area must keep intrinsic content width and clip at its own flex boundary. The right group needs an opaque background beneath its controls and a left-pointing transparent-to-background fade above the scrolled content but outside the hit-testing path. Native non-passive wheel handling is required when preventing the parent chat from consuming the same vertical wheel event.
