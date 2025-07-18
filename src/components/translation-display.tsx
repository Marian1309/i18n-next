import { EditableTranslation } from "./editable-translation";

type TranslationDisplayProps<TKey extends string = string> = {
  translationKey: TKey;
  value: string | undefined;
  language: string;
  onSave: (key: TKey, newValue: string) => Promise<void>;
};

export const TranslationDisplay = <TKey extends string = string>({
  translationKey,
  value,
  language,
  onSave,
}: TranslationDisplayProps<TKey>) => {
  if (!value) {
    return (
      <span className="animate-[pulse_2s_ease-in-out_infinite] rounded-xl px-2 py-1 font-bold text-red-500">
        {translationKey}
      </span>
    );
  }

  return (
    <EditableTranslation
      key={`${language}:${translationKey}`}
      translationKey={translationKey}
      value={value}
      language={language}
      onSave={onSave}
    />
  );
};
