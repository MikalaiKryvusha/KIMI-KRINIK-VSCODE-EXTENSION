import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { persistSecondaryModelSelection } from "../src/config/secondary-model";

let root: string;
let configPath: string;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "kimi-secondary-model-"));
  configPath = join(root, "config.toml");
  await writeFile(configPath, [
    "[loop_control]",
    "auto_compact = false",
    "",
    "[secondary_model]",
    'model = "old"',
    'default_effort = "high"',
    "",
    "[secondary_model.models]",
    'old = "old"',
    "",
  ].join("\n"), "utf8");
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

describe("secondary model persistence", () => {
  it("replaces the whole recipe with one existing model and clears stale tuning", async () => {
    await persistSecondaryModelSelection(configPath, { model: "plain" });
    const text = await readFile(configPath, "utf8");

    expect(text).toContain("[loop_control]\nauto_compact = false");
    expect(text).toContain('[secondary_model]\nmodel = "plain"');
    expect(text).not.toContain('model = "old"');
    expect(text).not.toContain("default_effort");
    expect(text).not.toContain("[secondary_model.models]");
  });

  it("removes the recipe for Follow main model without touching other sections", async () => {
    await persistSecondaryModelSelection(configPath, null);
    const text = await readFile(configPath, "utf8");

    expect(text).toBe("[loop_control]\nauto_compact = false\n\n");
  });
});
