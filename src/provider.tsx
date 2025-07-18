import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";

import { I18nClient } from "./client";
import { Language } from "./types";
import { loadTranslations } from "./utils";

interface Properties {
  children: ReactNode;
  config: {
    initialLanguage: Language;
    supportedLanguages: Language[];
  };
}

export const I18nProvider = async ({ children, config }: Properties) => {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value as Language;

  const json = await loadTranslations(language);

  return (
    <I18nClient
      config={{
        ...config,
        initialLanguage: language,
        json,
      }}
    >
      <Toaster />
      {children}
    </I18nClient>
  );
};
