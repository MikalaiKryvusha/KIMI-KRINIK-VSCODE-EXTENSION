import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../webview-ui/src/styles/index.css", import.meta.url), "utf8");

describe("VS Code theme background", () => {
  it("uses the sidebar background with editor fallback for body and root", () => {
    expect(css).toContain("--background: var(--vscode-sideBar-background, var(--vscode-editor-background));");
    expect(css).toMatch(/#root\s*\{[^}]*background-color:\s*var\(--background\);/s);
  });

  it("keeps card, popover and input surfaces distinct from the page background", () => {
    expect(css).toContain("--card: oklch(0.18 0.005 285.823);");
    expect(css).toContain("--popover: oklch(0.18 0.005 285.823);");
    expect(css).toContain("--input: oklch(0.274 0.006 286.033);");
    expect(css).not.toContain("--card: var(--vscode-sideBar-background");
    expect(css).not.toContain("--popover: var(--vscode-sideBar-background");
    expect(css).not.toContain("--input: var(--vscode-sideBar-background");
  });
});
