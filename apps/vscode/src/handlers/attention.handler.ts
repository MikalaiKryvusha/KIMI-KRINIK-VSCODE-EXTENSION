import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as vscode from "vscode";

import { Methods } from "../../shared/bridge";
import type { Handler } from "./types";

interface NotifyAttentionParams {
  message: string;
}

const WORKSPACE_VOICE_APPROVAL_KEY = "kimi.attentionVoiceCommandApproved";

export function attentionVoiceCommand(workDir: string | null): string[] | null {
  const fromEnvironment = parseCommand(process.env["KAIF_VOICE_FILE_TOOL"]);
  if (fromEnvironment !== null) return fromEnvironment;
  const configured = vscode.workspace.getConfiguration("kimi").inspect<string[]>("attentionVoiceCommand")?.globalValue ?? [];
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

function writeAttentionLog(message: string): string {
  const directory = join(tmpdir(), "kimi-code-kaif-attention");
  mkdirSync(directory, { recursive: true });
  const file = join(directory, `attention-${Date.now()}.txt`);
  writeFileSync(file, `${message.trim()}\n`, "utf8");
  return file;
}

export const attentionHandlers: Record<string, Handler<NotifyAttentionParams, { ok: boolean }>> = {
  [Methods.NotifyAttention]: async (params, ctx) => {
    const machineCommand = attentionVoiceCommand(null);
    const command = machineCommand ?? attentionVoiceCommand(ctx.workDir);
    if (command === null) return { ok: false };
    if (machineCommand === null) {
      const serializedCommand = JSON.stringify(command);
      if (ctx.workspaceState.get<string>(WORKSPACE_VOICE_APPROVAL_KEY) !== serializedCommand) {
        const approval = await vscode.window.showWarningMessage(
          "KIMI KRINIK: This workspace defines an attention voice command in .kaif/kaif.json. Allow it to run for attention notifications?",
          { modal: true },
          "Allow",
        );
        if (approval !== "Allow") return { ok: false };
        try {
          await ctx.workspaceState.update(WORKSPACE_VOICE_APPROVAL_KEY, serializedCommand);
        } catch (error) {
          ctx.logError("Unable to persist attention voice command approval", error);
          return { ok: false };
        }
      }
    }

    let phraseFile: string;
    try {
      phraseFile = writeAttentionLog(params.message);
    } catch (error) {
      ctx.logError("Unable to write attention phrase file", error);
      return { ok: false };
    }
    const cleanup = () => {
      try {
        rmSync(phraseFile, { force: true });
      } catch (error) {
        ctx.logError("Unable to remove attention phrase file", error);
      }
    };

    let child: ReturnType<typeof spawn>;
    try {
      child = spawn(command[0]!, command.slice(1).map((part) => part.replaceAll("{file}", phraseFile)), {
        cwd: ctx.workDir ?? tmpdir(),
        detached: true,
        stdio: ["ignore", "ignore", "ignore"],
        windowsHide: true,
      });
    } catch (error) {
      cleanup();
      ctx.logError("Unable to spawn attention voice command", error);
      return { ok: false };
    }
    const launched = await new Promise<boolean>((resolve) => {
      child.once("error", (error) => {
        cleanup();
        ctx.logError("Unable to spawn attention voice command", error);
        resolve(false);
      });
      child.once("exit", cleanup);
      child.once("spawn", () => resolve(true));
      child.unref();
    });
    return { ok: launched };
  },
};
