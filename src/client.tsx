"use client";

import { ReactNode, useCallback } from "react";

import { I18nContext } from "./context";
import { TranslationDisplay } from "./components";
import { useTranslationManager } from "./hooks";
import { interpolateVariables } from "./lib/cn";
import type {
  LanguageConfig,
  SupportedLanguages,
  FlatTranslations,
  I18nContextType,
  TranslationKeys,
  InterpolationVariables,
} from "./types";

type Properties = {
  config: LanguageConfig<SupportedLanguages, FlatTranslations>;
  children: ReactNode;
};

export const I18nClient = ({ config, children }: Properties) => {
  const { language, translations, handleTranslationSave, changeLanguage } =
    useTranslationManager(config);

  const t = useCallback(
    (
      key: TranslationKeys<Record<string, any>>,
      variables?: InterpolationVariables
    ) => {
      const value = translations[key];
      const rawValue = value || `Missing translation: ${key}`;
      const interpolatedValue = interpolateVariables(rawValue, variables);

      return (
        <TranslationDisplay
          translationKey={key}
          value={interpolatedValue}
          language={language}
          onSave={handleTranslationSave}
          enabled={config.enabled ?? true}
        />
      );
    },
    [translations, handleTranslationSave, language, config.enabled]
  );

  return (
    <I18nContext.Provider
      value={
        {
          t,
          language,
          changeLanguage,
          enabled: config.enabled ?? true,
        } as I18nContextType<SupportedLanguages, Record<string, any>>
      }
    >
      {children}
    </I18nContext.Provider>
  );
};
