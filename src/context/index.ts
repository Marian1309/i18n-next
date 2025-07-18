"use client";

import { createContext } from "react";

import { I18nContextType } from "../types";

export const I18nContext = createContext<
  I18nContextType<Record<string, any>> | undefined
>(undefined);
