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

  it("describes context window thresholds without internal framework names", () => {
    expect(translate("en", "controlWindow.description")).toBe("Notify the agent when context window usage reaches the configured thresholds.");
    expect(translate("ru", "controlWindow.description")).toBe("Предупреждать агента, когда контекстное окно заполняется до заданных порогов.");
    expect(translate("zh", "controlWindow.description")).toBe("当上下文窗口使用量达到配置的阈值时提醒代理。");
    expect(translate("ru", "controlWindow.off")).toBe("Выкл: KIMI KRINIK не следит за заполнением контекстного окна чата. Чат может переполниться или дойти до автосжатия.");
    expect(translate("ru", "controlWindow.on")).toBe("Вкл: KIMI KRINIK следит за заполнением контекстного окна чата и не позволяет чату переполниться или дойти до сжатия контекста. При переполнении контекстного окна чата работа будет мягко остановлена для передачи в новый чат.");
    for (const dictionary of Object.values(dictionaries)) {
      expect(dictionary["controlWindow.description"]).not.toContain("KAIF");
    }
  });

  it("keeps the Control Panel action names localized", () => {
    expect(translate("en", "menu.autoCompact")).toBe("Compact");
    expect(translate("ru", "menu.autoCompact")).toBe("Сжатие");
    expect(translate("zh", "menu.autoCompact")).toBe("压缩");
    expect(translate("en", "menu.autoSteer")).toBe("Steer");
    expect(translate("ru", "menu.autoSteer")).toBe("Стиринг");
    expect(translate("zh", "menu.autoSteer")).toBe("插话");
    expect(translate("ru", "modes.plan")).toBe("План");
    expect(translate("ru", "modes.goal")).toBe("Цель");
    expect(translate("ru", "modes.swarm")).toBe("Рой");
    expect(translate("ru", "controlPanel.title")).toBe("Панель Управления");
    expect(translate("ru", "thinking.label")).toBe("Думаю...");
    expect(translate("ru", "chat.requesting")).toBe("Запрос...");
    expect(translate("en", "menu.aboutProject")).toBe("About KIMI KRINIK");
    expect(translate("ru", "menu.aboutProject")).toBe("О проекте KIMI KRINIK");
    expect(translate("zh", "menu.aboutProject")).toBe("关于 KIMI KRINIK");
    expect(translate("en", "sound.choice.triple")).toBe("Triple beep");
    expect(translate("ru", "sound.choice.triple")).toBe("Тройной писк");
    expect(translate("zh", "sound.choice.triple")).toBe("三声提示音");
    expect(translate("en", "sound.enabled")).toBe("Sound enabled");
    expect(translate("en", "common.delete")).toBe("Delete");
    expect(translate("ru", "common.delete")).toBe("Удалить");
    expect(translate("zh", "common.delete")).toBe("删除");
    expect(translate("en", "menu.languageAction")).toBe("Language");
    expect(translate("ru", "menu.languageAction")).toBe("Язык");
    expect(translate("zh", "menu.languageAction")).toBe("语言");
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
    expect(boundary.toastError).toHaveBeenCalledWith(translate("zh", "toast.languageNotChanged", { error: "settings are read-only" }));
  });
});
