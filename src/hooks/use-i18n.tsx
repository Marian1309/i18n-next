"use client";

import { useContext } from "react";

import { I18nContext } from "../context";
import {
  SupportedLanguages,
  FlatTranslations,
  I18nContextType,
} from "../types";

export const useI18n = <
  TLanguages extends SupportedLanguages = string[],
  TTranslations extends FlatTranslations = FlatTranslations
>(): I18nContextType<TLanguages, TTranslations> => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context as unknown as I18nContextType<TLanguages, TTranslations>;
};

// Convenience function for creating typed hooks
export const createTypedI18nHook = <
  TTranslations extends FlatTranslations
>() => {
  return () => useI18n<string[], TTranslations>();
};
