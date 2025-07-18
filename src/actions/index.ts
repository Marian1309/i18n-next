"use server";

import { cookies } from "next/headers";

import { promises as fs } from "fs";
import path from "path";

import { tryCatch } from "@pidchashyi/try-catch";
import { isFailure } from "@pidchashyi/try-catch";

import { flattenTranslations } from "../lib/cn";
import type {
  LanguageConfig,
  SupportedLanguages,
  FlatTranslations,
} from "../types";

export const changeLanguageAction = async (
  lang: string,
  config: LanguageConfig<SupportedLanguages, FlatTranslations>
) => {
  if (!config.supportedLanguages.includes(lang)) {
    throw new Error(`Unsupported language: ${lang}`);
  }

  const cookieStore = await cookies();
  cookieStore.set("language", lang, { path: "/", maxAge: 365 * 24 * 60 * 60 });
};

export const updateTranslationAction = async (
  lang: string,
  key: string,
  newValue: string
) => {
  const filePath = path.join(
    process.cwd(),
    "src",
    "i18n",
    "locales",
    `${lang}.json`
  );

  const fileContent = await tryCatch(fs.readFile(filePath, "utf-8"));

  if (isFailure(fileContent)) {
    throw new Error("Failed to read file");
  }

  const translations = JSON.parse(fileContent.data);

  // Handle nested keys by setting the value at the correct path
  const keys = key.split(".");
  let current = translations;

  // Navigate to the parent object
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }

  // Set the final value
  current[keys[keys.length - 1]] = newValue;

  await fs.writeFile(filePath, JSON.stringify(translations, null, 2) + "\n");

  return { success: true, translations };
};

export const loadTranslations = async (lang: string) => {
  const filePath = path.join(
    process.cwd(),
    "src",
    "i18n",
    "locales",
    `${lang}.json`
  );
  const result = await tryCatch(fs.readFile(filePath, "utf-8"));

  if (isFailure(result)) {
    return {};
  }

  const nestedTranslations = JSON.parse(result.data);

  // Flatten the nested translations into dot notation
  return flattenTranslations(nestedTranslations);
};
