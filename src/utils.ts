"use server";

import { isFailure, tryCatch } from "@pidchashyi/try-catch";
import { promises as fs } from "fs";
import path from "path";

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
