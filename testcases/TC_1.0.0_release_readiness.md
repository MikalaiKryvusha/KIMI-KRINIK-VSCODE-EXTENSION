# Test plan — KIMI KRINIK 1.0.0 release readiness

**Created:** 2026-11-26 · **Under test:** KIMI KRINIK 1.0.0 VSIX (build 45; final package will be rebuilt after review fixes) · **Test basis:** `GOAL.md` success criteria 1–10, `plans/03_sticky_viewport_prompt.md`, `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`, `testcases/TC_K5_live_acceptance.md`, the `bugs/` history (regression-prone areas).
**Statuses:** `pass` = observed on a real run with evidence named · `partial` = some dimensions observed, others open · `[NOT-TESTED]` = no live observation yet · `blocked` = cannot run on this machine.

## 1. Goal vector

**Achieve.** An evidence-backed verdict that KIMI KRINIK 1.0.0 is ready to publish: every user-facing feature walks a real user path, and the failure paths degrade visibly instead of silently.

**Avoid.** A release on unit hygiene alone; silent data loss; a decorative control; a second persisted authority per setting; a sticky/queue/composer regression from the `bugs/` history returning.

## 2. Coverage dimensions

| Dimension | Covered | Explicitly not covered (risk) |
|---|---|---|
| Platforms | win32-x64 real install; universal + all six targets packaged/audited | real macOS/Linux install — no matching host here |
| Interface languages | EN/RU/ZH strings and component cases | full per-language UI walk of every dialog |
| Themes | dark VS Code theme | light/high-contrast themes |
| Runtime races | steer/queue/media races covered by component suites and isolated runs | owner's exact accumulated-profile race states (main-profile acceptance pending) |
| Accounts | testkit fake model on the isolated stand | real managed-account quotas and auth states |

## 3. Positive cases (main user paths)

| # | Case (steps → expected) | Status + evidence |
|---|---|---|
| P01 | Install the VSIX beside the official extension and KIMI FORK → activates, webview opens, projects/sessions retained | pass · builds 40/42 installed on main and isolated; `testcases/reports/2026-11-26_build_42_sticky_animation_subagent_chevron.md` |
| P02 | Send a prompt → optimistic bubble, streaming answer, one Working indicator, completion | pass · full suite 653/1 (chat store, event adapter, session runtime) |
| P03 | AUTO STEER ON: Enter during a turn → message joins the running turn immediately with its attachments | pass · suites + isolated build-33 held-steer evidence (`bugs/25`); main-profile observation pending |
| P04 | AUTO STEER OFF: Enter during a turn → message queues; the batch drains in order; a failed item restores at its original index | pass · suites (queue batch, drain, restore) |
| P05 | Auto Compact OFF → no automatic compaction, an active one is cancelled; manual `/compact` still works and is not cancelled | pass · engine loopControl tests (`packages/agent-core-v2` fullCompaction) |
| P06 | Context Window Control → threshold stages steer or start a fresh turn; KAIF hook stays dormant under KIMI KRINIK ownership | pass · `context-window-control` tests; `PROJECT_ARCHITECTURE_INTERNAL_MAP.md` flow 6 |
| P07 | Sticky: scroll a long chat → the sticky shows the prompt owning the visible turn; a visible prompt never duplicates into the sticky | pass · isolated build 40: visible «k40 final distinct prompt» never sticky, previous prompt shown; `bugs/37` |
| P08 | Sticky expand/collapse → full text+media in the existing viewer, scroll position preserved, per-prompt state | pass · component cases + isolated build-38 evidence |
| P09 | Sticky appearance/exit/replacements → smooth height/opacity transitions, no chat jump at the top | pass · isolated build 42: computed 61 → 0px over ~200ms; `bugs/41` |
| P10 | Sound settings: per-event sound and volume persist; preview plays; global Sound enabled mutes all | pass · `sound-settings-modal` suite + isolated build 40 |
| P11 | Sound event at «Выкл» → the section dims to 0.4 except the selector, which stays usable to re-enable | pass · isolated build 40 (opacity 0.4 vs 1, WebP 114) |
| P12 | Control Panel tooltips → «ВКЛ»/«ВЫКЛ» uppercase with a green/red tint in EN/RU/ZH | pass · isolated build 40 computed colors + WebP 118 |
| P13 | Subagent-model button → «Субагенты» in the large form, icon-only 24×24 in the compact form; the dialog selects/persists the secondary model | pass · isolated build 42 (both widths measured) + `saveConfig` assertions |
| P14 | Skill picker → localized rows, accepted inventory only, selection joins the turn (Steer ON) or the queue (OFF) | pass · isolated build 39 (42 accepted rows) + skill suites |
| P15 | General Settings → localized descriptions with separate ON/OFF lines in EN/RU/ZH; Control Panel visibility/order persists | pass · isolated build 39 + `control-panel-settings` suite |
| P16 | Language switch EN/RU/ZH → rerender and persist; every dictionary covers one key set | pass · i18n suite (one-key-set check) |
| P17 | Model + effort picker → combined selection, search, favorites; explicit MAX/XHigh persists per session | pass · model picker and settings suites |
| P18 | Attention sounds/voice per event → packaged MP3 by event+language; replay stays silent | pass · attention suites (EXP-0014 route) |
| P19 | Session header/status pills → live title, queue, background tasks, todos, compaction viewer | pass · status pills suites + isolated build-34 evidence |
| P20 | Media in chat and steering → image/video/media-only prompts, thumbnails, same viewer after replay | pass · isolated build-37 media/composer atomicity evidence |
| P21 | macOS install → the universal VSIX (no TargetPlatform) and the darwin-arm64/x64 packages install on VS Code on a MacBook | partial · universal + darwin packages built and statically audited (44 files, pure JS/WASM, no native binaries); a real Mac install is [NOT-TESTED] — no Mac host available |

