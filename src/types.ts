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

export type InterpolationVariables = Record<string, string | number>;

export type LanguageConfig<
  TLanguages extends SupportedLanguages = string[],
  TTranslations extends FlatTranslations = FlatTranslations
> = {
  initialLanguage: TLanguages[number];
  supportedLanguages: TLanguages;
  json: TTranslations;
  enabled?: boolean;
};

export type I18nContextType<
  TSupportedLanguages extends SupportedLanguages = SupportedLanguages,
  TTranslations extends Record<string, any> = Record<string, any>
> = {
  t: (
    key: TranslationKeys<TTranslations>,
    variables?: InterpolationVariables
  ) => ReactNode;
  language: TSupportedLanguages[number];
  changeLanguage: (lang: TSupportedLanguages[number]) => Promise<void>;
  enabled?: boolean;
};

export type I18nProviderConfig<TLanguages extends SupportedLanguages> = {
  initialLanguage: TLanguages[number];
  supportedLanguages: TLanguages;
  enabled?: boolean;
};

export type TypedI18nHook<
  TSupportedLanguages extends SupportedLanguages = SupportedLanguages,
  TTranslations extends Record<string, any> = Record<string, any>
> = () => I18nContextType<TSupportedLanguages, TTranslations>;
