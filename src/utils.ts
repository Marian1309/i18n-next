'use server';

import { promises as fs } from 'fs';
import path from 'path';

export const loadTranslations = async (lang: string) => {
  try {
    const filePath = path.join(process.cwd(), 'src', 'i18n', 'locales', `${lang}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to load translations for ${lang}`);
    return {};
  }
};
