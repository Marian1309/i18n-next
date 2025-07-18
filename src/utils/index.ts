"use server";

import { isFailure, tryCatch } from "@pidchashyi/try-catch";
import { promises as fs } from "fs";
import path from "path";
import {
  SupportedLanguages,
  I18nConfigFactory,
  I18nProviderConfig,
  FlatTranslations,
} from "../types";

export const loadTranslations = async (lang: string) => {
  const filePath = path.join(
    process.cwd(),
    "src",
    "i18n",
    "locales",
    `${lang}.json`
  );
  const result = await tryCatch(fs.readFile(filePath, "utf-8"));

  if (isFailure(result)) {
    return {};
  }

  return JSON.parse(result.data);
};

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
