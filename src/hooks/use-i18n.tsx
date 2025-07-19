"use client";

import { useContext } from "react";

import { I18nContext } from "../context";
import { I18nContextType, SupportedLanguages } from "../types";

const useI18n = <
  TSupportedLanguages extends SupportedLanguages = SupportedLanguages,
  TTranslations extends Record<string, any> = Record<string, any>
>(): I18nContextType<TSupportedLanguages, TTranslations> => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context as unknown as I18nContextType<
    TSupportedLanguages,
    TTranslations
  >;
};

export const createTypedI18nHook = <
  TSupportedLanguages extends SupportedLanguages = SupportedLanguages,
  TTranslations extends Record<string, any> = Record<string, any>
>() => {
  return () => useI18n<TSupportedLanguages, TTranslations>();
};
