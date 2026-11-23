import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  settings: new Map<string, unknown>(),
  update: vi.fn(),
}));

vi.mock("vscode", () => ({
  ConfigurationTarget: { Global: 1 },
  workspace: {
    getConfiguration: () => ({
      get: (key: string, fallback: unknown) => (boundary.settings.has(key) ? boundary.settings.get(key) : fallback),
      update: boundary.update,
    }),
  },
}));

import { behaviorHandlers } from "../src/handlers/behavior.handler";
import { Events, Methods } from "../shared/bridge";

const setAutoCompact = behaviorHandlers[Methods.SetAutoCompact];
const getAutoCompact = behaviorHandlers[Methods.GetAutoCompact];
const updateExtensionSetting = behaviorHandlers[Methods.UpdateExtensionSetting];

let root: string;
let workDir: string;
let engineAutoCompact: boolean | undefined;
let markerAtSetConfig: string | undefined;

function marker(): string {
  return join(root, ".kaif", "kaif.json");
}

function context() {
  return {
    workDir,
    broadcast: vi.fn(),
    logError: vi.fn(),
    harness: {
      getConfig: vi.fn(async () => ({ loopControl: engineAutoCompact === undefined ? {} : { autoCompact: engineAutoCompact } })),
      setConfig: vi.fn(async (patch: { loopControl?: { autoCompact?: boolean } }) => {
        markerAtSetConfig = (() => {
          try {
            return readFileSync(marker(), "utf8");
          } catch {
            return undefined;
          }
        })();
        engineAutoCompact = patch.loopControl?.autoCompact;
        return {};
      }),
    },
  };
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "kaif-behavior-"));
  workDir = join(root, "apps", "web");
  mkdirSync(workDir, { recursive: true });
  engineAutoCompact = undefined;
  markerAtSetConfig = undefined;
  boundary.settings.clear();
  boundary.update.mockReset();
});

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("Auto Compact switch", () => {
  it("reads the engine config as the only authority", async () => {
    await expect(getAutoCompact(undefined, context() as never)).resolves.toEqual({ ok: true, enabled: true });
    engineAutoCompact = false;
    await expect(getAutoCompact(undefined, context() as never)).resolves.toEqual({ ok: true, enabled: false });
  });

  it("writes the KAIF thresholds into the project marker before turning automatic compaction off", async () => {
    mkdirSync(join(root, ".kaif"), { recursive: true });
    writeFileSync(marker(), `﻿${JSON.stringify({ agents: ["kimi-code"], contextWindow: { tokens: 891289, warnPct: 50 } })}`);
    boundary.settings.set("kaif.closePercent", 85);
    const ctx = context();

    await expect(setAutoCompact({ enabled: false }, ctx as never)).resolves.toEqual({ ok: true, enabled: false, kaif: "projected" });

    expect(ctx.harness.setConfig).toHaveBeenCalledWith({ loopControl: { autoCompact: false } });
    const projected = { agents: ["kimi-code"], contextWindow: { tokens: 891289, warnPct: 70, cutPct: 75, closePct: 85, forcePct: 90 } };
    expect(JSON.parse(markerAtSetConfig!)).toEqual(projected);
    expect(JSON.parse(readFileSync(marker(), "utf8"))).toEqual(projected);
    expect(ctx.broadcast).toHaveBeenCalledWith(Events.AutoCompactChanged, { enabled: false });
  });

  it("keeps automatic compaction on and the marker untouched when the marker is not valid JSON", async () => {
    mkdirSync(join(root, ".kaif"), { recursive: true });
    writeFileSync(marker(), "{ broken");
    const ctx = context();

    const result = await setAutoCompact({ enabled: false }, ctx as never);

    expect(result).toMatchObject({ ok: false, enabled: true });
    expect(ctx.harness.setConfig).not.toHaveBeenCalled();
    expect(readFileSync(marker(), "utf8")).toBe("{ broken");
    expect(ctx.broadcast).not.toHaveBeenCalled();
  });

  it("refuses a threshold outside 0–100 and keeps automatic compaction on", async () => {
    mkdirSync(join(root, ".kaif"), { recursive: true });
    writeFileSync(marker(), JSON.stringify({ agents: ["kimi-code"] }));
    boundary.settings.set("kaif.forcePercent", 140);
    const ctx = context();

    const result = await setAutoCompact({ enabled: false }, ctx as never);

    expect(result).toMatchObject({ ok: false, enabled: true });
    expect(ctx.harness.setConfig).not.toHaveBeenCalled();
    expect(JSON.parse(readFileSync(marker(), "utf8"))).toEqual({ agents: ["kimi-code"] });
  });

  it("turns automatic compaction off in a project without KAIF and says so", async () => {
    const ctx = context();

    await expect(setAutoCompact({ enabled: false }, ctx as never)).resolves.toEqual({ ok: true, enabled: false, kaif: "absent" });
    expect(engineAutoCompact).toBe(false);
  });

  it("turns automatic compaction back on without touching the marker", async () => {
    mkdirSync(join(root, ".kaif"), { recursive: true });
    writeFileSync(marker(), JSON.stringify({ agents: ["kimi-code"] }));
    engineAutoCompact = false;
    const ctx = context();

    await expect(setAutoCompact({ enabled: true }, ctx as never)).resolves.toEqual({ ok: true, enabled: true });
    expect(ctx.harness.setConfig).toHaveBeenCalledWith({ loopControl: { autoCompact: true } });
    expect(JSON.parse(readFileSync(marker(), "utf8"))).toEqual({ agents: ["kimi-code"] });
  });

  it("reports the engine value when the config write fails", async () => {
    const ctx = context();
    ctx.harness.setConfig.mockRejectedValueOnce(new Error("config is read-only"));

    await expect(setAutoCompact({ enabled: false }, ctx as never)).resolves.toEqual({
      ok: false,
      enabled: true,
      error: "config is read-only",
    });
  });
});

describe("AUTO STEER setting", () => {
  it("writes the user-level kimi.autoSteer setting", async () => {
    await expect(updateExtensionSetting({ key: "autoSteer", value: false }, context() as never)).resolves.toEqual({ ok: true });
    expect(boundary.update).toHaveBeenCalledWith("autoSteer", false, 1);
  });
});
