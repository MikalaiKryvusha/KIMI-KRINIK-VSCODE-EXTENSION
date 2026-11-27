import { describe, expect, it, vi } from "vitest";

import {
  ContextWindowController,
  contextWindowCompactionPoint,
  decideContextWindow,
  DEFAULT_CONTEXT_WINDOW_THRESHOLDS,
} from "../src/runtime/context-window-control";

const WINDOW = 1_048_576;
const POINT = 891_289;
const LOOP = { autoCompact: false };

describe("KIMI KRINIK context-window decisions", () => {
  it("uses Kimi's configured compaction point", () => {
    expect(contextWindowCompactionPoint(WINDOW, {})).toBe(POINT);
    expect(contextWindowCompactionPoint(WINDOW, { compactionTriggerRatio: 0.95 })).toBe(996_147);
    expect(contextWindowCompactionPoint(WINDOW, { reservedContextSize: 0 })).toBe(POINT);
    expect(contextWindowCompactionPoint(262_144, {})).toBe(212_144);
  });

  it("crosses 70, 75, 80 and 90 percent at the exact token boundaries", () => {
    const thresholds = DEFAULT_CONTEXT_WINDOW_THRESHOLDS;
    const decide = (used: number, said: number[] = []) => decideContextWindow(used, WINDOW, thresholds, said, LOOP);
    expect(decide(623_902).line).toBeUndefined();
    expect(decide(623_903).kind).toBe("warn");
    expect(decide(668_466, [70]).line).toBeUndefined();
    expect(decide(668_467, [70]).kind).toBe("cut");
    expect(decide(713_031, [70, 75]).line).toBeUndefined();
    expect(decide(713_032, [70, 75]).kind).toBe("close");
    expect(decide(802_160, [70, 75, 80]).line).toBeUndefined();
    expect(decide(802_161, [70, 75, 80]).kind).toBe("force");
  });

  it("delivers only the highest newly reached stage and re-arms after the context falls", () => {
    const jumped = decideContextWindow(760_000, WINDOW, DEFAULT_CONTEXT_WINDOW_THRESHOLDS, [], LOOP);
    expect(jumped.kind).toBe("close");
    expect(jumped.said).toEqual([70, 75, 80]);
    expect(decideContextWindow(760_000, WINDOW, DEFAULT_CONTEXT_WINDOW_THRESHOLDS, jumped.said, LOOP).line).toBeUndefined();

    const rearmed = decideContextWindow(200_000, WINDOW, DEFAULT_CONTEXT_WINDOW_THRESHOLDS, jumped.said, LOOP);
    expect(rearmed.said).toEqual([]);
    expect(decideContextWindow(623_903, WINDOW, DEFAULT_CONTEXT_WINDOW_THRESHOLDS, rearmed.said, LOOP).kind).toBe("warn");
  });

  it("runs independently of Auto Compact but stays disabled by its own toggle", () => {
    expect(decideContextWindow(800_000, WINDOW, DEFAULT_CONTEXT_WINDOW_THRESHOLDS, [], { autoCompact: true, enabled: false }).line).toBeUndefined();
    expect(decideContextWindow(800_000, WINDOW, DEFAULT_CONTEXT_WINDOW_THRESHOLDS, [], { autoCompact: true, enabled: true }).line).toBeDefined();
    expect(decideContextWindow(800_000, WINDOW, DEFAULT_CONTEXT_WINDOW_THRESHOLDS, [], { autoCompact: false, enabled: false }).line).toBeUndefined();
  });

  it("uses self-contained prompts without KAIF skills or markers", () => {
    for (const said of [[], [70], [70, 75], [70, 75, 80]]) {
      const decision = decideContextWindow(802_161, WINDOW, DEFAULT_CONTEXT_WINDOW_THRESHOLDS, said, LOOP);
      expect(decision.line).toContain("KIMI KRINIK context:");
      expect(decision.line).not.toContain("KAIF");
      expect(decision.line).not.toContain("/skill:");
      expect(decision.line).not.toContain(".kaif");
    }
  });

  it("delivers one system prompt per stage and delivers it again after a compaction reset", async () => {
    const deliver = vi.fn(async (_line: string) => ({ state: "running" as const }));
    const log = vi.fn();
    const controller = new ContextWindowController(
      async () => ({ enabled: true, autoCompact: false, thresholds: DEFAULT_CONTEXT_WINDOW_THRESHOLDS }),
      deliver,
      log,
    );

    await controller.observe(623_903, WINDOW);
    await controller.observe(623_903, WINDOW);
    expect(deliver).toHaveBeenCalledTimes(1);
    expect(deliver.mock.calls[0]?.[0]).toMatch(/^<system>KIMI KRINIK context:/);
    expect(deliver.mock.calls[0]?.[0]).toMatch(/<\/system>$/);

    controller.reset();
    await controller.observe(200_000, WINDOW);
    await controller.observe(623_903, WINDOW);
    expect(deliver).toHaveBeenCalledTimes(2);
    expect(log).not.toHaveBeenCalled();
  });
});
