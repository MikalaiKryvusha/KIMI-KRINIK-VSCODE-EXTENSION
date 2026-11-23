import { access, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import * as vscode from "vscode";

import { Events, Methods } from "../../shared/bridge";
import type { AutoCompactResult, ExtensionSettingUpdate, KaifProjection, KaifThresholds } from "../../shared/types";
import { VSCodeSettings } from "../config/vscode-settings";
import type { Handler, HandlerContext } from "./types";

const updateExtensionSetting: Handler<ExtensionSettingUpdate, { ok: boolean }> = async (params) => {
  await vscode.workspace.getConfiguration("kimi").update(params.key, params.value, vscode.ConfigurationTarget.Global);
  return { ok: true };
};

const getAutoCompact: Handler<void, AutoCompactResult> = async (_, ctx) => {
  return { ok: true, enabled: await engineAutoCompact(ctx) };
};

const setAutoCompact: Handler<{ enabled: boolean }, AutoCompactResult> = async (params, ctx) => {
  let kaif: KaifProjection | undefined;
  try {
    if (!params.enabled) kaif = await projectKaifThresholds(ctx.workDir, VSCodeSettings.kaifThresholds);
    await ctx.harness.setConfig({ loopControl: { autoCompact: params.enabled } });
  } catch (error) {
    ctx.logError("Unable to change Auto Compact", error);
    return { ok: false, enabled: await engineAutoCompact(ctx), error: error instanceof Error ? error.message : String(error) };
  }
  const enabled = await engineAutoCompact(ctx);
  ctx.broadcast(Events.AutoCompactChanged, { enabled });
  if (enabled !== params.enabled) {
    return { ok: false, enabled, error: "The engine config did not take the Auto Compact change." };
  }
  return kaif === undefined ? { ok: true, enabled } : { ok: true, enabled, kaif };
};

async function engineAutoCompact(ctx: HandlerContext): Promise<boolean> {
  const config = await ctx.harness.getConfig({ reload: true });
  return config.loopControl?.autoCompact !== false;
}

async function projectKaifThresholds(workDir: string | null, thresholds: KaifThresholds): Promise<KaifProjection> {
  for (const [name, value] of Object.entries(thresholds)) {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new Error(`The KAIF threshold ${name} must be a number from 0 to 100; it is ${String(value)}.`);
    }
  }
  const marker = workDir === null ? undefined : await findKaifMarker(workDir);
  if (marker === undefined) return "absent";
  const data: unknown = JSON.parse((await readFile(marker, "utf8")).replace(/^﻿/, ""));
  if (!isRecord(data)) throw new Error(`${marker} does not hold a JSON object.`);
  const contextWindow = isRecord(data["contextWindow"]) ? data["contextWindow"] : {};
  const projected = { ...data, contextWindow: { ...contextWindow, ...thresholds } };
  const staging = `${marker}.${process.pid}.tmp`;
  await writeFile(staging, `${JSON.stringify(projected, null, 2)}\n`, "utf8");
  await rename(staging, marker);
  return "projected";
}

async function findKaifMarker(start: string): Promise<string | undefined> {
  for (let dir = start; ; dir = dirname(dir)) {
    const candidate = join(dir, ".kaif", "kaif.json");
    if (await exists(candidate)) return candidate;
    if (dirname(dir) === dir) return undefined;
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const behaviorHandlers = {
  [Methods.UpdateExtensionSetting]: updateExtensionSetting,
  [Methods.GetAutoCompact]: getAutoCompact,
  [Methods.SetAutoCompact]: setAutoCompact,
};
