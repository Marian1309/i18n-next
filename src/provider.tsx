import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";

import { I18nClient } from "./client";
import { loadTranslations } from "./utils";

interface Properties {
  children: ReactNode;
  config: {
    initialLanguage: string;
    supportedLanguages: string[];
  };
}

export const I18nProvider = async ({ children, config }: Properties) => {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value as string;

  const languageJsonData = await loadTranslations(language);

  return (
    <I18nClient
      config={{
        ...config,
        initialLanguage: language,
        json: languageJsonData,
      }}
    >
      <Toaster />
      {children}
    </I18nClient>
  );
};
