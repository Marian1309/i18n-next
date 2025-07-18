import type { ReactNode } from "react";

export type Language = "en" | "uk";

export type LanguageConfig = {
  initialLanguage: Language;
  supportedLanguages: Language[];
  json: Record<string, string>;
};

export type I18nContextType = {
  t: (key: string) => ReactNode;
  language: Language;
  changeLanguage: (lang: Language) => Promise<void>;
};
