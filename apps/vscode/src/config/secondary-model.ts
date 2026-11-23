import { readFile, rename, rm, writeFile } from "node:fs/promises";
import { createKimiConfigRpc } from "@moonshot-ai/kimi-code-sdk";
import type { SecondaryModelSelection } from "../../shared/legacy-sdk";

export async function persistSecondaryModelSelection(
  configPath: string,
  selection: SecondaryModelSelection | null,
): Promise<void> {
  const text = await readFile(configPath, "utf8");
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const stripped = stripTomlSection(text, "secondary_model").trimEnd();
  const section = selection === null ? [] : [
    "[secondary_model]",
    `model = ${JSON.stringify(selection.model)}`,
    ...(selection.defaultEffort === undefined ? [] : [`default_effort = ${JSON.stringify(selection.defaultEffort)}`]),
  ];
  const next = section.length === 0
    ? `${stripped}${eol}${eol}`
    : `${stripped}${stripped.length > 0 ? eol + eol : ""}${section.join(eol)}${eol}`;
  await createKimiConfigRpc().validateConfigToml({ text: next, filePath: configPath });
  const temporary = `${configPath}.tmp-${process.pid}`;
  try {
    await writeFile(temporary, next, { encoding: "utf8", mode: 0o600 });
    await rename(temporary, configPath);
  } catch (error) {
    await rm(temporary, { force: true }).catch(() => undefined);
    throw error;
  }
}

export function stripTomlSection(text: string, section: string): string {
  const header = `[${section}]`;
  const subPrefix = `[${section}.`;
  const lines = text.split("\n");
  const out: string[] = [];
  let skipping = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === header) {
      skipping = true;
      continue;
    }
    if (skipping && trimmed.startsWith("[") && trimmed.endsWith("]")) {
      skipping = trimmed.startsWith(subPrefix);
      if (skipping) continue;
    }
    if (!skipping) out.push(line);
  }
  return out.join("\n");
}
