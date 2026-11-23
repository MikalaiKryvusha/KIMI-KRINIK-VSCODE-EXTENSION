# Third-party notices

## gxgleo67/kimi-code-vscode-fork

Source: https://github.com/gxgleo67/kimi-code-vscode-fork
Reference commit: `4298cb7f0cbe25afc147bd7b2aaca8ae39b71390`
License: Apache-2.0, matching the upstream Kimi Code license in `LICENSE.txt`.

The managed-quota mapping and concentric-ring presentation were adapted from this reference. The KAIF fork keeps only the managed 5-hour and 7-day/monthly quota path. It does not copy multi-account or custom-provider infrastructure, and it does not include the reference ContextRing click-to-compact action.

The automatic follow-up route uses the official `SteerChat` bridge. Its acknowledgement, turn-ended fallback, media preservation, composer rollback, ordering and recursion tests were written for this fork instead of copying the reference `steerNow` fallback, which drops attachments on one path and does not restore the composer on rejection.
