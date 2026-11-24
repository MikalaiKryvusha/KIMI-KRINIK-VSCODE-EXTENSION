# Локальные правила — KIMI KRINIK

> Правила уровня 4 из `AGENT_GUIDE.md`: постоянные договорённости владельца, маршруты и ресурсы этой машины. Перед работой на уже известной поверхности сначала открывай соответствующую строку.

**Создано:** 2026-11-23 · **Владелец:** Mikalai Kryvusha · **Перенесено из руководства:** пока ничего

## 1. Постоянные правила владельца

### R1. Озвучивай обращения по правилам мягкого голоса с Glass

1. Обращайся к владельцу «Николай» и называй вызывающий проект: «Николай, это Кими Криник».
2. Пиши произносимую фразу полностью кириллицей: числа и единицы называй русскими словами, латинские буквы и цифры в фразе не используй.
3. Сначала записывай фразу в `voice/<ГГГГ-ММ-ДД_ЧЧ-ММ-СС>_<смысл-латиницей>.txt`, затем озвучивай файл.
4. Воспроизводи фоном командой `D:/work/ai_sandbox/tools/silero_tts/venv/Scripts/python.exe -I D:/work/ai_sandbox/tools/silero_tts/say.py --file <файл>`; три синтезированных писка и системный голос не заменяют этот контур.
5. После вызова читай строку `soft voice:` и код выхода; по коду команды не утверждай, что владелец услышал фразу.

- **Исключение:** `--dry-run`, selftest и технические журналы без воспроизведения звука.

[OWNER] «и почему ты не обратился ко мне по имени? и ты не назвал своего имени по проекту?» · 2026-11-23 ≈22:58 +03:00 (чат) · принятые правила KUMM `D:/work/ai_sandbox/KUMM/HOUSE_RULES.md` §13

## 2. Маршруты и ресурсы машины

| Поверхность | Где лежит источник | Что покрывает |
|---|---|---|
| Мягкий голос с Glass | `D:/work/ai_sandbox/tools/silero_tts/VOICE_RULES.md` | финальный тембр владельца, состав WAV, установка и команда вызова |
| Общий русский Silero | `F:/krinik_tts/README.md` | локальный offline TTS и прямой `voice-say.mjs`; для обращений владельца сначала применяй контур Glass из R1 |
| Имя владельца и проекта в звонке | `.kaif/kaif.json` → `contour` | `callName`, `spokenProjectName`, file-based voice tool |

## 3. Инструменты проекта

| Команда | Что делает | Что проверяет перед использованием |
|---|---|---|
| `node .kaif/hooks/kimi-permission-call.mjs --selftest` | проверяет маршрут file-based voice для permission call | наличие `contour.voiceFileTool` и передачу файла фразы |
| `node .kaif/tools/contour/voice-soft.mjs --selftest` | проверяет журнал фраз и soft-фильтр KAIF | форму voice log; не заменяет прослушивание Glass |
| `pnpm --filter kimi-code-kaif test:extension-host --version 1.123.0` | устанавливает VSIX в изолированный профиль, активирует расширение и открывает webview | кеш `F:/Temp/kimi-vscode-test-cache`; скрипт сам очищает унаследованный `ELECTRON_RUN_AS_NODE` |

## 4. Environment dossier — факты этой машины

> **Environment dossier.** Taken: `2026-11-24T05:35:54+03:00` · Regeneration: `/refresh-context` → dossier step · Факты старше четырёх недель считаются гипотезами и проверяются заново.

| Факт | Значение | Probe |
|---|---|---|
| OS | Windows 11 Pro · `10.0.26200` | `powershell.exe -NoProfile -File .tmp/k5-env-probe.ps1` |
| CPU / RAM | AMD Ryzen 7 5700G · 16 logical cores · 31,8 GiB | тот же probe-файл |
| Shells | Git Bash `C:/Program Files/Git/usr/bin/bash.exe` · Windows PowerShell · `cmd.exe`; `pwsh` не найден | `where bash powershell pwsh cmd` |
| Git Bash locale / redirect | `C.UTF-8`; `Привет` записан как UTF-8 `d09fd180d0b8d0b2d0b5d182` | `locale`; `bash -c 'cat .tmp/k5-encoding-input.txt > .tmp/k5-encoding-bash.txt'` + Node hex |
| PowerShell console / redirect | console codepage `866`; `$OutputEncoding` `20127` (US-ASCII); `Set-Content` записал Windows-866 `cff0e8e2e5f20d0a` | `.tmp/k5-env-probe.ps1` + `.tmp/k5-encoding-probe.ps1` + Node hex |
| PowerShell locale | `ru-RU` / `ru-RU` | `.tmp/k5-env-probe.ps1` |
| Runtime / build / VCS | Node `24.15.0` · pnpm `10.33.0` · Git `2.43.0.windows.1` | `node --version; pnpm --version; git --version` |
| `tar` / `curl` / `find` в Git Bash | GNU `/usr/bin/tar`, `/usr/bin/find`; curl `/mingw64/bin/curl` | `type -a tar curl find` |
| `tar` / `curl` / `find` в PowerShell | tar/find из Git `usr/bin`; curl — alias | `Get-Command tar,curl,find` в probe-файле |
| VCS policy | `core.autocrlf=true` · credential helper `manager` | `git config --get core.autocrlf; git config --get credential.helper` |
| Package managers | pnpm/npm из `C:/Program Files/nodejs`; winget установлен | `where pnpm npm winget` и PowerShell `Get-Command` |
| Уроки инцидентов | `EXP-0002` red diff · `EXP-0003` voice/Windows · `EXP-0004` hook evidence · `EXP-0006` in-flight assertion | `EXPERIENCE.md` |
