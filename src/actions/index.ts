"use server";

import { cookies } from "next/headers";

import { promises as fs } from "fs";
import path from "path";

import { tryCatch } from "@pidchashyi/try-catch";
import { isFailure } from "@pidchashyi/try-catch";

import type { LanguageConfig } from "../types";

export const changeLanguageAction = async (
  lang: string,
  config: LanguageConfig
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

  translations[key] = newValue;

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

  return JSON.parse(result.data);
};
