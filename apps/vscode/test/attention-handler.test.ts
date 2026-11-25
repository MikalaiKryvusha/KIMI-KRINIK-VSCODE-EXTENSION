import { EventEmitter } from "node:events";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  get: vi.fn(),
  inspect: vi.fn(),
  showWarningMessage: vi.fn(),
  spawn: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.mock("node:child_process", () => ({ spawn: boundary.spawn }));
vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return { ...actual, writeFileSync: boundary.writeFileSync };
});
vi.mock("vscode", () => ({
  window: { showWarningMessage: boundary.showWarningMessage },
  workspace: {
    getConfiguration: () => ({ get: boundary.get, inspect: boundary.inspect }),
  },
}));

import { attentionHandlers } from "../src/handlers/attention.handler";
import { Methods } from "../shared/bridge";

const handler = attentionHandlers[Methods.NotifyAttention]!;
let workDir: string;
let approvals: Map<string, unknown>;
let workspaceState: { get: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
let logError: ReturnType<typeof vi.fn>;
let phraseFiles: Set<string>;

function context() {
  return { workDir, workspaceState, logError } as never;
}

function installWorkspaceCommand() {
  mkdirSync(join(workDir, ".kaif"), { recursive: true });
  writeFileSync(join(workDir, ".kaif", "kaif.json"), JSON.stringify({
    contour: { voiceFileTool: ["pythonw.exe", "-I", "say.py", "--file", "{file}"] },
  }));
}

function phraseFile(call = 0): string {
  const [, args] = boundary.spawn.mock.calls[call]!;
  const file = args[args.length - 1] as string;
  phraseFiles.add(file);
  return file;
}

beforeEach(async () => {
  workDir = mkdtempSync(join(tmpdir(), "kaif-attention-handler-"));
  approvals = new Map();
  phraseFiles = new Set();
  logError = vi.fn();
  workspaceState = {
    get: vi.fn((key: string) => approvals.get(key)),
    update: vi.fn(async (key: string, value: unknown) => {
      approvals.set(key, value);
    }),
  };
  boundary.get.mockReset();
  boundary.get.mockReturnValue([]);
  boundary.inspect.mockReset();
  boundary.inspect.mockReturnValue({ globalValue: [] });
  boundary.showWarningMessage.mockReset();
  boundary.showWarningMessage.mockResolvedValue("Allow");
  boundary.spawn.mockReset();
  boundary.spawn.mockImplementation(() => {
    const child = Object.assign(new EventEmitter(), { unref: vi.fn() });
    process.nextTick(() => child.emit("spawn"));
    return child;
  });
  boundary.writeFileSync.mockReset();
  const actual = await vi.importActual<typeof import("node:fs")>("node:fs");
  boundary.writeFileSync.mockImplementation(actual.writeFileSync);
  delete process.env["KAIF_VOICE_FILE_TOOL"];
});

afterEach(() => {
  for (const file of phraseFiles) rmSync(file, { force: true });
  rmSync(workDir, { recursive: true, force: true });
  delete process.env["KAIF_VOICE_FILE_TOOL"];
});

describe("Glass attention handler", () => {
  it("asks once for the workspace command and reuses its approval", async () => {
    installWorkspaceCommand();

    await expect(handler({ message: "First" }, context())).resolves.toEqual({ ok: true });
    await expect(handler({ message: "Second" }, context())).resolves.toEqual({ ok: true });

    expect(boundary.showWarningMessage).toHaveBeenCalledTimes(1);
    expect(workspaceState.update).toHaveBeenCalledTimes(1);
    expect(boundary.spawn).toHaveBeenCalledTimes(2);
    for (let call = 0; call < 2; call += 1) {
      boundary.spawn.mock.results[call]!.value.emit("exit", 0);
      expect(existsSync(phraseFile(call))).toBe(false);
    }
  });

  it("uses only the machine setting before a workspace command", async () => {
    installWorkspaceCommand();
    boundary.get.mockReturnValue(["workspace.exe", "{file}"]);
    boundary.inspect.mockReturnValue({
      globalValue: ["machine.exe", "{file}"],
      workspaceValue: ["workspace.exe", "{file}"],
    });

    await expect(handler({ message: "Machine only" }, context())).resolves.toEqual({ ok: true });

    expect(boundary.inspect).toHaveBeenCalledWith("attentionVoiceCommand");
    expect(boundary.get).not.toHaveBeenCalled();
    expect(boundary.spawn.mock.calls[0]![0]).toBe("machine.exe");
    expect(boundary.showWarningMessage).not.toHaveBeenCalled();
    boundary.spawn.mock.results[0]!.value.emit("exit", 0);
  });

  it("does not run a workspace command when approval is declined", async () => {
    installWorkspaceCommand();
    boundary.showWarningMessage.mockResolvedValue(undefined);
    const writesAfterFixture = boundary.writeFileSync.mock.calls.length;

    await expect(handler({ message: "Declined" }, context())).resolves.toEqual({ ok: false });

    expect(boundary.spawn).not.toHaveBeenCalled();
    expect(boundary.writeFileSync).toHaveBeenCalledTimes(writesAfterFixture);
  });

  it("writes the phrase to the temp directory and deletes it on child exit", async () => {
    installWorkspaceCommand();

    await expect(handler({ message: "Glass is required" }, context())).resolves.toEqual({ ok: true });

    const [command, args] = boundary.spawn.mock.calls[0]!;
    expect(command).toBe("pythonw.exe");
    expect(args.slice(0, 3)).toEqual(["-I", "say.py", "--file"]);
    const file = phraseFile();
    expect(file.startsWith(join(tmpdir(), "kimi-code-kaif-attention"))).toBe(true);
    expect(file.startsWith(workDir)).toBe(false);
    expect(readFileSync(file, "utf8")).toBe("Glass is required\n");
    boundary.spawn.mock.results[0]!.value.emit("exit", 0);
    expect(existsSync(file)).toBe(false);
  });

  it("deletes the phrase and logs a child error", async () => {
    installWorkspaceCommand();
    const child = Object.assign(new EventEmitter(), { unref: vi.fn() });
    boundary.spawn.mockReturnValue(child);
    const error = new Error("spawn failed");

    const pending = handler({ message: "Failure" }, context());
    await vi.waitFor(() => expect(boundary.spawn).toHaveBeenCalledTimes(1));
    const file = phraseFile();
    child.emit("error", error);

    await expect(pending).resolves.toEqual({ ok: false });
    expect(logError).toHaveBeenCalledWith("Unable to spawn attention voice command", error);
    expect(existsSync(file)).toBe(false);
  });

  it("cleans up and logs a synchronous spawn failure", async () => {
    installWorkspaceCommand();
    const error = new Error("invalid executable");
    boundary.spawn.mockImplementationOnce(() => {
      throw error;
    });

    await expect(handler({ message: "Failure" }, context())).resolves.toEqual({ ok: false });

    expect(logError).toHaveBeenCalledWith("Unable to spawn attention voice command", error);
    expect(existsSync(phraseFile())).toBe(false);
  });

  it("logs a phrase write failure without spawning", async () => {
    installWorkspaceCommand();
    const error = new Error("disk full");
    boundary.writeFileSync.mockImplementationOnce(() => {
      throw error;
    });

    await expect(handler({ message: "Failure" }, context())).resolves.toEqual({ ok: false });

    expect(logError).toHaveBeenCalledWith("Unable to write attention phrase file", error);
    expect(boundary.spawn).not.toHaveBeenCalled();
  });

  it("declares the configured command as machine-scoped", () => {
    const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    expect(manifest.contributes.configuration.properties["kimi.attentionVoiceCommand"].scope).toBe("machine");
  });

  it("reports unavailable instead of inventing a tone", async () => {
    await expect(handler({ message: "No voice configured" }, { workDir: null, workspaceState, logError } as never)).resolves.toEqual({ ok: false });
    expect(boundary.spawn).not.toHaveBeenCalled();
  });
});
