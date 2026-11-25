# Test run report — build 37 media/composer atomicity

**Created:** 2026-11-26 02:28 +03:00 · **Run by:** the agent · **Version/build:** KIMI KRINIK 1.0.0 build 37, VSIX SHA-256 `1536e8762d576de2c055359e0be07fd1126de77e81ce56d6028d1fc6c08238d8`

## 1. Work

Verify `bugs/35_attachment_composer_chat_race.md`: after one Send with AUTO STEER ON, the optimistic user text and image must appear together and the sent image must leave the composer in the same observable update. A still-processing unrelated draft must remain, and a real steer rejection must restore the sent text and ready media.

## 2. Contour

Windows 11, Node 24.15.0, pnpm 10.33.0, Vitest/jsdom, VS Code 1.123.0 isolated win32-x64 VSIX, testkit held model, real PNG paste, CDP and MutationObserver state traces, WebP readback.

REAL WORLD: accumulated — the owner's main VS Code profile, existing sessions and his original image; data and machine — his Windows machine with build 37 installed; path — Second Side Bar. The original several-second main-profile observation is the owner's. This run reproduced the mechanism on an isolated real product with a one-pixel PNG and verified the fix there; the main running profile has not been reloaded or re-observed, so no accumulated-world completion is claimed.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-26 02:18 +03:00 | `node .tmp/k5-cdp.mjs eval .tmp/k35-media-race.js` on build 36 | Reproduced: at 7.0 ms chat had text + image while composer retained the image; at 39.9 ms composer cleared after acknowledgement |
| 2 | 2026-11-26 02:21 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-store.test.ts` | Expected red: old code retained both sent and still-uploading media before acknowledgement |
| 3 | 2026-11-26 02:23 +03:00 | Same targeted command after the fix | 34 passed / 0 failed, including actual-failure media restoration |
| 4 | 2026-11-26 02:23 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test`, `pnpm --filter kimi-code-kaif typecheck`, `pnpm lint` | 646 passed / 1 skipped; typecheck and lint exit 0 |
| 5 | 2026-11-26 02:25 +03:00 | `pnpm --filter kimi-code-kaif package:platform --target win32-x64` | Build 37 packaged; 44 files; static/package audit passed |
| 6 | 2026-11-26 02:26 +03:00 | Main `code --install-extension … --force` and isolated `node .tmp/k5-install.mjs` | Both installations succeeded |
| 7 | 2026-11-26 02:27–02:28 +03:00 | New isolated build-37 process, new held base request, then `node .tmp/k5-cdp.mjs eval .tmp/k35-media-race.js` | Only initial composer-owned state and final chat-owned state were observed; no sent-text/composer-media intermediate frame |
| 8 | 2026-11-26 02:28 +03:00 | `node .tmp/k5-vscode-ui.mjs capture 104-build37-media-race-fixed` | WebP showed the user bubble with text + image and no composer attachment |
| 9 | ≈ 2026-11-26 02:30 +03:00 | Release held response, `node .tmp/k5-wait-text.mjs "K35 media base held"`, history open and `.tmp/k35-media-open-37.js` | Completion and replay retained the response, one chat image and zero composer media |
| 10 | 2026-11-26 02:35 +03:00 | Judge re-ran the store suite, VSIX verify, report lint and session replay | 34/34; package audit green; 38 reports / 0 findings; replay again read one chat image and zero composer media |

## 4. Checks

Hygiene: the updated store contract was red before the fix and green afterward. Existing real-failure restoration, media content, queue and steering checks pass. Full extension is 646 passed / 1 skipped; typecheck, lint, build and VSIX audit are green.

Functional run: before the fix, the real observer recorded chat text + image at 7.0 ms with composer image still present, then composer cleanup at 39.9 ms. After the fix, the first post-send state at 11.8 ms already had chat text + image and zero composer media; no later ownership transition appeared during the two-second observation window. The final WebP was opened and read. After releasing the held response and reopening the session through History, the response and one chat image remained while composer media stayed zero.

| Case | Status | Observation |
|---|---|---|
| Before-fix mechanism | pass | Composer retained sent media until the asynchronous acknowledgement |
| Atomic send after fix | pass | Chat text + image and empty composer first appear together in the observed trace |
| Unrelated processing draft | pass | `image-2-still-uploading` remains in the store before and after acknowledgement |
| Failed steer restoration | pass | Existing public-store regression restores text and ready sent media |
| Provider content boundary | pass | The store passes one text part and one image part; existing delivery coverage remains green |
| Main accumulated running profile | blocked | Build 37 installed, but the owner's active window was not reloaded and observed |

## 5. Found

- `bugs/35_attachment_composer_chat_race.md` — confirmed the deferred-acknowledgement cleanup mechanism and fixed it at the existing store boundary.
- No separate media-dropping reconciliation was found: runtime `SteerInput` carries the original full input. Image-decoding delay for the owner's original large attachment remains unmeasured.

## 6. Traces

- `.tmp/k35-media-race.js` — before/after frame probe
- `.tmp/k5-vscode/104-build37-media-race-fixed.webp` — final bubble and empty composer, opened and read
- `bugs/35_attachment_composer_chat_race.md`
- `apps/vscode/artifacts/vsix/kimi-code-win32-x64.vsix`

## 7. Verdict

partial — the fix and all hygiene pass on the real isolated product; accumulated main-profile acceptance remains pending.
