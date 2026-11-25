# KIMI KRINIK — Project History (the chronicle)

> The APPEND-ONLY chronicle of how this project lived and grew: closed sessions, shipped phases,
> releases, big decisions in the order they happened. This is where `STATUS.md` sheds its past —
> STATUS stays a short live summary of NOW; everything finished moves HERE (the "bonsai trim" step
> of `/end-chat-soft`).
>
> **Not required reading.** This file is NOT part of `/resume`'s canon set and not in the
> before-every-task minimum — open it only when you actually need the archaeology: how a decision
> came to be, what an old phase contained, when something shipped.
>
> **Chronicle rules (ADR discipline):**
> - **Append-only, newest on top.** A recorded entry is never edited to say something else —
>   history that can be rewritten is not history. Corrections come as NEW entries that reference
>   and supersede the old one.
> - An entry moves here VERBATIM from `STATUS.md` when its work closes — move, don't rewrite;
>   the entry already carries its dates, counters and file pointers.
> - Entries mention versions and dates freely — a chronicle legitimately speaks of old versions,
>   and the update machinery's stale-claims scan knows to leave this file alone.
> - When the file grows unwieldy, split by era: keep the newest era here, move older ones to
>   `PROJECT_HISTORY_<era>.md` files, and leave a one-line index at the top of this file
>   (the pattern large changelogs use).
>
> Living document — never DONE-tagged.

---

## Entries (newest first)

### 2026-11-25 20:11 +03:00 — build 25 passes the owner-requested isolated UI acceptance
- Fixed welcome guide and centered robot/KIMI, localized Compact/Steer descriptions, `ideas/02` skill picker and `bugs/30`–`32` are implemented and verified on isolated packaged build 25. The skill dialog showed 47 rows; immediate skill delivery appeared once in the active model request, OFF showed `1 в очереди` with no queued skill in the request. Sticky was absent at `scrollTop = 0` and collapsed on wheel.
- Full extension: 621 passed / 1 skipped / 0 failed; typecheck and root lint green. `session-skills` is 14/14 after the old Windows path-comparison test was fixed in `bugs/33_DONE_skill_variant_windows_path_separator_test.md`.
- VSIX SHA-256 `5c493b98e4d56d4356315858aecee5573a05664ea2d4631d12f8fb0811ad9d04`. Build 25 is installed on the main profile with `buildNumber: 25` and exactly matching extension/webview hashes. Its running Extension Host has not been restarted, so accumulated-profile acceptance remains pending. Do not publish without separate owner `AUTH:`.
- Evidence: `testcases/reports/2026-11-25_build_25_ui_acceptance.md`, `.tmp/k5-vscode/85-build25-welcome.webp`, `.tmp/k5-vscode/87-build25-skill-dialog.webp`, `.tmp/k5-vscode/89-build25-skill-queue.webp`.

### 2026-11-25 18:10 +03:00 — owner confirms the remaining 1.0.0 UI scope
- [OWNER] «пусть наш экстеншен всегда в таком виде стартует. А слева от KIMI добавь нашего розового робота. Пару "РОБОТ KIMI" центрируй»: the empty-chat shortcut guide is always shown, with the pink robot beside KIMI.
- [OWNER] «Текста: Сжатие…», «Текста: Стиринг…»: use the supplied RU descriptions, including the corrected single «Вкл:» prefix, with EN/ZH equivalents.
- [OWNER] «кнопку навыков на панели управления я заказывал. Это делаем в 1.0.0!!!»: `ideas/02` is now active release work; the previous post-release deferral is revoked.

### 2026-11-25 17:16 +03:00 — build 22 fixes live chat rendering; main-profile restart pending
- [OWNER] «сразу как я тебе первое сообщение resume отправил - в полотне чата твоё какое-то сообщение появилось и мгновенно исчезло. Баг присутвтствует.», «опять ты высрал какой-то технический теккст в чат» (чат). `bugs/25` now also covers live Markdown remounts, and `bugs/15` covers the previously unverified live `hook.result` projection. Both are verified on isolated build 22, not yet on the restarted main profile.
- [OWNER] «давай время сообщений пользователя писать слева от них, вот тут», «а в стики сообщении вверху не делать пустое место на всю ширину пузыря только ради кнопки сворачинвания», «в стики пузыре нужно текст выше поднять, по оптическому центру тяжести чтобы вертикально текст был в пузыре выровнен» (чат). `plans/03` records and implements all three.
- Verification: component regressions red before and green after; full extension 610 passed / 1 skipped, typecheck and root lint green. Real VSIX control build 20 showed hook text; builds 21/22 kept it in model input but out of every observed UI snapshot. Build-22 DOM trace has no response removals; sticky geometry and WebP pass.
- Build 22 is installed on the main profile through direct VS Code CLI: manifest `buildNumber: 22`. [OWNER] «всё, давай, завершай, я иду в 22ю сборку, там продолжим» · 2026-11-25 17:38 +03:00 (чат). The next chat starts on that running build for accumulated-profile acceptance. Do not publish.
- Voice: the owner confirmed the direct Glass call sounded good. `HOUSE_RULES.md` R1 now explicitly forbids the generic beep/system-voice shortcut and records the pronunciation «Ви Эс Код»; the lesson is `EXPERIENCE.md` EXP-0017.

### 2026-11-25 16:08 +03:00 — SOFT CLOSURE: build 19 ready; owner authorization pending
- Done: `bugs/29` preflight ownership guard; `bugs/28` is DONE after the real 70% warning on the accumulated main profile; `plans/03` sticky prompt with animated chevron, expand/collapse, media and localized send time. Build 19 is the release candidate with the complete packaged changelog.
- Verification: full extension 607 passed / 1 skipped, typecheck and root lint green, six-target static/import verification passed. README covers all delivered differences in EN/RU/ZH. Main-profile 70% and 75% context warnings are observed. `bugs/11` is parked after three non-reproductions; no DONE claim.
- [OWNER] «вот это в ДИДМИ продукта зачем? ... ЗАЧЕМ МНЕ ЭТа ИНФОРМАЦИЯ? ... ✅ работает без KAIF», «вот это тоже нахуй все такое поудаляй из ридми · 🚧 приёмка на основном профиле» (чат). Removed KAIF badges/integration/credits and every 🚧 acceptance marker from README in all three languages. Product documentation now describes only KIMI KRINIK behavior.
- `release-notes/1.0.0/changelog.{en,ru,zh}.md` is ready with the neutral factual title `KIMI KRINIK 1.0.0`. Independent semantic review is resolved and voice/link checks are green.
- [OWNER] «разрешаю установить» · 2026-11-25 16:33 +03:00 (chat). Option B is selected: build-19 installation on the main profile is authorized; publication is not authorized. Install and verify the running build before any further acceptance.
- Process correction: the owner requires the newest fixed builds on his working profile by default, not only on isolated stands. This is now standing authorization in `HOUSE_RULES.md` R5; release publication remains separately gated.
- Closure debt: final Desktop E2E smoke passed 1/1 (`core-turn.spec.ts`, 46.3s), full extension 607/1, typecheck/lint/build and voice/link checks green. Final judge and final commit/push are recorded below after execution. The earlier force-closed README/judge debts were paid in this chat.
- [OWNER] challenged an unsupported multiline dash: the comparison cells now say `standard Markdown whitespace` instead of claiming the feature is absent. KAIF and all acceptance markers were removed by the owner's direct instruction. <!-- attribution-ok: pre-existing entry from HEAD; this change does not alter its claim -->

