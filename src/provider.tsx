import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";

import { I18nClient } from "./client";
import { loadTranslations } from "./utils";
import {
  SupportedLanguages,
  FlatTranslations,
  I18nProviderConfig,
} from "./types";

interface Properties<
  TLanguages extends SupportedLanguages = string[],
  TTranslations extends FlatTranslations = FlatTranslations
> {
  children: ReactNode;
  config: I18nProviderConfig<TLanguages>;
}

export const I18nProvider = async <
  TLanguages extends SupportedLanguages = string[],
  TTranslations extends FlatTranslations = FlatTranslations
>({
  children,
  config,
}: Properties<TLanguages, TTranslations>) => {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value as TLanguages[number];

  const languageJsonData = await loadTranslations(language);

  return (
    <I18nClient<TLanguages, TTranslations>
      config={{
        ...config,
        initialLanguage: language,
        json: languageJsonData as TTranslations,
      }}
    >
      <Toaster />
      {children}
    </I18nClient>
  );
};
