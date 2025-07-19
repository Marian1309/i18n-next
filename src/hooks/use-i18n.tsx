"use client";

import { useContext } from "react";

import { I18nContext } from "../context";
import { I18nContextType } from "../types";

const useI18n = <
  TTranslations extends Record<string, any> = Record<string, any>
>(): I18nContextType<TTranslations> => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context as unknown as I18nContextType<TTranslations>;
};

export const createTypedI18nHook = <
  TTranslations extends Record<string, any>
>() => {
  return () => useI18n<TTranslations>();
};
