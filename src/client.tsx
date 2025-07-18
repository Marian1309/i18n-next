"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Input } from "./components/input";

import { changeLanguageAction, updateTranslationAction } from "./actions";
import {
  I18nContextType,
  Language,
  LanguageConfig,
  TranslationKey,
} from "./types";
import { loadTranslations } from "./utils";
import toast from "react-hot-toast";

const I18nContext = createContext<I18nContextType | undefined>(undefined);

type EditableTranslationProps = {
  translationKey: string;
  value: string;
  language: string;
  onSave: (key: string, newValue: string) => Promise<void>;
};

const EditableTranslation = ({
  translationKey,
  value,
  language,
  onSave,
}: EditableTranslationProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedValue(value);
    setIsEditing(false);
    setIsSaving(false);
  }, [value, language]);

  const handleDoubleClick = () => {
    if (!isSaving) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (editedValue === value || isSaving) return;

    setIsSaving(true);
    try {
      await onSave(translationKey, editedValue);
      setIsEditing(false);
    } catch (error) {
      setEditedValue(value); // Revert on error
      toast.error("Failed to save translation");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditedValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={editedValue}
        onChange={(e) => setEditedValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={isSaving}
        autoFocus
        className={isSaving ? "cursor-wait opacity-50" : ""}
      />
    );
  }

  return (
    <span
      onDoubleClick={handleDoubleClick}
      className={isSaving ? "cursor-wait opacity-50" : "cursor-text"}
    >
      {value}
    </span>
  );
};

export const I18nClient = ({
  config,
  children,
}: {
  config: LanguageConfig;
  children: ReactNode;
}) => {
  const [language, setLanguage] = useState(config.initialLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>(
    config.json
  );
  const [isChangingLocale, setIsChangingLocale] = useState(false);
  const currentLanguageRef = useRef(config.initialLanguage);
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
          setTranslations(loadedTranslations);
        }
      } catch (error) {
        console.error("Failed to load initial translations:", error);
      }
    };
    initTranslations();
  }, [language]);

  const handleTranslationSave = useCallback(
    async (key: string, newValue: string) => {
      const prevTranslations = translations;
      try {
        // Optimistically update UI
        const updatedTranslations = { ...translations, [key]: newValue };
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
            setTranslations(freshTranslations);
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
    async (newLang: Language) => {
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
        await changeLanguageAction(newLang, config);

        // Then update state
        setLanguage(newLang);
        setTranslations(newTranslations);
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

  const t = useCallback(
    (key: TranslationKey) => {
      const value = translations[key];

      if (!value) {
        return (
          <span className="animate-[pulse_2s_ease-in-out_infinite] rounded-xl px-2 py-1 font-bold text-red-500">
            {key}
          </span>
        );
      }

      return (
        <EditableTranslation
          key={`${language}:${key}`}
          translationKey={key}
          value={value}
          language={language}
          onSave={handleTranslationSave}
        />
      );
    },
    [translations, handleTranslationSave, language]
  );

  return (
    <I18nContext.Provider value={{ t, language, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
};
