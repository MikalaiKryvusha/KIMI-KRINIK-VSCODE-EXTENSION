import { EventEmitter } from "node:events";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({ spawn: vi.fn() }));

vi.mock("node:child_process", () => ({ spawn: boundary.spawn }));
vi.mock("vscode", () => ({
  workspace: {
    getConfiguration: () => ({ get: () => [] }),
  },
}));

import { attentionHandlers } from "../src/handlers/attention.handler";
import { Methods } from "../shared/bridge";

const handler = attentionHandlers[Methods.NotifyAttention]!;
let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), "kaif-attention-handler-"));
  boundary.spawn.mockReset();
  boundary.spawn.mockImplementation(() => {
    const child = Object.assign(new EventEmitter(), { unref: vi.fn() });
    process.nextTick(() => child.emit("spawn"));
    return child;
  });
  delete process.env["KAIF_VOICE_FILE_TOOL"];
});

afterEach(() => {
  rmSync(workDir, { recursive: true, force: true });
  delete process.env["KAIF_VOICE_FILE_TOOL"];
});

describe("Glass attention handler", () => {
  it("uses the workspace contour voiceFileTool and logs the phrase", async () => {
    mkdirSync(join(workDir, ".kaif"), { recursive: true });
    writeFileSync(join(workDir, ".kaif", "kaif.json"), JSON.stringify({
      contour: { voiceFileTool: ["pythonw.exe", "-I", "say.py", "--file", "{file}"] },
    }));

    await expect(handler({ message: "Glass is required" }, { workDir } as never)).resolves.toEqual({ ok: true });

    const [command, args] = boundary.spawn.mock.calls[0]!;
    expect(command).toBe("pythonw.exe");
    expect(args.slice(0, 3)).toEqual(["-I", "say.py", "--file"]);
    const phraseFile = args[3];
    expect(phraseFile).toContain(join("voice", "attention-"));
    expect(readFileSync(phraseFile, "utf8")).toBe("Glass is required\n");
  });

  it("reports unavailable instead of inventing a tone", async () => {
    await expect(handler({ message: "No voice configured" }, { workDir: null } as never)).resolves.toEqual({ ok: false });
    expect(boundary.spawn).not.toHaveBeenCalled();
  });
});
