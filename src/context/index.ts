"use client";

import { createContext } from "react";

import {
  I18nContextType,
  SupportedLanguages,
  FlatTranslations,
} from "../types";

export const I18nContext = createContext<I18nContextType<any, any> | undefined>(
  undefined
);
