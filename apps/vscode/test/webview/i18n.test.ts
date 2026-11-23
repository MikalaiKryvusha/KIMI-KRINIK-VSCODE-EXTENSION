import { describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  updateExtensionSetting: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/services", () => ({
  bridge: { updateExtensionSetting: boundary.updateExtensionSetting },
}));
vi.mock("@/components/ui/sonner", () => ({
  toast: { error: boundary.toastError, warning: vi.fn() },
}));

import { dictionaries, t, translate } from "../../webview-ui/src/i18n";
import { en } from "../../webview-ui/src/i18n/en";
import { DEFAULT_EXTENSION_CONFIG, useSettingsStore } from "../../webview-ui/src/stores/settings.store";

function placeholders(text: string): string[] {
  return [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]!).toSorted();
}

describe("interface dictionaries", () => {
  it("give every language the same key set as English", () => {
    const keys = Object.keys(en).toSorted();
    for (const [language, dictionary] of Object.entries(dictionaries)) {
      expect(Object.keys(dictionary).toSorted(), language).toEqual(keys);
    }
  });

  it("keep the same placeholders and no empty text in every translation", () => {
    for (const [language, dictionary] of Object.entries(dictionaries)) {
      for (const [key, text] of Object.entries(dictionary)) {
        expect(text.trim(), `${language} ${key}`).not.toBe("");
        expect(placeholders(text), `${language} ${key}`).toEqual(placeholders(en[key as keyof typeof en]));
      }
    }
  });

  it("interpolates parameters and keeps an unknown placeholder visible", () => {
    expect(translate("en", "header.newConversation")).toBe("New Conversation");
    expect(translate("ru", "header.newConversation")).toBe("Новый диалог");
    expect("{missing}".replace(/\{(\w+)\}/g, (match) => match)).toBe("{missing}");
  });

  it("speaks English by default", () => {
    expect(DEFAULT_EXTENSION_CONFIG.language).toBe("en");
    useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG } });
    expect(t("menu.settings")).toBe("Settings");
  });
});

describe("language switch", () => {
  it("re-renders in the chosen language at once and persists it", async () => {
    boundary.updateExtensionSetting.mockReset();
    boundary.updateExtensionSetting.mockResolvedValue({ ok: true });
    useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG } });

    const change = useSettingsStore.getState().changeLanguage("ru");
    expect(t("menu.settings")).toBe("Настройки");
    await change;

    expect(boundary.updateExtensionSetting).toHaveBeenCalledWith({ key: "language", value: "ru" });
    expect(useSettingsStore.getState().extensionConfig.language).toBe("ru");
  });

  it("returns to the previous language when the setting could not be saved", async () => {
    boundary.updateExtensionSetting.mockReset();
    boundary.updateExtensionSetting.mockRejectedValue(new Error("settings are read-only"));
    useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, language: "zh" } });

    await useSettingsStore.getState().changeLanguage("ru");

    expect(useSettingsStore.getState().extensionConfig.language).toBe("zh");
    expect(boundary.toastError).toHaveBeenCalledWith("Language was not changed: settings are read-only");
  });
});
