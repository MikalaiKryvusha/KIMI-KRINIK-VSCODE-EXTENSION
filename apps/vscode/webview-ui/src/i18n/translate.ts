import type { InterfaceLanguage } from "shared/types";
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