### 2026-11-25 12:32 +03:00 — sticky prompt re-prioritized; README scope review
- [OWNER] «прочти README репозитория этого проекта - КИМИ КРИНИК - все ли заявления мы сделали. и может мы сделали даже больше?», «липкое последнее сообщение нужно сделать» (чат). README claims are being compared with code and live-acceptance evidence. `plans/03_sticky_viewport_prompt.md` is implemented and verified on isolated packaged build 18; accumulated main-profile acceptance remains pending.
- Implementation anchor: one sticky prompt row above the transcript, visible-turn identity rather than newest-message identity, per-prompt expand/collapse with existing media rendering, EN/RU/ZH and isolated VSIX acceptance. Engine, bridge and outbound contracts stay unchanged.
- [OWNER] «и нужно будет обновить РИДМИ, и вести КИМИ КРИНИК 1.0.0 к релиу уже, а то три дня блять работаем над ним, затянулось это как-то», «и смотрю картинка робота кими у ридми старая - высокая. мы сделали его ниже» (чат). After sticky, update README including the already-accepted shorter robot asset and move into the final release contour; no new optional feature scope.
- Build 19 is the release candidate: sticky prompt, chevron animation and localized user-message time are verified on the isolated packaged VSIX. Full extension is 607 passed / 1 skipped, typecheck and root lint are green, six-target package verification passed. README covers the complete EN/RU/ZH difference table, independent semantic review is resolved, and all 28 local/external links open. Publication still requires separate owner `AUTH:`.
- `bugs/28` is DONE at 2026-11-25 13:50 +03:00: the accumulated main-profile build-14 wire recorded the 70% warning through `prompt.steered` at 625,186 / 891,289 tokens and a subsequent provider turn. This closes the real-world Context Window Control acceptance.
- `release-notes/1.0.0/changelog.{en,ru,zh}.md` is drafted with the build-19 delta, verification evidence and the remaining accumulated-profile caveat. Semantic review is resolved; no codename is assigned, so the neutral factual title is `KIMI KRINIK 1.0.0`.
- ❓ `interviews/interview_001_kimi_krinik_1_0_0_release.md` was shown and the owner was called: authorize build-19 main-profile installation and post-acceptance publication (A), installation only (B), or no installation (C). The background page later timed out with no answer recorded; the question remains in the owner queue and no release action is taken before the answer.
- [OWNER] «все, что реализовано, и чем мы выгодно отличаемся от официального экстеншена и от кими форк - все это можешь писать в ридми, там уже есть очень наглядная таблица для этого», «ну сообщения юзера А) справа, б) фон имеют другой» (чат). README's comparison table will cover all delivered differences; the sticky prompt uses a right-aligned user bubble with the distinct user-message background (`plans/03` AC9).
- [OWNER] «не нужна ему кнопка развернуть, если он в одну строку», «и всю верхнюю панель можешь в цвет сообщения юзера превращать, такого цвета - на всю ширину чата такой пузырь сообщени юзера вверху» (чат). Final sticky presentation: full-width rounded user-message bubble; Expand only for truncated, multiline or media prompts.
- [OWNER] «анимаций каких-то добавить», «кнопку свернуть развернуть можно было бы переиспользовать ту, которая есть в экстеншене в виде шевронов», «иди в интернет в разведку, как такое красиво сделать. И нужно время отправки пользовательских сообщений в чате» (чат). `researches/57_sticky_prompt_presentation.md` records the sources; use the existing chevron, reduced-motion-safe expansion and localized `HH:MM` in ordinary user bubbles.

### 2026-11-25 12:11 +03:00 — PARKED: difficult bug reproduction; deterministic high-value fixes first
- [OWNER] «давай не будем ловить сложновоспроизводимые баги, а будет чинить то, что однозначно понятно, как чинить», «и у тебя под руками код - его анализ может тебе показать, где есть баги однозначно», «давай в первую очередь делать и чинить то, что А) аонятно как делать или как чинить) Б) дает 80% пользы при 20% усилий» (чат). This applies the existing Pareto principle in `PHILOSOPHY.md:68-72`; no duplicate house rule is kept.
- Main-profile build 14 and Context Window Control ON are confirmed by the real Action Menu (`v1.0.0 (14)`), visible enabled control, setting and Extension Host activation. `bugs/11` received three isolated non-reproductions and is PARKED, not DONE: single steer, consecutive steers, running→idle and replay preserved assistant containers. Report: `testcases/reports/2026-11-25_steer_response_stability.md`.
- `bugs/29` is fixed at the store boundary: two ownership regressions were red before and green after, the genuine-current-send control stayed green; focused 31/31, full extension 601 passed / 1 skipped, typecheck and root lint are green. The real VSIX preflight path remains unobserved, so the bug stays 🔧 rather than DONE. Changeset and twin sweep are recorded.

### 2026-11-25 10:50 +03:00 — CLOSING to full-work build 14 and a fresh chat
- [OWNER] «давай билд 14 установим, и этот чат закроем с передачей дел в новый чат… я буду знать, что Контроль работает» · 2026-11-25 10:48 +03:00 (чат). This chat fixed and packaged the Context Window Control delivery defect, produced full-work build 14, verified it twice in isolated VS Code, and filed the test-debt false positive as KAIF #206. Build 14 is installed on the main profile: manifest `buildNumber: 14`, installed/source dist SHA-256 match. All merge conflicts are resolved in `main`; lint, typecheck and affected suites are green. Final Desktop E2E smoke was interrupted by the owner; Nix itself is unavailable and the workspace checker has a Windows path-separator false positive.
- [OWNER] «ты только что писал ответ, а затем он исчез - похоже на баг», «вероятно, стиринг сообщения пользователя могут как-то "ломать" ответы КИМИ в чате» · 2026-11-25 10:48 +03:00 (чат). Recorded in `bugs/11`: assistant-entry stability after steering is now an explicit acceptance requirement; cause is unproven. Next chat must compare DOM removals with steer/turn/replay events before editing the store.
- KNOWLEDGE: the fixed control delivery path is `session.steer()` in `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`; adapter-boundary lesson is `EXPERIENCE.md` EXP-0015; the new steering symptom is in `bugs/11`; full run evidence is `testcases/reports/2026-11-25_context_window_steer_delivery.md`; old completed 04:27–05:09 entries moved verbatim to `PROJECT_HISTORY.md`.
- ⚠️ Force-closed 2026-11-25 11:32 +03:00: ceremonies skipped (final Desktop E2E smoke, final judge, README/showcase refresh) — the first /skill:end-chat-soft pays this debt.
- Standing falsehood: commit `e1b5b2e2f` was pushed to `kaif/no-auto-compaction` contrary to the recorded main-only rule → corrected by merging it into `main`; the permanent never-use/feature-name rule is now recorded in `AGENT_GUIDE.md` with the owner's verbatim order.

### 2026-11-25 10:25 +03:00 — owner ordered full-work build 14; packaged and live-verified
- [OWNER] «Собери билд 14 СО ВСЕМИ НАРАБОТКАМИ ЗА ВЧЕРА и С СЕГОДНЯШНИМ ФИКСОМ КОНТРОЛЯ!!!!» · 2026-11-25 10:18 +03:00 (чат). Build 14 contains all current main-tree work through post-build-19 plus the bug-28 `session.steer()` fix; it supersedes minimal build 13 as the recommended artifact.
- Six-target VSIX static audit, 598 passed / 1 skipped, typecheck and root lint are green. Fresh isolated VS Code installed manifest 14 and delivered the 80% soft-closure prompt at 84% through the real active-turn provider path, with no controller errors. Artifact: `apps/vscode/artifacts/vsix/kimi-code-win32-x64-build14.vsix`; SHA-256 `a0813b1072b2e90e671438675877ad0a21d40769b7af8bfef3a6f00ca4c8e3cc`. Report updated: `testcases/reports/2026-11-25_context_window_steer_delivery.md`.
- The main profile is still on build 12 and has not been modified. Next acceptance is build 14 installation, a full VS Code restart and a fresh chat; `bugs/28` stays 🔧 until that accumulated-profile observation.
- Follow-up runs at 10:32–10:38 repeated extension 598 / compaction 123 / OAuth 44 and the build-14 functional path, all green. `test-after-code` still falsely reported 162 files as not run because its direct-interpreter heuristic does not recognize Vitest; `bugs/KAIF/05` / upstream #206 filed with `cleared: []` reproduction. At 10:46 the hook's own waiver recorded that direct standalone execution is invalid for these TS/Vitest modules and historical scratch harnesses; `test debt: none`. No manual state edit.

