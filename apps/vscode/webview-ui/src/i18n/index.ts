import { useCallback } from "react";

import type { InterfaceLanguage } from "shared/types";
import { useSettingsStore } from "@/stores/settings.store";
import { en, type TranslationKey } from "./en";
import { ru } from "./ru";
import { zh } from "./zh";

export type { TranslationKey } from "./en";
export type TranslateParams = Record<string, string | number>;

export const dictionaries: Record<InterfaceLanguage, Record<TranslationKey, string>> = { en, zh, ru };

export function translate(language: InterfaceLanguage, key: TranslationKey, params?: TranslateParams): string {
  const template = Object.hasOwn(dictionaries, language) ? dictionaries[language][key] : en[key];
  if (params === undefined) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (params[name] === undefined ? match : String(params[name])));
}

export function t(key: TranslationKey, params?: TranslateParams): string {
  return translate(useSettingsStore.getState().extensionConfig.language, key, params);
}

export function useT(): (key: TranslationKey, params?: TranslateParams) => string {
  const language = useSettingsStore((state) => state.extensionConfig.language);
  return useCallback((key: TranslationKey, params?: TranslateParams) => translate(language, key, params), [language]);
}
