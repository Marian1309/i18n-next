"use client";

import { ReactNode, useCallback } from "react";

import { TranslationDisplay } from "./components/translation-display";
import { useTranslationManager } from "./hooks/use-translation-manager";
import {
  LanguageConfig,
  SupportedLanguages,
  FlatTranslations,
  TranslationKeys,
} from "./types";
import { I18nContext } from "./context";

interface Properties<
  TLanguages extends SupportedLanguages = string[],
  TTranslations extends FlatTranslations = FlatTranslations
> {
  config: LanguageConfig<TLanguages, TTranslations>;
  children: ReactNode;
}

export const I18nClient = <
  TLanguages extends SupportedLanguages = string[],
  TTranslations extends FlatTranslations = FlatTranslations
>({
  config,
  children,
}: Properties<TLanguages, TTranslations>) => {
  const { language, translations, handleTranslationSave, changeLanguage } =
    useTranslationManager(config);

  const t = useCallback(
    (key: TranslationKeys<TTranslations>) => {
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