### 2026-11-25 10:07 +03:00 — bug 28 fixed on isolated build 13; main profile still on build 12
- [OWNER] «Я нашел тебя утром с на 100% щзаполненным окном контекста чата.... Не сработала фича контроля. Баг в core функционале.» · 2026-11-25 09:28 +03:00 (чат). The real wire had no control prompt: build 12 called the skills-only API with an empty skill list, which the engine rejects. KAIF was intentionally dormant under built-in ownership, not a second active guard.
- The runtime now uses public `session.steer()`. Both regressions were red before and green after; main has 598 passed / 1 skipped, typecheck and lint green. Packaged builds 20 and 13 each delivered the 80% soft-closure prompt at 84% through a real active-turn provider request in isolated VS Code. Report: `testcases/reports/2026-11-25_context_window_steer_delivery.md`.
- Owner-requested minimal artifact: `apps/vscode/artifacts/vsix/kimi-code-win32-x64-build13.vsix` = build 12 + only this fix and build number 13; SHA-256 `7610a4c6d2251a272046f3cb4036ed58a4e5e15fa401a0e2c9a428a5e67abbb1`. It is not installed on the main profile; the current loaded build 12 remains unprotected until a full VS Code restart with the fixed VSIX.
- Build-13 caveats: its inherited build-12 `usage-status-bar` assertion remains red (587 passed, 1 skipped, 1 failed), and its nested-worktree lint stops only at `jsPlugins` ordering after clean oxlint. No unrelated source, test or baseline was changed. `bugs/28` stays 🔧 pending accumulated main-profile acceptance.

### 2026-11-25 05:15 +03:00 — held first prompt also stable on build 19
- A delayed first prompt produced no assistant removals and final `K23 multiline response` remained visible; `.tmp/k5-vscode/60-k25-delayed-first.webp` was read. Original main-profile variant remains the only unobserved path, so `bugs/25` stays 🔧.

### 2026-11-25 04:18 +03:00 — full isolated media matrix passes
- ON image-only delivered one PNG with zero text; OFF video-only queued and delivered one MP4 with zero text. Thumbnail/viewer and replayed video use identical URIs. `bugs/13` and `bugs/14` now have image/video, text+media and media-only evidence.
- Only accumulated main-profile acceptance remains for both. Report: `testcases/reports/2026-11-25_media_only_video.md`.

### 2026-11-25 04:08 +03:00 — isolated PNG delivery closed for ON/OFF queue and replay
- `bugs/13`: ON steering raw request carried exactly one PNG; thumbnail/viewer matched before and after replay. `bugs/14`: OFF immediately showed text + «+ медиа» and dequeue carried exactly one PNG. Replay restored two entries/two thumbnails for two sends.
- Video-only and accumulated main-profile paths remain unverified; both bugs stay 🔧. Report: `testcases/reports/2026-11-25_media_queue_steer.md`.

### 2026-11-25 03:58 +03:00 — status correction: isolated evidence is not main-profile DONE
- Corrected premature DONE tags for `bugs/16`, `bugs/18` and `bugs/19`; all three are 🔧 isolated-verified with their original main-profile paths pending. Their scoped run reports remain valid, while completion claims and filenames were corrected everywhere they stood.
- `bugs/23` stays DONE as a research-only payload-integrity question; `bugs/05` stays DONE as a harness defect. Production chat fixes require the accumulated-profile acceptance boundary.

### 2026-11-25 03:51 +03:00 — active-response user sends verified on isolated build 19; main profile pending
- 106 runtime/settings/chat-store contracts pass. Current isolated ON steering, OFF queue/dequeue and running→idle batch paths show no `Internal error occurred.`; direct invalid reentrant prompt remains guarded and the first turn continues.
- Historical owner log is preserved in `bugs/18_reentrant_prompt_internal_error.md`; official extension unchanged. Report: `testcases/reports/2026-11-25_reentrant_send_contract.md`.

### 2026-11-25 03:45 +03:00 — Windows compaction harness repaired; bugs/05 DONE
- `bugs/04`: real Windows temp paths now select win32 path mapping and host-native expected resolution; cwd/listing case passes. Linux row remains unrun because WSL is not installed and Docker is unavailable, so bug 04 stays open.
- `bugs/05`: both hooks were already invoked; unquoted Node path under Program Files emptied the logger output. Quoting executable/script produced ordered PreCompact/PostCompact payloads. DONE.
- Full compaction 123/123, agent-core typecheck and root lint green. No production source changed. Report: `testcases/reports/2026-11-25_windows_compaction_harness.md`.

### 2026-11-25 03:26 +03:00 — steering avatar/user order verified on isolated build 19; main profile pending
- Immediate, two-consecutive and replayed steering on isolated build 19 preserve base → steer one → steer two → assistant response. Clean replay offsets were 14/61/71/87 with no avatar inversion, error or Retry; three WebP frames were read.
- Report: `testcases/reports/2026-11-25_steer_avatar_order.md`. Current lifecycle already had the fix; no product change was needed.

### 2026-11-25 03:11 +03:00 — tool-card Working state verified on isolated build 19; main profile pending
- Isolated build 19 showed «Работаю…» below ReadFile while the next model step was held, within visible bounds. It disappeared on genuine completion and stayed absent after history replay. No additional product change was needed.
- Report: `testcases/reports/2026-11-25_tool_working_build_19.md`. Two-client replay remains in the broader lifecycle matrix.

### 2026-11-25 02:58 +03:00 — multiline queue/Steer integrity confirmed; bugs/23 DONE
- Exact owner sample passed AUTO STEER OFF queue/dequeue and ON running-turn Steer on isolated build 19. Both provider bodies matched the UTF-8 source including the blank line; final bubbles retained it. Only the intentional queue preview is compact; no product change was needed.
- Report: `testcases/reports/2026-11-25_multiline_queue_steer.md`. `ideas/01` was also tagged DONE in this backlog revision; other partial bugs remain open.

### 2026-11-25 02:37 +03:00 — extension suite and root lint fully green
- Corrected the `usage-status-bar` test to read the actual separator wrapper rather than the label's immediate parent; product behavior was already correct.
- Full extension: 48 files, 597 passed, 1 skipped, 0 failed. `pnpm lint` exits 0. Historical reports retain their earlier counts/failures; current state has no accepted test failure.

### 2026-11-25 02:29 +03:00 — deleted non-KAIF skill references cleaned; root lint green
- Removed repository-workflow references to deleted `write-tui`, `gen-docs`, `gen-changesets`, `review-pr`, `sync-changelog` and local `use-kimi-code` artifacts from AGENTS/PR/docs paths. Other-agent guides now point to the running KAP guide instead of an installed skill.
- Kept public engine documentation for generic `~/.agents/skills` directories: that is supported product behavior, not a deleted repository-owned skill.
- `pnpm lint` exits 0 (12 AGENTS files, 173 references resolve); `pnpm run build` in `docs/` completes for EN/ZH. No generated docs output entered the diff.

### 2026-11-25 02:14 +03:00 — replay flicker reproduced and fixed on isolated build 19
- `bugs/25`: build-18 session replay showed one zero-assistant/response-absent frame (~21 ms). Reset, history events and completion marking now use one state transaction; live attention/queue wrappers do not run for replay.
- Regression was red before the fix; 65 affected checks, typecheck and VSIX audit pass. Build-19 real history navigation stayed at one assistant container on every frame and ended with the restored response. Original main-profile first-prompt route remains open; isolated instant first prompt did not reproduce it.
- Report: `testcases/reports/2026-11-25_atomic_replay_build_19.md`. NEXT: non-KAIF reference cleanup/root lint, then the known usage selector; main-profile acceptance of builds 17–19 remains pending.

### 2026-11-25 01:43 +03:00 — owner UI findings verified on isolated build 18
- Context ring interpolates blue→yellow at 60–70% and yellow→red-orange at 70–80%, retaining endpoints outside the range. Exact 60/65/70/75/80% checks pass; the live low-usage ring is blue.
- `bugs/26`: sound selector stays editable with per-event Off and global Sound OFF. Live RU cycle Off → Glass re-enabled volume; main-profile acceptance pending.
- `bugs/27`: explicit MAX/XHigh choices now persist above the model's delivered default. Isolated MAX survived a full VS Code restart, compact RU showed МАКС, the menu showed full words, and the real request body carried `thinking.effort="max"`. EN/RU/ZH label cases pass; main-profile acceptance pending.
- Queue addition now runs one pulse/one second; the real build-18 DOM exposes one animation iteration. Full suite 595 passed, 1 skipped, 1 pre-existing usage selector failure; root lint reaches only the documented dead docs reference. Report: `testcases/reports/2026-11-25_ui_controls_build_18.md`.
- NEXT: owner-flagged `bugs/25` first-prompt feed flicker, then the documented non-KAIF reference cleanup so root lint can exit 0. Builds 17–18 remain isolated; main profile remains build 12.


