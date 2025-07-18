import type { ReactNode } from "react";

export type LanguageConfig = {
  initialLanguage: string;
  supportedLanguages: string[];
  json: Record<string, string>;
};

export type I18nContextType = {
  t: (key: string) => ReactNode;
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
};
