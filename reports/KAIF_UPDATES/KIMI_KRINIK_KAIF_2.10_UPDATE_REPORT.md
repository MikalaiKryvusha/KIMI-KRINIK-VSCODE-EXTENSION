# KIMI KRINIK — KAIF 2.10 update report

**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/205

## 1. Chronology with numbers

- `kimi-stop.mjs --selftest`: 3/3 contracts green.
- `bugs156-kimi-stop-multiplexer`: all named cases green, including the legacy first-only control and simultaneous STATUS+testing+window delivery.
- `kimi-stop-mutants`: control 0 red; M1=3, M2=1, M3=2, M4=2, M5=1, each exactly on its named failure.
- Framework build: 196 file blocks, 846 modules; check-framework OK.
- `install --bundle`: multiplexer added; 3 replaced, 1 added, 110 kept paths.
- `node .kaif/kaif-core.mjs check`: green, 114 files + 38 agent artifacts.
- `pnpm lint`: exit 0; root AGENTS.md is 23195/23200 bytes, 174 references resolve.

## 2. Rakes

- **S2 — sequential Stop reasons were lost.** Verbatim contract failure: “only STATUS is delivered although testing lastStop and the window block were produced.” Cost: the final test-debt reminder silently vanished. Repro: `node tools/sandbox/probes/bugs156-kimi-stop-multiplexer.mjs`. Fix: one sequential multiplexer aggregates all exit-2 reasons, with the same event and one farewell.
- **S2 — sandbox probe bypassed temp-root guard.** Verbatim: “fixed temp name (bugs/59) — take the root via tools/lib/temp-root.mjs.” Cost: `npm run test:core` refused the probe. Fix: use `tempRoot` and exact session-ID cleanup, no directory scan.
- **S3 — verification ritual, not a product defect.** `install --bundle` initially left merge/pointer/checkpoint tasks open. They are now completed, including Kimi wiring and budget/attribution gates.
- **S2 — unrelated existing failures.** Full `test:core` still reports one S9 #146 assertion and two context-window cases. They are outside bugs/156 and were not hidden or used to reject the multiplexer fix.

## 3. Exercised vs NOT

Exercised: legacy first-only control, sequential aggregation, replay, five mutants, fresh dist, deployed selftest, s14 multiplexer assertions, Kimi hook wiring, deployed manifest and root lint.

NOT exercised: a live owner Stop continuation, full-suite green, S9 #146 root cause, context-window manual measurement/--alive root cause, Linux CI for `bugs/04`.

## 4. Wishes for the next version (cost descending)

1. Run a real Stop continuation against the deployed dispatcher and read the actual delivered reasons once, preserving the no-loop invariant.
2. Separate unrelated S9 #146 and context-window failures from release evidence instead of letting them mask a focused green path.
3. Verify the Linux row of `bugs/04` in CI.

## 5. Final state and judge verdict

VERIFIED WITH CAVEATS

- `kimi-stop.mjs` selftest passes all three contracts: deterministic aggregation, identical event/one farewell, silent replay.
- `bugs156-kimi-stop-multiplexer` passes the legacy first-only control and the fixed path: STATUS+testing+window arrive together; resolving only STATUS leaves the others blocked; running code clears testing debt.
- Mutants M1–M5 fail on exactly their named cases.
- Fresh dist assembly passes check-framework: 196 file blocks and 846 modules. Deployed `kimi-stop.mjs` exists and the same selftest passes.
- s14 confirms exactly one Stop multiplexer and all simultaneous reasons, with separate StopFailure. `install --bundle` preserves local content and adds the multiplexer.
- `pnpm lint` exits 0; deployed manifest check is green (114 files + 38 agent artifacts).
- Caveats: full `test:core` fails one unrelated S9 #146 assertion and two context-window cases (manual measurement and --alive), outside bugs/156. No live owner Stop continuation was run. Local License retains the documented monorepo/extension split instead of the upstream MIT-only line, intentionally.
- `adopt-current` and `install --bundle` preserved owner decisions and local hook fixes; `PROJECT_HISTORY.md` received the older closed sections verbatim, keeping STATUS within budget.