### 2026-11-25 00:41 +03:00 — whole-batch queue steering verified on isolated build 17
- [OWNER] «юзер мог накидать в очередь большую пачку сообщеений, болье двух. И ожидаемое поведение при появляении окна - ВСЕ они улетают в запросы в этом окне» · 2026-11-25 00:05 +03:00 (чат). `bugs/20` now guards stale terminal ordering, host-accepted `QueueBatchReady`, sequential steering of the remainder and failure restoration.
- Fresh-process isolated build 17 passed the real OFF three-item queue path: one lightning selected the first item, then all three reached one active model request in order; final UI has four user bubbles including the base prompt, one assistant response, empty queue and no error. Main-profile build-17 acceptance is still pending; the owner's current main installation remains build 12.
- Hygiene: 121 affected checks, typecheck and VSIX audit pass; full suite 589 passed, 1 skipped, 1 pre-existing `usage-status-bar` selector failure. Root lint passes code checks and stops only on the previously documented deleted non-KAIF skill link in `docs/AGENTS.md`. Report: `testcases/reports/2026-11-25_queue_batch_build_17.md`.
- NEXT: implement the owner-approved context-ring interpolation (blue through 60%, blue→yellow 60–70%, yellow→red-orange 70–80%, then constant red-orange) and one queue-button pulse instead of three; then return to `bugs/25` first-prompt feed flicker.


### 2026-11-24 23:39 +03:00 — FORCE-CLOSED by owner; build 12 installed, non-KAIF skill removal is mid-flight
- Build 12 is packaged and installed on the main-profile disk; source/installed dist SHA-256 values match. The main process still needs a full restart before real-profile acceptance.
- 2026-11-24 23:54 +03:00 — [OWNER] reproduced twice on main-profile build 12: with AUTO STEER OFF and two queued messages, one lightning activation on the first submitted both. `bugs/20` is OPEN again; this real-path failure takes priority over the context-ring color change, which is parked after only a test-import edit.
- 2026-11-24 23:50 +03:00 — [OWNER] «сборка 12 вроде работает стабильнее по чату», «тебе быстро мои стиринг сообщения доходят» (чат). Recorded as positive main-profile steering evidence in `bugs/11` and `bugs/22`; the remaining acceptance matrix stays open. The owner also reported a first-prompt chat-feed flash and disappearing assistant message, filed as `bugs/25_first_prompt_assistant_message_flicker.md`.
- Owner ordered all non-KAIF skills removed. `.agents/skills/` and `skills/use-kimi-code/` are deleted; stale AGENTS/PR/docs workflow references were cleaned on 2026-11-25 and `pnpm lint` now exits 0. Generic user-level `.agents/skills` documentation remains because the engine supports those directories.
- NEXT FIRST: main-profile acceptance of the current isolated fixes; the separate `usage-status-bar` selector remains the last known full-suite failure. Do not start the later ideas before this integrity cut.
- Standing falsehood: apparent build 4–6 live failures were invalid because the isolated process stayed at PID 44644 → corrected in `bugs/20_queue_steer_duplicate_submission.md` and the fresh-process report. No uncorrected artifact is known.
- KNOWLEDGE: the final build and acceptance limits are in this file and `testcases/reports/2026-11-24_chat_lifecycle_audio_build_12.md`; the CDP process lesson is `EXPERIENCE.md` EXP-0011; later owner-approved work is `ideas/02_control_panel_skill_picker.md` and `ideas/03_extension_general_settings.md`; root `AGENTS.md` English translation and nonblocking-subagent research remain recorded below.

## Where we are now

The extension builds and typecheck is green; the latest full extension run has 607 passed, 1 skipped and 0 failures. The 1.0.0 scope, phases and
acceptance live in the KAIF origin repository: `D:/work/ai_sandbox/KAIF/plans/147_EPIC_kimi_krinik_1_0_0.md` and `plans/148`–`154`.
Routine pushes of this branch go under the standing authorization of `AGENT_GUIDE.md` → Git workflow; a release, a rename and any
external publication wait for the owner's `AUTH:`.

| Phase | State | Note |
|---|---|---|
| K0 baseline and contracts | 🔧 in progress | KAIF deployed; inventory and red tests for K1–K4 left |
| K1 UI convergence | ✅ hygiene | Control Panel, Working, secondary-model robot, combined picker, status pills and session header are committed and full-suite green; live Extension Host acceptance is in K5 |
| K2 behavior controls | ✅ hygiene | independent Context Window Control, KAIF handoff and in-flight Auto Compact OFF cancellation are committed and verified; live flip acceptance is in K5 |
| K3 localization and theme | ✅ hygiene | three languages and the theme tokens; live acceptance in K5 |
| K4 sound settings | ✅ hygiene | the window, B8 terminal guard and B5/B6 command/temp-file safety are verified; live sound acceptance is in K5 |
| K5 live acceptance and release | 🔧 main-profile restart pending | build 12 is installed on disk; corrected lifecycle/audio/UI paths have isolated evidence, but real-profile acceptance and publication remain open; publishing only on the owner's `AUTH:` |
| K6 README | 🔧 started | the new pink robot is in EN/RU/ZH README; feature tables still contain 🚧 rows that must close before release |

Verification commands (root `AGENTS.md`): `pnpm lint` · `pnpm --filter kimi-code-kaif run typecheck` ·
`pnpm exec vitest run --reporter=agent apps/vscode/test`. Last full run (2026-11-25 10:20 +03:00, Windows): 598 passed, 1 skipped, 0 failures; root lint, typecheck and build-14 package/static audit green. K2.6 has 2/2 mid-flight scenarios and agent-core typecheck green. The full engine compaction file is 123/123 on Windows; `bugs/05` is DONE and `bugs/04` awaits only its unrun Linux row. Current context-window evidence is in `testcases/reports/2026-11-25_context_window_steer_delivery.md`; experience, attribution, testrun and KAIF budget checks are green.
A red test here is a signal again — there is no accepted baseline of failures.

## 🤖 Autonomous backlog pool (no human / no special hardware needed)



## ❓ Awaiting human review (interviews / homework)

- ❓ `GOAL.md` was assembled from the owner's recorded words (`researches/52` §1); the owner confirms it.
- ❓ B9: one changelog mechanism (changesets or the hand-written `CHANGELOG.md`) and the `major` level.
- ❓ B10: the settings namespace `kimi.*` shared with the official extension.

## Where to continue next session

CURRENT: `bugs/29` has a verified store ownership guard and is ready to commit; its real VSIX preflight path remains open. `bugs/11` is parked by the owner's explicit Pareto direction after three non-reproductions; resume it only with new deterministic evidence, not more blind live hunting. `bugs/28` is DONE after the accumulated main-profile 70% warning at 13:50. Next resume clear ON/OFF queue, duplicate, composer, media and hook-output acceptance of `bugs/12`, `bugs/13`, `bugs/15`, `bugs/20`, `bugs/22` and `bugs/24`. Main source has 607 passed / 1 skipped and root lint green; two-client replay, original first-prompt `bugs/25`, broader lifecycle matrix and release/publication remain later work. No release/publication without separate owner `AUTH:`.

Standing falsehood: the claims that builds 4–6 had failed live were false because the old isolated process never restarted → corrected in `bugs/20_queue_steer_duplicate_submission.md` and the fresh-process result in `testcases/reports/2026-11-24_chat_lifecycle_audio_build_12.md`.

KNOWLEDGE: the outbound result/queue lifecycle and packaged-audio flow live in `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`; the CDP process-identity lesson is `EXPERIENCE.md` EXP-0011; all three voice languages and the current sound contract are in `GOAL.md` criterion 7 and `bugs/17_DONE_attention_voice_missing_identity.md`; the complete evidence index is `testcases/reports/2026-11-24_chat_lifecycle_audio_build_12.md`.

