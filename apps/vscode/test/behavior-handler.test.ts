import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  settings: new Map<string, unknown>(),
  update: vi.fn(),
  onDidChangeConfiguration: vi.fn(),
}));

vi.mock("vscode", () => ({
  ConfigurationTarget: { Global: 1 },
  workspace: {
    getConfiguration: () => ({
      get: (key: string, fallback: unknown) => (boundary.settings.has(key) ? boundary.settings.get(key) : fallback),
      update: boundary.update,
    }),
    onDidChangeConfiguration: boundary.onDidChangeConfiguration,
  },
}));

import { behaviorHandlers, syncContextWindowOwnership } from "../src/handlers/behavior.handler";
import { onSettingsChange } from "../src/config/vscode-settings";
import { Events, Methods, validateRpcMessage } from "../shared/bridge";
import { CONTROL_PANEL_BUTTONS, normalizeControlPanelOrder } from "../shared/types";
import { DEFAULT_SOUND_SETTINGS } from "../shared/sounds";

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
  boundary.onDidChangeConfiguration.mockReset();
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

  it("uses the independent controller without requiring a KAIF marker", async () => {
    boundary.settings.set("contextWindowControl", true);
    const ctx = context();

    await expect(setAutoCompact({ enabled: false }, ctx as never)).resolves.toEqual({ ok: true, enabled: false });
    expect(engineAutoCompact).toBe(false);
  });

  it("hands a valid KAIF marker to KIMI KRINIK and back without losing fields", async () => {
    mkdirSync(join(root, ".kaif"), { recursive: true });
    writeFileSync(marker(), JSON.stringify({ agents: ["kimi-code"], custom: true, contextWindow: { tokens: 123456, custom: "keep" } }));
    boundary.settings.set("kaif.warnPercent", 72);

    await expect(syncContextWindowOwnership(workDir, true)).resolves.toBe("projected");
    const owned = JSON.parse(readFileSync(marker(), "utf8"));
    expect(owned).toMatchObject({ agents: ["kimi-code"], custom: true });
    expect(owned.contextWindow).toEqual({
      tokens: 123456,
      custom: "keep",
      warnPct: 72,
      cutPct: 75,
      closePct: 80,
      forcePct: 90,
      owner: "kimi-krinik",
    });

    await expect(syncContextWindowOwnership(workDir, false)).resolves.toBe("projected");
    const returned = JSON.parse(readFileSync(marker(), "utf8"));
    expect(returned.contextWindow.owner).toBeUndefined();
    expect(returned.contextWindow).toMatchObject({ tokens: 123456, custom: "keep", warnPct: 72 });
    expect(returned.custom).toBe(true);
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

  it("writes the global sound-enabled setting and validates it", async () => {
    await expect(updateExtensionSetting({ key: "soundEnabled", value: false }, context() as never)).resolves.toEqual({ ok: true });
    expect(boundary.update).toHaveBeenCalledWith("soundEnabled", false, 1);
    expect(validateRpcMessage({ id: "sound", method: Methods.UpdateExtensionSetting, params: { key: "soundEnabled", value: false } }).ok).toBe(true);
    expect(validateRpcMessage({ id: "sound", method: Methods.UpdateExtensionSetting, params: { key: "soundEnabled", value: "false" } }).ok).toBe(false);
  });

  it("validates custom General Settings updates", () => {
    const message = (params: unknown) => validateRpcMessage({ id: "general", method: Methods.UpdateExtensionSetting, params });
    expect(message({ key: "autosave", value: false }).ok).toBe(true);
    expect(message({ key: "useCtrlEnterToSend", value: true }).ok).toBe(true);
    expect(message({ key: "showThinkingContent", value: false }).ok).toBe(true);
    expect(message({ key: "autosave", value: "false" }).ok).toBe(false);
    expect(message({ key: "editorContext", value: "onConversationStart" }).ok).toBe(true);
    expect(message({ key: "editorContext", value: "always" }).ok).toBe(false);
  });

  it("serializes sound writes so the last value is written last", async () => {
    let release!: () => void;
    boundary.update.mockImplementationOnce(() => new Promise<void>((resolve) => { release = resolve; })).mockResolvedValueOnce(undefined);
    const first = updateExtensionSetting({ key: "sounds", value: { ...DEFAULT_SOUND_SETTINGS, approval: { sound: "chime", volume: 10 } } }, context() as never);
    const second = updateExtensionSetting({ key: "sounds", value: { ...DEFAULT_SOUND_SETTINGS, approval: { sound: "chime", volume: 100 } } }, context() as never);

    await vi.waitFor(() => expect(boundary.update).toHaveBeenCalledTimes(1));
    release();
    await first;
    await second;
    expect(boundary.update.mock.calls.map((call) => call[1])).toEqual([
      { ...DEFAULT_SOUND_SETTINGS, approval: { sound: "chime", volume: 10 } },
      { ...DEFAULT_SOUND_SETTINGS, approval: { sound: "chime", volume: 100 } },
    ]);
  });
});

