# KIMI KRINIK — External structure map

> **The EXTERNAL map: what the project looks like from the outside** — its directories, files, and the
> cross-references and dependencies between them. Its companion is `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`.
> **Living reference — never DONE-tagged.**

---

## The tree

```
<project root>/                      # a fork of the MoonshotAI/kimi-code pnpm monorepo
├── apps/
│   ├── vscode/                      # THE PRODUCT: the KIMI KRINIK VS Code extension (package kimi-code-kaif)
│   │   ├── src/                     # extension host: activation, webview provider, RPC handlers, runtime
│   │   ├── shared/                  # types and the bridge contract shared by host and webview
│   │   ├── webview-ui/src/          # React webview: stores, components, services/bridge.ts
│   │   ├── test/                    # vitest: host tests + test/webview store/component tests
│   │   └── package.json             # VS Code manifest: identity, commands, settings, version
│   ├── kimi-code/                   # upstream CLI/TUI (@moonshot-ai/kimi-code 2.7.2)
│   ├── desktop/ · vis/              # upstream Electron app and replay visualizer
├── packages/                        # upstream libraries; the engine the extension runs
│   ├── agent-core-v2/               # the DI agent engine (loop, compaction, profile, config)
│   ├── node-sdk/                    # @moonshot-ai/kimi-code-sdk: the harness API the extension calls
│   └── …                            # kap-server, klient, core, oauth, app-* (see the root AGENTS.md map)
├── docs/                            # upstream VitePress user docs (en/zh)
├── scripts/ · .github/              # lint/check scripts and CI workflows
├── .changeset/                      # release notes source for every package
├── AGENTS.md                        # upstream monorepo rules (hard engineering contract)
├── .kimi-code/AGENTS.md             # KAIF pointer for Kimi Code (loaded together with AGENTS.md)
├── .kimi-code/skills/               # KAIF skills for Kimi (/skill:<name>), mirrored from .kaif/skills-canonical/
├── .kaif/                           # KAIF machinery: kaif.json marker, kaif-core.mjs, hooks/, tools/, spheres/
├── AGENT_GUIDE.md … STATUS.md …     # KAIF root documents (canon, state, plan, history, maps)
├── plans/ bugs/ ideas/ researches/ interviews/ homeworks/ reports/   # KAIF work records
└── README.md                        # the public face: EN → RU → 中文
```

## What each part is

| Path | What it is | Depends on / references |
|------|-----------|-------------------------|
| `apps/vscode/` | the KIMI KRINIK extension | `packages/node-sdk` (bundled by `tsdown.config.ts`), `shared/` |
| `packages/agent-core-v2/` | the engine; `[loop_control] auto_compact` lives in `src/agent/loop/configSection.ts` | read through `packages/node-sdk` |
| `.kaif/hooks/` | KAIF hook scripts this project runs | started by `~/.kimi-code/kaif/kimi-hook.mjs` from `~/.kimi-code/config.toml` |
| `.kimi-code/skills/` | Kimi copies of the KAIF skills | regenerated from `.kaif/skills-canonical/` by `node .kaif/kaif-core.mjs sync` |
| `AUTHOR_STYLOMETRY.md` | the owner's voice portrait (public snapshot), git-ignored | checked by `pnpm run kaif:voice` |

## Cross-references & dependency rules

1. The engine and the harness come from upstream Kimi Code; product changes go into `apps/vscode`. An engine change stays
   narrow (like `auto_compact`) and carries its own tests and changeset.
2. `apps/vscode/shared/` is the only contract between host and webview; a new RPC method gets a `Methods` entry and a
   `validateParams` branch in `shared/bridge.ts`.
3. KAIF skills are edited in `.kaif/skills-canonical/` only; the `.kimi-code/skills/` copies are generated.
4. `.kaif/` is vendored machinery: it is excluded from `check-comments` and oxlint (`.commentignore`, `.oxlintrc*.json`).

## Entry points

1. `.kimi-code/AGENTS.md`, then the root `AGENTS.md`, then `STATUS.md`.
2. The product: `apps/vscode/src/extension.ts` (host) and `apps/vscode/webview-ui/src/App.tsx` (webview).
3. The 1.0.0 scope: the epic `plans/147_EPIC_kimi_krinik_1_0_0.md` of the KAIF origin repository (`D:/work/ai_sandbox/KAIF`).
