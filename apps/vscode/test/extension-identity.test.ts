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
});
