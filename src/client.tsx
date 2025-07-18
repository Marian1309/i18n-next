"use client";

import { ReactNode, useCallback } from "react";

import { TranslationDisplay } from "./components/translation-display";
import { useTranslationManager } from "./hooks/use-translation-manager";
import { LanguageConfig } from "./types";
import { I18nContext } from "./context";

interface Properties {
  config: LanguageConfig;
  children: ReactNode;
}

export const I18nClient = ({ config, children }: Properties) => {
  const { language, translations, handleTranslationSave, changeLanguage } =
    useTranslationManager(config);

  const t = useCallback(
    (key: string) => {
      const value = translations[key];

      return (
        <TranslationDisplay
          translationKey={key}
          value={value}
          language={language}
          onSave={handleTranslationSave}
        />
      );
    },
    [translations, handleTranslationSave, language]
  );

  return (
    <I18nContext.Provider value={{ t, language, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};