1. Fully restart the main VS Code process, then read `v1.0.0 (11)` in Action Menu and confirm the current UI is actually loaded.
2. Repeat ON/OFF Enter, two-item queue/lightning, composer-clearing, media thumbnail/viewer and resumed-hook-output checks. Use `testcases/reports/2026-11-24_chat_lifecycle_audio_build_12.md` for the observed baseline and exact limitations.
3. Keep `bugs/12`, `bugs/13`, `bugs/15`, `bugs/20`, `bugs/22` and `bugs/24` open until those real-profile observations. Fix the separate `usage-status-bar` selector without claiming the current full suite was green.
4. Take the sticky-last-message feature as the next separate task after acceptance. Two-client replay, `bugs/16`, `bugs/18`, `bugs/23` and the remaining K5 matrix stay explicit follow-ups.
5. After KIMI KRINIK 1.0.0 is completed and released, implement the owner-approved `ideas/02_control_panel_skill_picker.md`; keep the KAIF translation work in its linked upstream idea 39.
6. ✅ Root `AGENTS.md` is fully translated into English without changing any rule or engineering contract; the owner does not want Chinese-language legacy in the project's working documents. Completed on 2026-11-25 with lint green at 22986/23200 bytes.
7. Owner question answered: native VS Code General Settings follow the VS Code display language (`package.nls*.json`), not the extension's own language. Implement the owner-approved `ideas/03_extension_general_settings.md` as the next development cut: the extension-owned screen follows `kimi.language`, settings keep one owning screen, and Context Window Control plus thresholds move out of Control Panel settings.
8. ✅ Nonblocking subagents researched and recorded in `researches/56_nonblocking_subagents.md`: background `Agent` is supported; `AgentSwarm` is parallel-but-blocking; nested tasks/task-management/notification boundaries are explicit.

Pre-existing untracked paths are `.kaif/kimi-refresh.json`, `Claude_Help_for_Kimi.md` and `KIMI CODE LOGO/GPT ROBOT REFERENCES/`; do not sweep them into a commit.

## Approved features

- ✅ `ideas/01_DONE_language_selection_modal.md` — one Language button and selected-first dialog implemented, changeset recorded and EN/RU/ZH VSIX acceptance passed; tagged DONE on 2026-11-25.
  [OWNER] «настройку языка делаем кнопкой, выбор языка переносим в окно, итого целая большая секция из меню сжимается до одной кнопки» · 2026-11-24 (чат)
- ✅ `ideas/02_control_panel_skill_picker.md` — owner approved a scrollable skill picker with bold name / normal description, existing queue/Steer routing and localized metadata fallback. Deliberately deferred until KIMI KRINIK 1.0.0 is completed and released; KAIF translations remain in the linked upstream idea 39.
- ✅ `ideas/03_extension_general_settings.md` — owner approved an extension-localized General Settings page with no duplicate owners; Context Window Control and thresholds move there from Control Panel. Planned for the next development cut, not started during closure.
## Open bugs

- 🔧 `bugs/29_preflight_error_deletes_unrelated_history.md` — ownership guard and deterministic regressions pass; real VSIX preflight path pending.
- ✅ `bugs/28_DONE_context_window_control_empty_skills_rejected.md` — real SDK and isolated 80%/84% delivery, then accumulated main-profile 70% `prompt.steered` at 13:50.
- 🔧 `bugs/19_tool_cards_hide_working_state.md` — active/completion/replay pass on isolated build 19; original main-profile path pending.
- 🔧 `bugs/18_reentrant_prompt_internal_error.md` — ON/OFF/fallback contracts and isolated paths pass; original main-profile path pending.
- 🔧 `bugs/16_steer_avatar_precedes_user_bubble.md` — immediate/consecutive/replay order passes on isolated build 19; original main-profile path pending.

- 🔧 `bugs/27_effort_persistence_and_localization.md` — isolated build-18 restart/wire/labels pass; main-profile acceptance pending.
- 🔧 `bugs/26_sound_off_disables_dropdown.md` — isolated build-18 Off → Glass pass; main-profile acceptance pending.
- 🔧 `bugs/25_first_prompt_assistant_message_flicker.md` — replay flash reproduced/fixed on isolated build 19; original main-profile first-prompt variant remains unverified.
- 🔧 `bugs/22_first_send_stuck_in_steering_queue.md` — exactly-once/result contracts implemented; main-profile build-12 acceptance pending.
- 🔧 `bugs/24_glass_preview_silent.md` — real packaged MP3 playback passed in isolation; main-profile build-12 acceptance pending.
- 🔧 `bugs/20_queue_steer_duplicate_submission.md` — whole-batch delivery verified on fresh isolated build 17; main-profile acceptance pending.
- 🔴 `bugs/11_steer_delivery_and_immediate_display.md` — steering bubbles wait for acknowledgement and some sends are lost at a state transition; owner now also reports an assistant answer disappearing after steering on 2026-11-25. Reproduce first in the fresh build-14 chat.
- 🔧 `bugs/12_steer_composer_restores_previous_text.md` — stale/latest composer contracts fixed; main-profile build-12 acceptance pending.
- 🔧 `bugs/13_steer_attachments_and_thumbnails.md` — isolated build-19 full image/video and media-only delivery/viewer/replay pass; main-profile acceptance pending.
- 🔧 `bugs/14_steer_queue_not_added.md` — isolated text+image/video and media-only immediate queue/dequeue/replay passes; main-profile acceptance pending.
- 🔧 `bugs/15_hook_results_visible_in_chat.md` — replay hook rendering fixed; main-profile build-12 confirmation pending.
- 🔧 `bugs/04_frozen_prompt_windows_path.md` — Windows harness fixed and full file 123/123; Linux CI row remains unrun (WSL not installed, Docker unavailable).
- 🔧 `bugs/KAIF/04` / upstream #204 — local dormant-state diagnostic fix is red-to-green and live activation is observed; keep open until an origin update absorbs it.
- 🔧 `bugs/KAIF/05` / upstream #206 — Vitest runs pass but the default test-after-code heuristic returns `cleared: []` and falsely preserves debt; evidence and upstream report filed. The hook's documented waiver now records why direct standalone execution is invalid here; status is `test debt: none`, with no manual state edit.
- 🔴 `bugs/152` (KAIF origin) — the extension can stay on «Starting Kimi Code…»; not reproduced; check B10 when it recurs.
- 🟠 `bugs/151` (KAIF origin) — follow-up steer race; store-level fixes in place, live acceptance left.

Автономный дневной цикл начат 2026-11-24 03:39 +03:00 и завершён мягким закрытием по измеренной границе контекста 2026-11-24 07:32 +03:00. Вопросы владельцу не отправлялись; релиз не публиковался. `[OWNER] «Работай автономно в дневном цикле … На всё ДА, РАЗРЕШАЮ», «закроешь, не сейчас, а когда чат переполниматься» · 2026-11-24 03:39 +03:00 (чат)`


### 2026-11-25 05:09 +03:00 — bugs/156 multiplexer deployed and field report delivered
- `kimi-stop.mjs` is deployed. Source/dist selftests, M1–M5, fresh build (196 blocks/846 modules), s14 multiplexer assertions, deployed manifest (114 files + 38 artifacts) and root lint are green; `update-verify` passed.
- `npm run test:core` still has unrelated S9 #146 and two context-window failures. No live owner Stop continuation ran, so bug 156 remains 🔧 rather than DONE.
- Field report delivered: https://github.com/MikalaiKryvusha/KAIF/issues/205.

### 2026-11-25 04:45 +03:00 — B12 complete: planName and side panel/editor backgrounds
- Managed userLevelName reaches `usage.planName` through the public auth facade; optional user-info failure does not hide real quota failures.
- Real side panel and New Tab both compute `rgb(25, 26, 27)`; editor containers are transparent over the same body background, so no sideBar/editor mismatch was reproduced. WebP read.
- B5–B8/B11 and B12 are complete; B9/B10 remain owner decisions. Report: `testcases/reports/2026-11-25_b12_backgrounds.md`.

### 2026-11-25 04:39 +03:00 — managed plan names reach the usage tooltip
- `KimiAuthFacade` now exposes the toolkit's managed user-info path with the same runtime auth resolution as quota. The extension fills `planName` from `userLevelName`; user-info failure is optional and does not hide quota data or its real errors.
- Affected handler tests, SDK/extension typechecks and full suite 597 passed, 1 skipped, 0 failed; root lint 0. B12 editor-background verification remains separate; B9/B10 stay with the owner.

