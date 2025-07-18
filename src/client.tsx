"use client";

import { ReactNode, useCallback } from "react";

import { I18nContext } from "./context";
import { TranslationDisplay } from "./components";
import { useTranslationManager } from "./hooks";
import type {
  LanguageConfig,
  SupportedLanguages,
  FlatTranslations,
  I18nContextType,
  TranslationKeys,
} from "./types";

type Properties = {
  config: LanguageConfig<SupportedLanguages, FlatTranslations>;
  children: ReactNode;
};

export const I18nClient = ({ config, children }: Properties) => {
  const { language, translations, handleTranslationSave, changeLanguage } =
    useTranslationManager(config);

  const t = useCallback(
    (key: TranslationKeys<Record<string, any>>) => {
      const value = translations[key];

      return (
        <TranslationDisplay
          translationKey={key}
          value={value || `Missing translation: ${key}`}
          language={language}
          onSave={handleTranslationSave}
        />
      );
    },
    [translations, handleTranslationSave, language]
  );

  return (
    <I18nContext.Provider
      value={
        {
          t,
          language,
          changeLanguage,
        } as I18nContextType<Record<string, any>>
      }
    >
      {children}
    </I18nContext.Provider>
  );
};
