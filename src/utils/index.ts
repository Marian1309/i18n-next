import {
  SupportedLanguages,
  I18nConfigFactory,
  I18nProviderConfig,
  FlatTranslations,
} from "../types";

// Type-safe factory for creating i18n configurations
export const createI18nConfig = <TLanguages extends SupportedLanguages>(
  languages: TLanguages
): I18nConfigFactory<TLanguages> => {
  return {
    languages,
    createConfig: (
      initialLanguage: TLanguages[number]
    ): I18nProviderConfig<TLanguages> => ({
      initialLanguage,
      supportedLanguages: languages,
    }),
  };
};

// Helper to define supported languages with type safety
export const defineLanguages = <T extends readonly string[]>(
  languages: T
): T => {
  return languages;
};

// Helper to infer translation types from a sample translation object
export const defineTranslations = <T extends FlatTranslations>(
  translations: T
): T => {
  return translations;
};

// Utility to validate that a language is supported
export const isValidLanguage = <TLanguages extends SupportedLanguages>(
  language: string,
  supportedLanguages: TLanguages
): language is TLanguages[number] => {
  return supportedLanguages.includes(language as TLanguages[number]);
};
