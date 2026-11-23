import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as vscode from "vscode";

import { Methods } from "../../shared/bridge";
import type { Handler } from "./types";

interface NotifyAttentionParams {
  message: string;
}

export function attentionVoiceCommand(workDir: string | null): string[] | null {
  const fromEnvironment = parseCommand(process.env["KAIF_VOICE_FILE_TOOL"]);
  if (fromEnvironment !== null) return fromEnvironment;
  const configured = vscode.workspace.getConfiguration("kimi").get<string[]>("attentionVoiceCommand", []);
  if (configured.length > 0) return configured;
  if (workDir === null) return null;
  try {
    const marker: unknown = JSON.parse(readFileSync(join(workDir, ".kaif", "kaif.json"), "utf8").replace(/^\uFEFF/, ""));
    return parseCommand(contourVoiceFileTool(marker));
  } catch {
    return null;
  }
}

function contourVoiceFileTool(marker: unknown): unknown {
  if (typeof marker !== "object" || marker === null || !("contour" in marker)) return undefined;
  const { contour } = marker;
  if (typeof contour !== "object" || contour === null || !("voiceFileTool" in contour)) return undefined;
  return contour.voiceFileTool;
}

function parseCommand(value: unknown): string[] | null {
  if (Array.isArray(value) && value.length > 0 && value.every((part) => typeof part === "string")) return value;
  if (typeof value !== "string") return null;
  try {
    return parseCommand(JSON.parse(value));
  } catch {
    return null;
  }
}

function writeAttentionLog(workDir: string | null, message: string): string {
  const directory = workDir === null ? join(tmpdir(), "kimi-code-kaif-attention") : join(workDir, "voice");
  mkdirSync(directory, { recursive: true });
  const file = join(directory, `attention-${Date.now()}.txt`);
  writeFileSync(file, `${message.trim()}\n`, "utf8");
  return file;
}

export const attentionHandlers: Record<string, Handler<NotifyAttentionParams, { ok: boolean }>> = {
  [Methods.NotifyAttention]: async (params, ctx) => {
    const command = attentionVoiceCommand(ctx.workDir);
    if (command === null) return { ok: false };
    const phraseFile = writeAttentionLog(ctx.workDir, params.message);
    const child = spawn(command[0]!, command.slice(1).map((part) => part.replaceAll("{file}", phraseFile)), {
      cwd: ctx.workDir ?? tmpdir(),
      detached: true,
      stdio: ["ignore", "ignore", "ignore"],
      windowsHide: true,
    });
    const launched = await new Promise<boolean>((resolve) => {
      child.once("error", () => resolve(false));
      child.once("spawn", () => resolve(true));
      child.unref();
    });
    return { ok: launched };
  },
};
