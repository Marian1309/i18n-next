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

export const useTranslationManager = (
  config: LanguageConfig<SupportedLanguages, FlatTranslations>
) => {
  const [language, setLanguage] = useState<SupportedLanguages[number]>(
    config.initialLanguage
  );
  const [translations, setTranslations] = useState<FlatTranslations>(
    config.json
  );
  const [isChangingLocale, setIsChangingLocale] = useState(false);
  const currentLanguageRef = useRef<SupportedLanguages[number]>(
    config.initialLanguage
  );
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      setLanguage(config.initialLanguage);
      setTranslations(config.json);
      currentLanguageRef.current = config.initialLanguage;
      isMountedRef.current = true;
    }
  }, [config.initialLanguage, config.json]);

  useEffect(() => {
    currentLanguageRef.current = language;
  }, [language]);

  useEffect(() => {
    const initTranslations = async () => {
      try {
        const loadedTranslations = await loadTranslations(language);
        if (currentLanguageRef.current === language) {
          setTranslations(loadedTranslations as FlatTranslations);
        }
      } catch (error) {
        console.error("Failed to load initial translations:", error);
      }
    };
    initTranslations();
  }, [language]);

  const handleTranslationSave = useCallback(
    async (key: TranslationKeys<Record<string, any>>, newValue: string) => {
      const prevTranslations = translations;
      try {
        const updatedTranslations = {
          ...translations,
          [key]: newValue,
        } as FlatTranslations;
        setTranslations(updatedTranslations);

        const result = await updateTranslationAction(language, key, newValue);

        if (result.success && currentLanguageRef.current === language) {
          const freshTranslations = await loadTranslations(language);
          if (freshTranslations[key] === newValue) {
            toast.success("Translation saved");
          } else {
            setTranslations(freshTranslations as FlatTranslations);
          }
        }
      } catch (error) {
        console.error("Failed to save translation:", error);
        setTranslations(prevTranslations);
        toast.error("Failed to save translation");
        throw error;
      }
    },
    [language, translations]
  );

  const changeLanguage = useCallback(
    async (newLang: SupportedLanguages[number]) => {
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
        const newTranslations = await loadTranslations(newLang);

        await changeLanguageAction(newLang, config);

        setLanguage(newLang);
        setTranslations(newTranslations as FlatTranslations);
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