### 2026-11-25 04:30 +03:00 — nonblocking subagent boundary confirmed
- Official docs and local contracts prove `Agent(run_in_background=true)` returns a task ID immediately, supports concurrent background subagents and delivers results automatically. `AgentSwarm` runs concurrently but waits for its aggregated report, so it is parallel-but-blocking, not nonblocking.
- Nested tasks must settle, task-management tools are required, and completion arrives as a notification/steered turn. No live subagent was launched because the project forbids unauthorized launches. Evidence: `researches/56_nonblocking_subagents.md`.

### 2026-11-25 04:27 +03:00 — root AGENTS.md translated to English without rule changes
- Translated all project principles, maps, verification, testing, workflow and review contracts into English; no Han-script prose remains. Condensed wording only to satisfy the existing size guard, without raising the limit.
- `pnpm lint` exits 0: root `AGENTS.md` is 22986/23200 bytes and all 174 references resolve. Full extension suite remains 597 passed, 1 skipped, 0 failed.

### 2026-11-24 17:45 +03:00 — previous handover record
⚠️ Force-closed 2026-11-24 17:45 +03:00: ceremonies skipped (judge pass, bonsai trim, README, showcase linters) — the first /skill:end-chat-soft pays this debt. The follow-up test-after-code waiver was also refused by the active closure hook, so the final selector fix and its real-product verification were NOT run in this chat; do not call them done.

UI-CUT: 2026-11-24 14:42 +03:00 — isolated current VSIX accepted: no header percentage, «Панель Управления», «Думаю...», «Запрос...», exact ON/OFF descriptions and VS Code-derived darker queue/todos backgrounds read in DOM and WebP 31–36. Two changesets are written. At the measured 80% boundary no new checks start; final closure begins with full suite 558/1, lint/typecheck/package green and test processes stopped. The main work remains Phase 0 of the chat-pipeline plan.

[OWNER] «а этот чат закрывай, пока работу в KIMI KRINIK откладываем. Много багов» · 2026-11-24 13:05 +03:00 (чат); «тогда работаем внутри KIMI KRINIK, а фиксы - запускай и тестируй в изолированном окружении VS Code» · 2026-11-24 13:06 +03:00 (чат)

Main commit `8ac5df733` is pushed and `mikalai-kryvusha.kimi-code-kaif@1.0.0` is installed in the owner's main VS Code. This chat adds uncommitted UI edits, bug documents and the chat-pipeline research/plans; no steering implementation changed. Current main work is Phase 0 of `plans/01_EPIC_chat_pipeline_reliability.md`.

[AI] FORCE-CLOSED: 2026-11-24 12:48 +03:00 — the window reached 90%; no new task, build, test suite or judge starts. Full suite (556/1), typecheck, lint and judge VERIFIED were completed before the forced closure.

Force-closed debt paid 2026-11-24 14:22 +03:00: judge pass, README/voice checks, status review and showcase linters completed. Fable judge is VERIFIED WITH CAVEATS: scenario-lint is SKIPPED and the independent README semantic recheck was interrupted; no steering implementation is claimed done.

Standing falsehood: ранняя «latest build is NOT installed» → исправлено в `STATUS.md` по выводу владельца: `node .tmp/owner-install.mjs` успешно установил текущий VSIX. Более раннее «Phase 0 production code stays unchanged» относилось только к characterization и не описывает последующий lifecycle-фикс; это разграничено в `bugs/22`. Последний usage suite 4/5 не назван зелёным.

KNOWLEDGE: the optimistic clientId flow and invariants now live in `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`; reusable lifecycle/localization/voice lessons are `EXPERIENCE.md` EXP-0008–0010; KIMI FORK working/queue parity evidence is `researches/55_kimi_fork_working_queue_parity.md`; the remaining two-client and broader lifecycle matrix is `testcases/TC_chat_pipeline_reliability.md`.

1. Execute `plans/02_epic01_characterize_chat_pipeline.md`: turn `bugs/11`–`bugs/16` into red contracts at the existing runtime/store/adapter boundaries. Production code stays unchanged in Phase 0; do not commit the intentionally red suite.
2. Phase 1 then propagates `PromptSubmissionResult` and `promptId` before optimistic UI is implemented. Read `researches/54` and the meta-plan anchors before each step; do not infer a pass from earlier C09/C10 text-only scenarios.
3. After Phases 0–4 pass in isolated VS Code, resume C08, C11–C12 and C18–C23. The isolated startup route is `pnpm --filter kimi-code-kaif test:extension-host --version 1.123.0`; inspect `.tmp/k5-vscode*` before reuse and leave no test process running.
4. For C23 inspect `packages/node-sdk/src/sdk-rpc-client-v2.ts:2572`; read `packages/agent-core-v2/AGENTS.md` before any engine change. Investigate bugs/04 and 05 separately from K2.6.
5. Release/publication remains a separate gated step. Do not decide B9/B10 or publish without the owner's required word.

### 2026-11-24 19:07 +03:00 — build 3 live steering smoke failed; owner-flagged bugs are the current work
- [AI] AUTO STEER OFF text queue insertion passed: three follow-ups became visible queue rows. Lightning on the first row also sent the second (`bugs/20`); after the batch the composer restored the first sent text (`bugs/12`).
- [AI] AUTO STEER ON sent one message twice on one Enter, reproduced on a second message (`bugs/22`); sent text also reappeared in the composer (`bugs/12`). Steering attachments have no visible media (`bugs/13`).
- [AI] The running UI showed threshold labels 70 / 75 / 80 / 90 % and the current ON/OFF descriptions for Auto Compact and Steer. Current `Code.exe` processes started 18:54:42–18:54:48, so build 3 is loaded on the real path; the earlier wait-for-restart instruction is corrected below and in the build-3 report.
- Current work: capture these real-profile observations, write minimal red regressions, fix the confirmed lifecycle boundaries, then run targeted/full hygiene and isolated installed-VSIX functional checks. The earlier isolated queue/lightning pass is not a real-path closure.

### 2026-11-24 18:46 +03:00 — build 3 verified in isolated VS Code and installed on the main-profile disk
- [OWNER] Action Menu shows all three translations with the active interface language first: `Language / Язык / 语言`, `Язык / Language / 语言`, `语言 / Language / Язык`. ZH Control Panel is `控制面板`; the ZH/RU failure toasts were localized too. Contract lives in `ideas/01_language_selection_modal.md`.
  [OWNER] «Да, именно так» · 2026-11-24 18:32 +03:00 (чат)
- Real installed build 3 VSIX: all three labels, `控制面板` and `v1.0.0 (3)` were clicked/read in isolated VS Code 1.123.0; WebP 39 was inspected. Main-profile installed `package.json` reads build 3 and source/installed dist SHA-256 values match. Report: `testcases/reports/2026-11-24_build_3_trilingual_menu.md`.
- Correction 2026-11-24 19:07 +03:00: the main VS Code process has now restarted; current `Code.exe` start times are 18:54:42–18:54:48. The owner is exercising build 3 on the real path. The earlier PID 15080 / restart-pending state no longer applies.
- Hygiene: targeted 57/57, typecheck and root lint green; package/static audit green. Standard Extension Host smoke on build 3 activated the extension, registered 10 commands and opened the webview with host exit 0. Full suite remains 573 passed, 1 skipped, 1 known failure at `usage-status-bar.test.tsx:57`. No push was made for builds 2–3 or the new branch-rule/docs edits.
- NEXT: finish the owner-flagged steering/queue fixes above. The real-profile `v1.0.0 (3)`, active-first trilingual label and `控制面板` smoke remains unread here. Keep `bugs/23` as a separate exact ON/OFF multiline-payload investigation; do not infer payload loss from the intentionally clamped queue preview.

