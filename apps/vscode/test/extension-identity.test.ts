import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import manifest from "../package.json";

describe("KAIF extension identity", () => {
  it("uses separate command, view and container IDs beside the official extension", () => {
    expect(manifest.name).toBe("kimi-code-kaif");
    expect(manifest.publisher).toBe("mikalai-kryvusha");
    expect(manifest.displayName).toBe("KIMI KRINIK");
    expect(manifest.contributes.commands.every((entry) => entry.command.startsWith("kimiKaif."))).toBe(true);
    expect(manifest.contributes.views["kimi-kaif-sidebar"]![0]!.id).toBe("kimiKaif.webview");
    expect(manifest.contributes.viewsContainers.activitybar![0]!.id).toBe("kimi-kaif-sidebar");
    expect(JSON.stringify(manifest.contributes)).not.toContain("kimi.webview");
  });

  it("shows the KIMI KRINIK brand in the tab, the view and every command", () => {
    expect(manifest.contributes.viewsContainers.activitybar![0]!.title).toBe("KIMI KRINIK");
    expect(manifest.contributes.views["kimi-kaif-sidebar"]![0]!.name).toBe("KIMI KRINIK");
    expect(manifest.contributes.configuration.title).toBe("KIMI KRINIK");
    expect(manifest.contributes.commands.every((entry) => entry.title.startsWith("KIMI KRINIK: "))).toBe(true);
  });

  it("uses the clipped-corner robot outline and sideways eyes in the Activity Bar", () => {
    const icon = readFileSync(new URL("../resources/kimi-icon.svg", import.meta.url), "utf8");
    expect(icon).toContain('d="M6 5H18L21 8V19H3V8L6 5Z"');
    expect(icon).toContain('fill="none"');
    expect(icon).toContain('stroke="currentColor"');
    expect(icon).toContain('stroke-width="2"');
    expect(icon).toContain('<rect x="9.5" y="7.5" width="2.25" height="4" fill="currentColor" />');
    expect(icon).toContain('<rect x="16.25" y="7.5" width="2.25" height="4" fill="currentColor" />');
    expect(icon).not.toContain("rx=");
    expect(icon).not.toContain('fill-rule="evenodd"');
  });
});
