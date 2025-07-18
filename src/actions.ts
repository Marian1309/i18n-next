'use server';

import { cookies } from 'next/headers';

import { promises as fs } from 'fs';
import path from 'path';

import type { Language, LanguageConfig } from './types';

export const changeLanguageAction = async (lang: Language, config: LanguageConfig) => {
  if (!config.supportedLanguages.includes(lang)) {
    throw new Error(`Unsupported language: ${lang}`);
  }

  const cookieStore = await cookies();
  cookieStore.set('language', lang, { path: '/', maxAge: 365 * 24 * 60 * 60 });
};

export const updateTranslationAction = async (
  lang: Language,
  key: string,
  newValue: string
) => {
  try {
    const filePath = path.join(process.cwd(), 'src', 'i18n', 'locales', `${lang}.json`);

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const translations = JSON.parse(fileContent);

    translations[key] = newValue;

    await fs.writeFile(filePath, JSON.stringify(translations, null, 2) + '\n');

    return { success: true, translations };
  } catch (error) {
    console.error('Failed to update translation:', error);
    throw new Error('Failed to update translation');
  }
};
