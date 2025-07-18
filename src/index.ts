export { I18nProvider } from "./provider";
export { I18nClient } from "./client";
export { useI18n, createTypedI18nHook } from "./hooks/use-i18n";
export { TranslationDisplay } from "./components/translation-display";
export { EditableTranslation } from "./components/editable-translation";

// Type-safe utilities
export {
  createI18nConfig,
  defineLanguages,
  defineTranslations,
  isValidLanguage,
  loadTranslations,
} from "./utils";

// Core types
export type {
  SupportedLanguages,
  TranslationKeys,
  NestedKeyOf,
  TranslationValue,
  FlatTranslations,
  LanguageConfig,
  I18nContextType,
  I18nProviderConfig,
  InferTranslations,
  TypedI18nHook,
  I18nConfigFactory,
} from "./types";

// Re-export hooks and components
export * from "./hooks";
export * from "./components";
