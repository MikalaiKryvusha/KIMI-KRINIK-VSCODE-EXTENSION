# Third-party notices

## gxgleo67/kimi-code-vscode-fork

Source: https://github.com/gxgleo67/kimi-code-vscode-fork
Reference commit: `4298cb7f0cbe25afc147bd7b2aaca8ae39b71390`
License: Apache-2.0, matching the upstream Kimi Code license in `LICENSE.txt`.

The managed-quota mapping and concentric-ring presentation were adapted from this reference. KIMI KRINIK intentionally keeps only the managed 5-hour and 7-day/monthly quota path. It does not copy multi-account or custom-provider infrastructure, and it does not include the reference ContextRing click-to-compact action.

The automatic follow-up route uses the official `SteerChat` bridge. Its acknowledgement, turn-ended fallback, media preservation, composer rollback, ordering and recursion tests were written for this fork instead of copying the reference `steerNow` fallback, which drops attachments on one path and does not restore the composer on rejection.

The combined model/effort picker, full model search, provider filters, keyboard navigation and starred-model presentation were adapted from the same reference. The implementation keeps the target store and media filtering, and uses one shared Zustand favorites state so the quick list updates as soon as a star changes.

The queued/changed/background/todo/compaction status panels were adapted from the reference `StatusPills`. Background tasks use the target SDK's `listBackgroundTasks()` without reference-only options, native polling with session-change cleanup, and a visible error state instead of silent task disappearance.
