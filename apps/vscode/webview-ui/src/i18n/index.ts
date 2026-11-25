import { useCallback } from "react";

import { useSettingsStore } from "@/stores/settings.store";
import { translate, type TranslateParams, type TranslationKey } from "./translate";

export { dictionaries, translate, type TranslateParams, type TranslationKey } from "./translate";

export function t(key: TranslationKey, params?: TranslateParams): string {
  return translate(useSettingsStore.getState().extensionConfig.language, key, params);
}

export function useT(): (key: TranslationKey, params?: TranslateParams) => string {
  const language = useSettingsStore((state) => state.extensionConfig.language);
  return useCallback((key: TranslationKey, params?: TranslateParams) => translate(language, key, params), [language]);
}
