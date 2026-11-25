# Test cases — K5 KIMI KRINIK 1.0.0 live acceptance

**Created:** 2026-11-24 · **Under test:** installed KIMI KRINIK 1.0.0 VSIX · **Version/build:** `kaif/no-auto-compaction` after `87c26cf13`
**Test basis:** `D:/work/ai_sandbox/KAIF/plans/147_EPIC_kimi_krinik_1_0_0.md` criteria 1–14 and `plans/153_epic147_K5_live_release.md` K5.0–K5.11; `bugs/01`–`03` acceptance lines; `GOAL.md` success criteria.

## 1. Goal vector

Maintain the official engine and accumulated user state while proving every visible control by a real user path. Avoid a release supported only by unit hygiene, a second persisted authority, replayed attention, lost follow-ups or hidden baseline failures.

## 2. Requirements under test

| # | Requirement (EARS sentence) | Fit criterion (Scale · Meter · Target) |
|---|---|---|
| R1 | WHEN the installed VSIX opens, the system shall activate the extension and its webview | Extension identity · real Extension Host log · version 1.0.0 and webview opened |
| R2 | WHEN a user clicks a visible control, the system shall execute its host/SDK action | DOM plus host/config/event evidence · CDP live path · zero decorative controls |
| R3 | WHEN live session events arrive, the system shall render current status/title values | Runtime values · event walk · no static counters |
| R4 | WHILE Auto Compact is ON, the system shall retain vanilla automatic compaction and dormant KAIF closure | Engine/hook state · live flip · vanilla path present |
| R5 | WHILE Auto Compact is OFF, the system shall prevent every automatic compaction and cancel an active one | Compaction count/cancel timing · live engine/wire · zero new automatic operations |
| R6 | WHEN threshold settings change, the system shall validate and project them without dropping marker fields | Four values · settings and marker diff · defaults 70/75/80/90 and unrelated fields retained |
| R7 | WHILE AUTO STEER changes, the system shall select immediate-steer or queue behavior | Ordered follow-ups and media · real running turn · ON immediate, OFF queued, rejection restores exactly once |
| R8 | WHEN language changes, the system shall rerender and persist English, 中文 or Русский | Visible strings and saved setting · live menu · all three observed |
| R9 | WHEN VS Code renders the extension, the system shall use its computed theme tokens | RGB and WebP · host/webview computed styles · sidebar/body equal and assets loaded |
| R10 | WHEN sound settings or events run, the system shall persist per-event sound/volume without replay or chat failure | Modal/audio calls · live user path · settings observed and replay silent |
| R11 | WHEN the VSIX is installed beside other extensions, the system shall remain self-contained and reversible | Isolated install/rollback · real VS Code · projects/sessions retained |
| R12 | WHEN live acceptance finishes, the system shall leave independently repeatable evidence | Judge rerun · claims and traces · no unverified DONE |
| R13 | WHEN the user opens Action Menu, the system shall display the extension version and its persisted build number | Visible support subtitle · real installed VSIX · `v1.0.0 (1)` for build 1, increasing by one per package invocation |
| R14 | WHEN the user opens and selects a skill in Control Panel, the system shall show localized two-line rows and use the ordinary queue-or-Steer path | EN/RU/ZH descriptions and fallbacks · one visible entry and one engine submission · real installed VSIX |

## 3. Coverage matrix — dimensions and holes

| Dimension | Values covered | Explicitly NOT covered (risk named) |
|---|---|---|
| Installation | real win32-x64 VSIX · fresh isolated profile | other OS/architectures — no matching host observed |
| Layout | activity-bar view → Second Side Bar · 299 px webview | editor-tab visual acceptance beyond smoke |
| Picker | open/close · filtered/stale/current states · three files | large repositories and media selection upload |
| Theme/assets | dark VS Code theme · robot/banner load states | light/high-contrast themes and owner's taste verdict |
| Account | fresh VS Code profile; initial manual CDP run inherited accumulated Kimi home and is being repeated with isolated Kimi/OS homes | controlled accumulated-account quotas and sessions still required; credential values are never inspected |
| Runtime races | none yet | accepted/rejected steer, in-flight compaction and restart are release-blocking |
| Localization/sound | none yet | live RU/ZH switch and owner listening remain open |
| Failure paths | network download failure and Electron environment reproduced | unavailable quota and audio rejection still open |

## 4. Cases

