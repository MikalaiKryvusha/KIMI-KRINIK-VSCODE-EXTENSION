import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../webview-ui/src/styles/index.css", import.meta.url), "utf8");
const tooltip = readFileSync(new URL("../webview-ui/src/components/ui/tooltip.tsx", import.meta.url), "utf8");

describe("VS Code theme background", () => {
  it("uses the sidebar background with editor fallback for body and root", () => {
    expect(css).toContain("--background: var(--vscode-sideBar-background, var(--vscode-editor-background));");
    expect(css).toMatch(/#root\s*\{[^}]*background-color:\s*var\(--background\);/s);
  });

  it("keeps card, popover and input surfaces distinct from the page background", () => {
    expect(css).toContain("--card: oklch(0.18 0.005 285.823);");
    expect(css).toContain(
      "--popover: var(--vscode-menu-background, var(--vscode-editorWidget-background, oklch(0.18 0.005 285.823)));",
    );
    expect(css).toContain("--input: oklch(0.274 0.006 286.033);");
    expect(css).not.toContain("--card: var(--vscode-sideBar-background");
    expect(css).not.toContain("--popover: var(--vscode-sideBar-background");
    expect(css).not.toContain("--input: var(--vscode-sideBar-background");
  });
});

describe("VS Code theme popups", () => {
  it("draws popovers, menus and selects with the VS Code menu colors in both themes", () => {
    expect(css).toContain(
      "--popover: var(--vscode-menu-background, var(--vscode-editorWidget-background, oklch(1 0 0)));",
    );
    expect(css).toContain(
      "--popover-foreground: var(--vscode-menu-foreground, var(--vscode-editorWidget-foreground, oklch(0.141 0.005 285.823)));",
    );
    expect(css).toContain(
      "--popover-foreground: var(--vscode-menu-foreground, var(--vscode-editorWidget-foreground, oklch(0.985 0 0)));",
    );
  });

  it("draws tooltips and their arrow with the VS Code hover widget colors", () => {
    expect(css).toContain("--tooltip: var(--vscode-editorHoverWidget-background, oklch(0.18 0.005 285.823));");
    expect(css).toContain("--tooltip-foreground: var(--vscode-editorHoverWidget-foreground, oklch(0.985 0 0));");
    expect(css).toContain("--tooltip-border: var(--vscode-editorHoverWidget-border, oklch(0.274 0.006 286.033));");
    expect(css).toMatch(/@theme inline\s*\{[^}]*--color-tooltip: var\(--tooltip\);/s);
    expect(css).toMatch(/@theme inline\s*\{[^}]*--color-tooltip-foreground: var\(--tooltip-foreground\);/s);
    expect(css).toMatch(/@theme inline\s*\{[^}]*--color-tooltip-border: var\(--tooltip-border\);/s);

    expect(tooltip).toContain("bg-tooltip text-tooltip-foreground");
    expect(tooltip).toContain("bg-tooltip fill-tooltip");
    expect(tooltip).not.toContain("bg-foreground");
    expect(tooltip).not.toContain("text-background");
  });
});