### 2026-11-24 18:13 +03:00 — build 1 installed in the main profile; force-closed
- Action Menu now renders `v1.0.0 (N)`. `apps/vscode/package.json` owns `buildNumber`; every non-dry-run `package:platform` invocation increments it once before building, and the host passes it through `ExtensionConfig`.
- Fresh `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix` is build 1. `code --install-extension ... --force` installed it into the owner's main profile; installed `package.json` reads `buildNumber: 1`, and installed extension/webview SHA-256 values exactly match the new dist files. Post-restart rendering is not yet observed.
- Verification: new targeted tests 26/26, extension + webview typecheck and root lint green; package/static audit green. Full suite: 573 passed, 1 skipped, 1 failed at the previously documented `apps/vscode/test/webview/usage-status-bar.test.tsx:57` parent-selector assertion (`border-t` is on the separator wrapper); not called green.
- 2026-11-24 18:25 +03:00 owner screenshots still show `v1.0.0` and `Русский / English / 中文`. Forensics: main `Code.exe` PID 15080 was created at 17:57:52, before the new installed `webview.js` timestamp 18:11:41; it has no alternate `--extensions-dir`, and its on-disk package is build 1. The main process therefore has not restarted since installation. A full exit of all VS Code windows followed by a new launch is still required; do not claim live acceptance before reading the new UI.
- NEXT: after the full main-process restart, check `v1.0.0 (1)` plus the Language dialog in Action Menu. The next chat first observes that real-profile smoke, then fixes the usage-status-bar selector and reruns the full suite. Generate the build-number changeset before a PR; no release/publication is authorized.
- Pre-existing `.kaif/kaif.json` modification and untracked `.kaif/kimi-refresh.json`, `.vscode-test/`, `Claude_Help_for_Kimi.md`, `KIMI CODE LOGO/GPT ROBOT REFERENCES/` are not part of this change.
- ⚠️ Force-closed 2026-11-24 18:13 +03:00: ceremonies skipped (judge pass, bonsai trim, README, showcase linters) — the first /skill:end-chat-soft pays this debt.
- Standing falsehood: none — the earlier expected-current-UI installation claim was corrected above and in the 17:45 entry.
- KNOWLEDGE: build identity is sourced from the extension manifest and was checked through the installed package and byte-identical dist hashes; the recipe and remaining UI observation are recorded here.

### 2026-11-24 01:48 +03:00 — combined model + effort picker ✅ full hygiene
- `ModelPicker` combines model and effort in one readable button; quick current-provider list, thinking tiers/on/off, cache note, full search, provider filters, keyboard navigation and shared persisted favorites. `InputArea` keeps attachment, permission, behavior/mode buttons, robot, quota, settings and stop/send in place; the old `ThinkingButton` is removed.
- Five component scenarios plus the bridge context-size assertion are green; full suite 519 passed, 1 skipped; typecheck, lint and both builds green. EN/RU/ZH strings, README and third-party attribution updated. Live Second Side Bar layout and interaction remain K5. Report: `testcases/reports/2026-11-24_model_picker.md`.

### 2026-11-24 01:26 +03:00 — permission defaults ✅ real SDK and full hygiene
- Control Panel Auto / Manual / YOLO now persists canonical `defaultPermissionMode`; new chats clear the old session override and use that default, with legacy `kimi.yoloMode` only as fallback. Main model and reasoning effort remain the defaults for new chats and restart; restored sessions keep their own approval metadata.
- Real SDK proof: a second harness reloaded Auto from disk and a fresh session reported `permission: "auto"` despite legacy YOLO true. Red-to-green: 8 new expectations failed before implementation, 114 targeted tests passed after. Full: 514 passed, 1 skipped; typecheck, lint and both builds green. Live VS Code restart remains K5. Report: `testcases/reports/2026-11-24_permission_defaults.md`.

### 2026-11-24 00:33 +03:00 — KAIF Kimi context control ✅ live activation, local diagnostic fix
- Official Kimi Code CLI 2.7.2 created `session_1e622498-786b-45e0-b5f4-af8e0532ec2e`; its real output showed UserPromptSubmit hooks. `--alive` exited 0, `--measure` read the session's real `wire.jsonl` (30,750 of 891,289 = 3%), and `.kaif/context-window.json` recorded the session.
- Added `[loop_control] auto_compact = false` to `C:/Users/krinik/.kimi-code/config.toml`; `kimi doctor config` is green. For autonomous context-controlled work use a NEW chat in official `moonshot-ai.kimi-code`; KIMI KRINIK live acceptance is still pending, and built-in ownership makes the KAIF hook dormant.
- `bugs/KAIF/04` / upstream issue #204: Kimi `--alive` now reports Auto Compact ON and built-in ownership as explicit dormant states instead of falsely claiming that no hooks ran. Selftest covers both and is green. Correction: the previous session's claim that the dispatcher ran no hooks was false; SessionStart had written `.kaif/kimi-refresh.json` at this session's start.

### 2026-11-23 late evening — K1/K2 functionality and brand assets ✅ hygiene, committed
- `80f882851` Control Panel visibility settings, Compact / Steer / Control, independent Context Window Control, KAIF ownership handoff and picker fixes; `a27da7a8c` context ring + live viewer, multiline messages and Working/logo.
- `bugs/01`–`03`: multiline rendering, attachment-toggle outside-click race and stale picker results have red-to-green component/store guards; live Extension Host acceptance is still pending.
- Auto is turquoise, Stop is a filled square; Working uses the acid-pink `#FF1A8C` face with slight top chamfers and clipped ±1 px eye travel. `krinik-robot-logo.svg` + 1024 px PNG are used in all three README sections.
- Independent Context Window Control: no `.kaif` marker or wire file required; settings + four thresholds, SDK status → self-contained `promptWithSkills(..., steerIfActive: true)`, exact boundary/once/re-arm tests. Built-in ownership and vanilla ON both make the KAIF context hook dormant; no dual delivery.

### 2026-11-24 01:04 +03:00 — secondary model ✅ component and persistence guards
- Added `SubagentModelDialog`, robot visibility, `secondaryModel` in the config/store/bridge contracts, and `src/config/secondary-model.ts` atomic validated persistence. Existing-model selection and Follow main model remove the whole old recipe; main model/effort stay untouched (`effortChanged:false`). Custom providers are excluded.
- `apps/vscode/test/secondary-model.test.ts` proves TOML selection and clearing; the robot interaction test now drives open → existing model → Follow main model and asserts both bridge payloads. A targeted `effortChanged` mutation reddened exactly the new scenario. Full verification: 506 passed, 1 skipped; typecheck, lint and both builds green. Live Extension Host acceptance remains pending; do not call this live-accepted. Report: `testcases/reports/2026-11-24_secondary_model_robot.md`.

### 2026-11-23 evening — K1–K4 features (Claude) ✅ hygiene, live run pending
- `365af86cd` Auto Compact and AUTO STEER switches (K2.1/K2.2/K2.4/K2.5/K2.7); `08a22d393` brand KIMI KRINIK (K1.4);
  `bd0f2e569`…`53bda319b` EN / 中文 / RU (K3.1–K3.6); `61fcdd449` dark tooltips and menus (K3.7/K3.8, the owner saw it live);
  `d699642de` changesets; `7ce152c44` Sound Settings window, `kimi.sounds` (K4).
- `c80785857` composer modes: permission Manual / YOLO / Auto, Plan, Goal, Swarm (K1). No live Extension Host run yet.
- `aaf2e75b7` the @ file picker clamps its selection during render: the flaky `useFilePicker` clamp test was a real defect.
- `02a18c159` the three "Windows baseline" failures were test expectations, not product defects (engine paths use `/`;
  the UNC test hit a network lookup). `apps/vscode/test` is fully green on Windows: 469 passed, 1 skipped.

### 2026-11-23 — 1.0.0 RC review, fixes and the KAIF deployment ✅
- `3e9798fee` (KIMI): extension identity `kimi-code-kaif`, automatic steer, quota rings, attention, sidebar background.
- `b42e17e46` (KIMI): engine switch `[loop_control] auto_compact = false` with tests for every automatic path.
- Claude, commits `f340e8821`…`9c8ec6aa1` and the KAIF deployment: review B1–B12 and the `UPD` journal in `Claude_Help_for_Kimi.md`; fixes B1 (CI
  filters, pnpm overrides, `flake.nix`), B2 (attention speaks the real error), B3 (`composerRestore`, retry keeps the prompt),
  B4 (media in flight are not resent or dropped), the lint ratchet of `attention.handler.ts`; KAIF 2.10 for Kimi; the README
  in EN → RU → 中文.