## 4. Negative and boundary cases (failure and edge paths)

| # | Case (steps → expected) | Status + evidence |
|---|---|---|
| N01 | Provider connection unavailable at send → the prompt settles as failed with a visible error; unrelated turns stay intact | pass · extension-host test «settles the prompt as failed when the provider connection is unavailable»; `bugs/29` deterministic regressions (real VSIX preflight path pending) |
| N02 | Steer rejected by the host → the optimistic record restores text/media exactly once, no duplicate bubble | pass · chat store suites (`bugs/35` frame traces) |
| N03 | Empty prompt (only whitespace) → nothing is sent, no phantom turn | pass · composer input validation suites |
| N04 | Media-only prompt (no text) → sends with the «(media)» summary, no invented text | pass · chat-area media-only case |
| N05 | Very long multiline prompt → manual line breaks and blank lines reach the model unchanged | pass · multiline suites + `bugs/01` evidence |
| N06 | Narrow composer (<480px) → Control Panel labels hide, icons remain; subagent button stays a 24×24 square | pass · isolated build 42 measured both widths |
| N07 | Narrow chat with a one-line sticky prompt → no fade, no expand control, no collapsed ARIA state | pass · chat-area one-line cases (build 38) |
| N08 | Session replay → atomic application, no attention sounds, no live queue delivery, same prompt identities | pass · replay invariants in the chat store suites |
| N09 | Corrupt legacy approval state on session open → clear error surfaced, the migrated session still opens | pass · extension-host test «reports corrupt legacy approval state and still opens the migrated session» |
| N10 | Sound OFF for an event → the slider and preview disable, the selector stays enabled (no locked-out state) | pass · sound suite + isolated build 40 |
| N11 | Missing/invalid persisted Control Panel order → normalized without dropping buttons | pass · control panel order normalization suites |
| N12 | Older sessions resumed after the build upgrade → replay, approvals and turn identities keep working | pass · migration/resume extension-host tests |
| N13 | Restart mid-session → background task/queue state resumes without duplicate submissions | partial · covered by runtime suites; the owner's accumulated-profile restart path is [NOT-TESTED] here |
| N14 | Invalid sound choice injected into the config → the settings UI keeps working and does not crash | pass · `isSoundChoice` guards the select; invalid values are ignored |
| N15 | Sticky at `scrollTop = 0` → no sticky bar and no residual space after the exit animation | pass · isolated build 42 (unmount after the collapse) |
| N16 | Universal VSIX contains no TargetPlatform, no native binaries, no local paths or secrets | pass · `package:verify` audit (44 files; pure JS/WASM/SVG/PNG/MP3) |

## 5. Release-blocking open items

1. Main accumulated-profile acceptance of the current build (all `🔧 …main-profile acceptance pending` entries in `STATUS.md`): reload the owner's window onto the current build and walk the paths in §3 with real screenshots.
2. `bugs/29` real VSIX preflight path (deterministic regressions already green).
3. `bugs/11` steer delivery — parked with three isolated non-reproductions; observe on the main profile.
4. `bugs/34` refresh-marker investigation (owner-priority).
5. Real macOS install of the universal VSIX if a Mac host becomes available — P21 stays partial until then.

## 6. Evidence index

- `testcases/reports/2026-11-26_build_40_sound_sticky_control_panel.md` · `2026-11-26_build_42_sticky_animation_subagent_chevron.md` · earlier build reports in the same directory.
- Current build-45 run: `testcases/reports/2026-11-26_build_45_release_preparation.md`.
- Full extension suite after the final icon refinement: 656 passed / 1 skipped; `pnpm lint` and typecheck green; all six target VSIX audits + the universal audit green.
- Marketplace feasibility and publication gaps: `researches/58_vscode_marketplace_publication.md`.