Statuses use `pass` · `fail` · `blocked` · `skipped`; `[NOT-TESTED]` means no live observation exists. Machinery: `apps/vscode/scripts/extension-host-smoke.mjs` for packaged startup; local CDP scripts under `.tmp/` for the actual installed webview, reading DOM/logs and WebP. Evidence index: `testcases/reports/2026-11-24_k5_live_acceptance.md`.

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| C01 smoke | Install VSIX → activate/open webview → identity/version/commands observed | use-case walk | pass · runs 4/7/11 |
| C02 attachment | Open picker → click attachment again → picker closed and trigger removed | state transition | pass · bugs/02 live DOM |
| C03 stale picker | Filter `alpha` → close/reopen empty → no alpha-only stale frame; current three files appear | timing/state | pass · filtered/immediate/next-frame DOM read |
| C04 Second Side Bar | Move View → New Secondary Side Bar Entry → KIMI KRINIK becomes ready | use-case walk | pass · WebP 04/05/06 |
| C05 computed theme | Read host auxiliary bar and webview body → equal RGB; read assets | observable proxy + visual | pass · both `rgb(25, 26, 27)`; WebP read |
| C06 header robot | Load original VSIX → broken dist image; install fixed VSIX → resources image and banner loaded | control + regression | pass · bugs/07 red/live/green |
| C07 multiline | Enter Shift+Enter text → bubble preserves line and idle/steer payloads retain exact newlines | boundary/use-case | pass · real bubble `pre-wrap`, exact fake-provider newline, WebP 10 |
| C08 quotas | Read 5h/7d/monthly and unavailable states on real account | equivalence/error | [NOT-TESTED] accumulated account |
| C09 AUTO STEER ON | Running Enter plus three ordered follow-ups → immediate, ordered, running→idle exactly once | race/state | fail · owner real-profile findings `bugs/11`–`13`; earlier isolated text-only run had three ordered responses and WebP 12 |
| C10 AUTO STEER OFF | Running Enter → text enters Queued without a second request; release dequeues it | decision/race | fail · owner reports no visible queue (`bugs/14`); isolated text-only runs show `1 Queued`/`1 в очереди` and WebP 11/34, but the owner's exact state/media/race is not reproduced |
| C11 Auto Compact ON/OFF | Flip live without new session; include before/after/overflow and active cancellation | state/boundary | [NOT-TESTED] active in-flight/overflow; real config OFF observed |
| C12 closure | Defaults 70/75/80/90 → full soft→force/farewell without apply_compaction | state/sequence | [NOT-TESTED] live closure |
| C13 composer controls | Permission, Plan, Goal, Swarm, secondary model, settings and send → real effects | use-case walk | pass · host calls/config and active-state DOM observed |
| C14 basic status | Working, Queued and context ring follow real events | event/state | pass · Working transitions, 1 Queued and 10.5/10.7% observed |
| C15 languages | Switch EN → RU → ZH → EN → immediate visible strings and persisted selection | state/pairwise | pass · visible dictionaries and `kimi.language` en observed |
| C16 sound preview | Open modal → change event sound/volume → preview → persisted and Web Audio lifecycle closes | use-case | pass · Chime 35%, peak 0.14, context closed; rapid 10→20→40→80→100 remains latest; global OFF blocks audio; Triple 880/660/990 observed; packaged glass.mp3 and localized event recordings resolved real playback; neutral tracks, no yellow outline |
| C17 B5/B6 | Decline/allow workspace voice command; machine setting wins; phrase cleanup/error logging observed | security/error | pass · native dialog Cancel/Allow via real mouse; no spawn/write on decline; machine priority without dialog; child PID 9028/39556 and cleaned phrase files; ENOENT logged |
| C18 rollback | Run beside official/reference → return to official → projects/sessions preserved | installation/state | [NOT-TESTED] owner accumulated profile |
| C19 rejected steer + media | Rejected running steer restores text+media exactly once; OFF queues media | race/media | fail · owner reports undelivered steering media and obsolete composer restoration (`bugs/12`–`14`); exact isolated rejection still open |
| C20 model effort + stop | Choose effort and stop a running request → persisted effort and aborted model request | state/cancel | [NOT-TESTED] live effort/stop |
| C21 extended status | Changed, Background Bash, Sub Agents, Todos and session title follow real events | event/state | [NOT-TESTED] tool/title events |
| C22 real-event sound/replay | Real approval/question/error/complete uses configured sound; replay stays silent | event/error | [NOT-TESTED] real event and replay; owner hearing separate |
| C23 Swarm OFF history | After ON→OFF, inspect reminder exit/reconcile semantics on the next prompt | state/contract | [NOT-TESTED] a judge request retained the historical enter reminder; this alone is not a proven defect and needs the engine contract check |
| C24 assistant response brand | Read a real assistant response → the pink KIMI KRINIK robot replaces the blue KIMI icon and loads from the packaged resources | use-case/assets | pass · regression red before/green after; packaged images load with naturalWidth 1024; response robot now matches Working at 24×16 without rounded; blue K absent; WebP 19 read |
| C25 responsive Control Panel | Restore reference sides and paperclip; wheel-scroll only on real overflow with fade; no wheel drift when all controls fit; pink dots/scroll button and blue Auto | state/boundary | pass · 319/640/1000 CSS px geometry and real wheel; no drift at 1000; paperclip/blue Auto/pink dots and scroll button; robot 24×16; WebP 21–24 |
| C26 Action menu and checked controls | Remove BEHAVIOR, vertical-scroll long menu, order EN→RU→ZH, open About, pink Switch/Checkbox and no yellow outline | use-case/accessibility | pass · scrollTop 0→200→160; About host ok=true; checked rgb(255,26,140); range outlineStyle none; WebP 23/25–27 |
| C27 build-number smoke | Open Action Menu on the pre-build VSIX, then on build 1 → old subtitle lacks a build number; new subtitle reads `v1.0.0 (1)` | control + use-case | pass · pre-build `v1.0.0`; build 1 `(1)` and final build 3 `(3)` read in the isolated VSIX |
| C28 language-dialog smoke | Click Language in Action Menu → separate dialog opens with the selected language first, then the other two choices; Action Menu shows all three action translations with the active one first | use-case/state | pass · build 3 EN `Language / Язык / 语言`, RU `Язык / Language / 语言`, ZH `语言 / Language / Язык`; DOM and WebP read |
| C29 Control Panel localization | Switch to 中文 and open Action Menu → `控制面板`; ZH/RU save-failure text uses the same localized name | use-case + twin sweep | pass · build 3 live ZH `控制面板`; ZH/RU toast assertions green |
| C30 skill picker rows | Open Skill → bold name on line one, regular description on line two, scrollable list | use-case/layout | pass (component) · real dialog classes and structure |
| C31 skill descriptions | Read EN/RU/ZH and missing metadata/key → EN uses base; RU/ZH use localized fields or base fallback | equivalence/fallback | pass (real parser + inventory + component) · nested YAML metadata read |
| C32 skill Steer ON | Select skill during a running turn → one visible entry and one immediate steer, no queue | state/delivery | pass (store/component) · `steerChat('/skill:review')`, zero queued items |
| C33 skill Steer OFF | Select skill during a running turn with AUTO STEER OFF → one queued `/skill:review`, no immediate steer | state/delivery | pass (store/component) · one queued item, zero steer calls |
| C34 skill visibility and VSIX | Toggle Skill visibility and run the packaged picker on the installed VSIX | persistence/install | [NOT-TESTED] packaged VSIX and accumulated profile; default is visible, hidden leaves skills available |

## 5. Control cases — MUST

| # | Control → expected: the behaviour is absent | Status + evidence |
|---|---|---|
| K1 | Original image path → robot fails to load; fixed resources path → loads | pass · bugs/07 before/after DOM and WebP |
| K2 | Filtered picker state differs from empty current state → stale-only frame would be detectable | pass · alpha-only vs three-file observations |
| K3 | Auto Compact OFF → no automatic starts, including in-flight cancellation | [NOT-TESTED] live; engine regression exists |
| K4 | AUTO STEER OFF → running message enters queue instead of immediate steer | pass · `1 Queued`, no second request before release, WebP 11 |
| K5 | Declined workspace voice command → no write/spawn | [NOT-TESTED] real dialog; handler regression exists |

## 6. Verdict

[NOT-TESTED] for the complete K5 feature set. C01–C07 and C13–C16 retain their scoped live passes. New owner-profile failures supersede the overall C09/C10 pass status: `bugs/11`–`15` cover immediate/lost steering, obsolete composer restoration, attachments/thumbnails, queue visibility and visible internal hook output. C19 also fails by owner observation; C08, C11–C12, C18 and C20–C23 remain open. Work is paused until the owner resumes it; no release or DONE inference is made.
