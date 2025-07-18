"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { changeLanguageAction, updateTranslationAction } from "../actions";
import {
  LanguageConfig,
  SupportedLanguages,
  FlatTranslations,
  TranslationKeys,
} from "../types";
import { loadTranslations } from "../actions";

export const useTranslationManager = <
  TLanguages extends SupportedLanguages = string[],
  TTranslations extends FlatTranslations = FlatTranslations
>(
  config: LanguageConfig<TLanguages, TTranslations>
) => {
  const [language, setLanguage] = useState<TLanguages[number]>(
    config.initialLanguage
  );
  const [translations, setTranslations] = useState<TTranslations>(config.json);
  const [isChangingLocale, setIsChangingLocale] = useState(false);
  const currentLanguageRef = useRef<TLanguages[number]>(config.initialLanguage);
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      setLanguage(config.initialLanguage);
      setTranslations(config.json);
      currentLanguageRef.current = config.initialLanguage;
      isMountedRef.current = true;
    }
  }, [config.initialLanguage, config.json]);

  // Keep translations in sync with language changes
  useEffect(() => {
    currentLanguageRef.current = language;
  }, [language]);

  // Ensure translations are loaded when component mounts or language changes
  useEffect(() => {
    const initTranslations = async () => {
      try {
        const loadedTranslations = await loadTranslations(language);
        if (currentLanguageRef.current === language) {
          setTranslations(loadedTranslations as TTranslations);
        }
      } catch (error) {
        console.error("Failed to load initial translations:", error);
      }
    };
    initTranslations();
  }, [language]);

  const handleTranslationSave = useCallback(
    async (key: TranslationKeys<TTranslations>, newValue: string) => {
      const prevTranslations = translations;
      try {
        // Optimistically update UI
        const updatedTranslations = {
          ...translations,
          [key]: newValue,
        } as TTranslations;
        setTranslations(updatedTranslations);

        // Save to file
        const result = await updateTranslationAction(language, key, newValue);

        if (result.success && currentLanguageRef.current === language) {
          // Verify the update was successful
          const freshTranslations = await loadTranslations(language);
          if (freshTranslations[key] === newValue) {
            toast.success("Translation saved");
          } else {
            // If the file content doesn't match what we expect, reload translations
            setTranslations(freshTranslations as TTranslations);
          }
        }
      } catch (error) {
        console.error("Failed to save translation:", error);
        // Revert to previous state
        setTranslations(prevTranslations);
        toast.error("Failed to save translation");
        throw error;
      }
    },
    [language, translations]
  );

  const changeLanguage = useCallback(
    async (newLang: TLanguages[number]) => {
      if (!config.supportedLanguages.includes(newLang) || isChangingLocale) {
        console.warn(
          `Unsupported language or locale change in progress: ${newLang}`
        );
        return;
      }

      setIsChangingLocale(true);
      const prevLang = language;
      const prevTranslations = translations;

      try {
        // Load new translations before changing the language
        const newTranslations = await loadTranslations(newLang);

        // Update cookie first
        await changeLanguageAction(
          newLang,
          config as unknown as LanguageConfig<string[], TTranslations>
        );

        // Then update state
        setLanguage(newLang);
        setTranslations(newTranslations as TTranslations);
      } catch (error) {
        console.error("Failed to change language:", error);
        // Revert to previous state
        setLanguage(prevLang);
        setTranslations(prevTranslations);
        toast.error("Failed to change language");
      } finally {
        setIsChangingLocale(false);
      }
    },
    [config, language, translations, isChangingLocale]
  );

  return {
    language,
    translations,
    handleTranslationSave,
    changeLanguage,
  };
};
