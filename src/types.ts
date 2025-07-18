import type { ReactNode } from "react";

// Core generic types for type-safe i18n
export type SupportedLanguages = readonly string[];

// Extract all leaf keys from nested objects with dot notation (max depth 5)
export type LeafKeys<
  T,
  Prev extends string = "",
  Depth extends readonly any[] = []
> = Depth["length"] extends 5
  ? `${Prev}${keyof T & string}`
  : {
      [K in keyof T & string]: T[K] extends Record<string, any>
        ? T[K] extends any[] | Date | Function
          ? `${Prev}${K}`
          : LeafKeys<T[K], `${Prev}${K}.`, [...Depth, any]>
        : `${Prev}${K}`;
    }[keyof T & string];

// Use LeafKeys to infer all possible translation keys (including nested)
export type TranslationKeys<T extends Record<string, any>> = LeafKeys<T>;

// Translation value type (supports nested objects)
export type TranslationValue = string | Record<string, any>;
export type FlatTranslations = Record<string, TranslationValue>;

// Generic language configuration
export type LanguageConfig<
  TLanguages extends SupportedLanguages = string[],
  TTranslations extends FlatTranslations = FlatTranslations
> = {
  initialLanguage: TLanguages[number];
  supportedLanguages: TLanguages;
  json: TTranslations;
};

// Generic i18n context type
export type I18nContextType<
  TLanguages extends SupportedLanguages = string[],
  TTranslations extends FlatTranslations = FlatTranslations
> = {
  t: (key: TranslationKeys<TTranslations>) => ReactNode;
  language: TLanguages[number];
  changeLanguage: (lang: TLanguages[number]) => Promise<void>;
};

// Configuration for library consumers
export type I18nProviderConfig<TLanguages extends SupportedLanguages> = {
  initialLanguage: TLanguages[number];
  supportedLanguages: TLanguages;
};

// Utility types for translation file inference
export type InferTranslations<T> = T extends Record<string, infer U>
  ? U extends string
    ? T
    : FlatTranslations
  : FlatTranslations;

// Helper type for creating strongly typed i18n hooks
export type TypedI18nHook<TTranslations extends FlatTranslations> =
  () => I18nContextType<string[], TTranslations>;

// Factory type for creating typed configurations
export interface I18nConfigFactory<TLanguages extends SupportedLanguages> {
  languages: TLanguages;
  createConfig: (
    initialLanguage: TLanguages[number]
  ) => I18nProviderConfig<TLanguages>;
}