### 2026-11-24 23:15 +03:00 — build 12 packaged, isolated acceptance passed, installed on the main-profile disk
- Fixed the duplicate optimistic fallback, stale/current composer restoration, selected-item queue race and Steer media renderer. Runtime/host now preserve `PromptSubmissionResult`; queued prompts correlate at later turn start. Fresh-process build 6 passed the OFF selected-item queue case and WebP 40 was read.
- Packaged 12 prerecorded event MP3 files in EN/RU/ZH with localized project identity and no owner name. RU uses Eugene; ZH uses the phonetic «这是基米·克里尼克». Glass uses MP3 and logs playback rejection. The owner listened and accepted all three voice languages. `bugs/17` is DONE; `bugs/12`, `bugs/13`, `bugs/15`, `bugs/20`, `bugs/22` and `bugs/24` await main-profile build-12 acceptance.
- RU copy now uses «Рассуждение», «При приближении к переполнению…», final full stops and `Glass / Стекло / 玻璃`; queue ping runs three iterations. New defaults are approval Glass, question Voice, error Alert, completion Chime; existing persisted choices remain preserved.
- Control Panel places context controls after all visibility checkboxes (build 10 WebP 42). `bugs/15` replay no longer emits internal hook bodies as assistant text; real-profile confirmation pending.
- Verification: affected contracts and typecheck green; final package/static audit green. Full extension suite 586 passed, 1 skipped, 1 pre-existing failure at `usage-status-bar.test.tsx:57`. Report: `testcases/reports/2026-11-24_chat_lifecycle_audio_build_12.md`.
- Main-profile `package.json` reads build 12 and source/installed dist hashes match. Full VS Code restart is still required before any real-profile fix claim. NEXT: restart, read `v1.0.0 (11)` and repeat the owner ON/OFF queue/composer/media/hook smoke. Sticky last message is the next separate task after this acceptance.
- Harness correction: Playwright `browser.close()` on a CDP connection only disconnected, so apparent build 4–6 failures were invalid. Raw CDP Browser.close plus PID/log-session verification is now required; details in `bugs/20`.
- [OWNER] The changeset author-confirmation step is removed from `.agents/skills/gen-changesets/SKILL.md`; the inherited skill is from the upstream Kimi monorepo, not KAIF. Required changesets are still generated without that extra approval gate. <!-- attribution-ok: the owner's removal order and this change are recorded in commit 6fea8307b -->

## What's done (the short tail — older entries live in PROJECT_HISTORY.md)

### 2026-11-24 17:45 +03:00 — lifecycle and UI fixes delivered; installation claim corrected at 18:07
- `bugs/22`: first/queued/steered messages now create immediate optimistic entries with stable `clientId` through store, bridge, runtime and events; durable events reconcile without duplicates and host-idle dequeue needs no lightning. Isolated VSIX: first Send appears before acknowledgement and remains one user entry/one model request.
- `bugs/20`: queue lightning removes immediately and restores exact index on failure; ten activations produce one `steerChat`. `bugs/17`: attention voice starts exactly once with «Николай, это Кими Криник» on Glass/browser routes. `bugs/19`: live tool events restore «Работаю…»; two-client replay is unverified.
- `ideas/01`: language selection is a dialog with selected-first order (English before Russian, Chinese last); Action Menu shows only localized `Language` / `Язык` / `语言`. Delete is localized. Quota/context headings are bold with separator borders/gaps.
- Lifecycle full suite: 48 files, 571 passed, 1 skipped; typecheck, lint, build and Extension Host smoke green. Final usage suite is 4/5: `usage-status-bar.test.tsx:57` reads the immediate parent instead of the separator wrapper; not called green.
- The 17:35 `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix` passed Extension Host smoke, but the owner's 18:07 restart showed that the expected current UI was not active. The earlier claim of a successful current installation is retracted; fresh packaging and installation are required.

### 2026-11-24 13:51 +03:00 — owner findings filed; chat pipeline research and repair ladder ready
- Real-profile acceptance found six open defects: `bugs/11` immediate/lost steering, `bugs/12` obsolete composer restoration, `bugs/13` steering attachments and thumbnails, `bugs/14` missing visible queue, `bugs/15` visible internal hook output and `bugs/16` assistant avatar above the user's steering bubble. No pipeline implementation changed.
- `researches/54_chat_pipeline_reliability.md` synthesizes Claude documentation/bundle 2.1.331, local `app-client`, current SDK and the owner requirements. `plans/01_EPIC_chat_pipeline_reliability.md` defines the two-ID lifecycle and Phases 0–4; `plans/02_epic01_characterize_chat_pipeline.md` details only the red-contract phase. Requirements and attribution linters pass; scenario-lint is SKIPPED (no scenario blocks).
- Context Window descriptions, header percentage, VS Code-derived dark cards and Russian labels were edited with red-to-green targeted checks and observed in the current isolated VSIX. Full extension: 558 passed, 1 skipped; lint, typecheck, build/package and voice-lint green. `HOUSE_RULES.md` R3 records the owner's user-facing explanation style.
- [OWNER] «тогда работаем внутри KIMI KRINIK, а фиксы - запускай и тестируй в изолированном окружении VS Code» · 2026-11-24 13:06 +03:00 (чат). Future fixes are developed inside KIMI KRINIK and run in isolated VS Code.

### 2026-11-24 12:33 +03:00 — responsive/brand UI, C17 and sound contour ✅ full suite / live VSIX
- C17 is live-pass: workspace voice decline/allow, machine priority, phrase cleanup and ENOENT logging. C24–C26 cover the pink response robot, reference composer parity, wheel+fade, wide no-scroll, scrollable Action menu, About RPC, language order and checked-control colors. Bugs 08/09 are DONE.
- Bug 10 is DONE: latest-write volume, serialized host updates, global Sound enabled, Triple 880/660/990, packaged glass.opus and Russian Eugeny. Live VSIX: latest volume 100, OFF creates no audio, neutral tracks. Full extension: 556 passed, 1 skipped; typecheck and lint green.
- At the measured 80% context boundary no new heavy task starts. Remaining real-world rows: C08, C11–C12 and C18–C23, including real-event sound/replay, quotas, active compaction/closure, rejected media, effort/stop, extended status and rollback. The next session must run inside KIMI KRINIK on the owner's real profile.

### 2026-11-24 07:32 +03:00 — B5/B6 and live K5 milestone ✅ hygiene / partial acceptance
- `5c7b8ece5` secured attention voice commands with machine-only configuration, command-bound workspace approval, temp-file cleanup and logged failures; `695d3f51a` made the VSIX Extension Host smoke independent of inherited Electron Node mode; `87c26cf13` fixed the packaged header robot path. All three are pushed.
- Bugs 01–03 are DONE after real VSIX acceptance; bugs 06/07 are DONE with red-to-green guards and live evidence. Languages, sound preview, Control Panel, ON/OFF steering and active-session Swarm controls were observed through CDP/WebP. K5 remains partial; see `testcases/TC_K5_live_acceptance.md` and `testcases/reports/2026-11-24_k5_live_acceptance.md`.

### 2026-11-24 02:34 +03:00 — in-flight Auto Compact OFF ✅ engine integration and full hygiene
- `AgentFullCompactionService` now subscribes to `loopControl` changes and aborts only an active automatic operation when `autoCompact` becomes false. Cancellation is observed before the deferred provider response; an active manual compaction completes and applies its summary. No new automatic starts or overflow recovery occur; manual `/compact` remains available.
- K2.6 red-to-green: the immediate-cancellation assertion failed before the subscription, both mid-flight scenarios and agent-core typecheck pass. Root lint and extension 527/1 pass. The full engine file has 121/123 passes; the two unrelated failures (Windows path in the frozen prompt and an empty Pre/PostCompact hook log) reproduce identically with the new subscription removed. Report: `testcases/reports/2026-11-24_inflight_auto_compact_off.md`.

### 2026-11-24 02:10 +03:00 — live status pills and session header ✅ full hygiene
- `StatusPills` uses real queue/file-change stores, `session.listBackgroundTasks()` polling, the last `SetTodoList` display and the compaction viewer; polling errors are visible and old tasks clear on session change. `BottomToolbar` is fully replaced. The header shows `session_title` from summary/meta events and the KIMI KRINIK robot.
- Two host expectations were red before implementation, then 73 host tests passed; 38 affected webview checks passed. Full suite 527 passed, 1 skipped; typecheck, lint and both builds green after replacing one new `sort()` with `toSorted()`. Live Second Side Bar acceptance remains K5. Report: `testcases/reports/2026-11-24_status_pills_header.md`.
