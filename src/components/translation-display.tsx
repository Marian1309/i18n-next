import { EditableTranslation } from "./editable-translation";

type TranslationDisplayProps<TKey extends string = string> = {
  translationKey: TKey;
  template: string | undefined; // Original template with placeholders
  interpolatedValue: string | undefined; // Interpolated display value
  language: string;
  onSave: (key: TKey, newValue: string) => Promise<void>;
  enabled?: boolean;
};

export const TranslationDisplay = <TKey extends string = string>({
  translationKey,
  template,
  interpolatedValue,
  language,
  onSave,
  enabled = true,
}: TranslationDisplayProps<TKey>) => {
  if (!template || !interpolatedValue) {
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
      template={template}
      interpolatedValue={interpolatedValue}
      language={language}
      onSave={onSave}
      enabled={enabled}
    />
  );
};
