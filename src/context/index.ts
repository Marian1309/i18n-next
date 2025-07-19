"use client";

import { createContext } from "react";

import { I18nContextType, SupportedLanguages } from "../types";

export const I18nContext = createContext<
  I18nContextType<SupportedLanguages, Record<string, any>> | undefined
>(undefined);