describe("Control Panel and Context Window settings", () => {
  it("normalizes an older or incomplete order without losing buttons", () => {
    expect(normalizeControlPanelOrder(["skills", "skills", "unknown"])).toEqual([
      "skills",
      ...CONTROL_PANEL_BUTTONS.filter((button) => button !== "skills"),
    ]);
    expect(normalizeControlPanelOrder(undefined)).toEqual(CONTROL_PANEL_BUTTONS);
  });

  it("broadcasts Control Panel order changes from another window", () => {
    let listener: ((event: { affectsConfiguration: (key: string) => boolean }) => void) | undefined;
    boundary.onDidChangeConfiguration.mockImplementation((callback: typeof listener) => {
      listener = callback;
      return { dispose: vi.fn() };
    });
    const changed = vi.fn();
    onSettingsChange(changed);

    expect(listener).toBeDefined();
    listener!({ affectsConfiguration: (key) => key === "kimi" || key === "kimi.controlPanelOrder" });
    expect(changed).toHaveBeenCalledWith(["controlPanelOrder"]);
  });

  it("writes one nested user-level boolean without changing the feature value", async () => {
    await expect(updateExtensionSetting({ key: "controlPanel.plan", value: false }, context() as never)).resolves.toEqual({ ok: true });
    expect(boundary.update).toHaveBeenCalledWith("controlPanel.plan", false, 1);
  });

  it("writes and validates the complete Control Panel order", async () => {
    const value = CONTROL_PANEL_BUTTONS.toReversed();
    await expect(updateExtensionSetting({ key: "controlPanelOrder", value }, context() as never)).resolves.toEqual({ ok: true });
    expect(boundary.update).toHaveBeenCalledWith("controlPanelOrder", value, 1);
    const message = (params: unknown) => validateRpcMessage({ id: "order", method: Methods.UpdateExtensionSetting, params });
    expect(message({ key: "controlPanelOrder", value }).ok).toBe(true);
    expect(message({ key: "controlPanelOrder", value: [...value.slice(0, -1), value[0]] }).ok).toBe(false);
    expect(message({ key: "controlPanelOrder", value: [...value.slice(1), "unknown"] }).ok).toBe(false);
  });

  it("accepts only declared Control Panel booleans", () => {
    const message = (params: unknown) => validateRpcMessage({ id: "1", method: Methods.UpdateExtensionSetting, params });
    expect(message({ key: "controlPanel.swarm", value: false }).ok).toBe(true);
    expect(message({ key: "controlPanel.swarm", value: "false" }).ok).toBe(false);
    expect(message({ key: "controlPanel.attachments", value: false }).ok).toBe(false);
  });

  it("validates the independent toggle and numeric thresholds", () => {
    const message = (params: unknown) => validateRpcMessage({ id: "1", method: Methods.UpdateExtensionSetting, params });
    expect(message({ key: "contextWindowControl", value: true }).ok).toBe(true);
    expect(message({ key: "kaif.warnPercent", value: 72 }).ok).toBe(true);
    expect(message({ key: "kaif.warnPercent", value: 101 }).ok).toBe(false);
    expect(message({ key: "kaif.warnPercent", value: "72" }).ok).toBe(false);
  });

  it("exposes every configurable button as a default-on General setting", () => {
    const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
      contributes: { configuration: { properties: Record<string, { type: string; default: unknown }> } };
    };
    const properties = manifest.contributes.configuration.properties;
    for (const button of CONTROL_PANEL_BUTTONS) {
      expect(properties[`kimi.controlPanel.${button}`], button).toMatchObject({ type: "boolean", default: true });
    }
    expect(properties["kimi.controlPanel.attachments"]).toBeUndefined();
    expect(properties["kimi.controlPanel.model"]).toBeUndefined();
    expect(properties["kimi.controlPanelOrder"]).toMatchObject({ type: "array", default: CONTROL_PANEL_BUTTONS });
    expect(CONTROL_PANEL_BUTTONS.slice(0, 3)).toEqual(["permission", "skills", "compact"]);
  });
});
