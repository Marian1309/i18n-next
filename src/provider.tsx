import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";

import { I18nClient } from "./client";
import { loadTranslations } from "./actions";
import {
  SupportedLanguages,
  FlatTranslations,
  I18nProviderConfig,
} from "./types";

interface Properties {
  children: ReactNode;
  config: I18nProviderConfig<SupportedLanguages>;
}

export const I18nProvider = async ({ children, config }: Properties) => {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")
    ?.value as SupportedLanguages[number];

  const languageJsonData = await loadTranslations(language);

  return (
    <I18nClient
      config={{
        ...config,
        initialLanguage: language,
        json: languageJsonData as FlatTranslations,
      }}
    >
      <Toaster />
      {children}
    </I18nClient>
  );
};
