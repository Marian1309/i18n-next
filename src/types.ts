import type { ReactNode } from "react";

export type SupportedLanguages = readonly string[];

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

export type TranslationKeys<T extends Record<string, any>> = LeafKeys<T>;

export type TranslationValue = string | Record<string, any>;

export type FlatTranslations = Record<string, string>;

export type FlattenTranslationType<T extends Record<string, any>> = {
  [K in LeafKeys<T>]: string;
};

export type LanguageConfig<
  TLanguages extends SupportedLanguages = string[],
  TTranslations extends FlatTranslations = FlatTranslations
> = {
  initialLanguage: TLanguages[number];
  supportedLanguages: TLanguages;
  json: TTranslations;
};

export type I18nContextType<
  TTranslations extends Record<string, any> = Record<string, any>
> = {
  t: (key: TranslationKeys<TTranslations>) => ReactNode;
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
};

export type I18nProviderConfig<TLanguages extends SupportedLanguages> = {
  initialLanguage: TLanguages[number];
  supportedLanguages: TLanguages;
};

export type TypedI18nHook<TTranslations extends Record<string, any>> =
  () => I18nContextType<TTranslations>;
