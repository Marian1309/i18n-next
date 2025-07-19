import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "./input";

type EditableTranslationProps<TKey extends string = string> = {
  translationKey: TKey;
  value: string;
  language: string;
  onSave: (key: TKey, newValue: string) => Promise<void>;
};

export const EditableTranslation = <TKey extends string = string>({
  translationKey,
  value,
  language,
  onSave,
}: EditableTranslationProps<TKey>) => {
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
    if (isSaving || value.trim() === `Missing translation: ${translationKey}`) {
      return;
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedValue === value || isSaving) return;

    setIsSaving(true);
    try {
      await onSave(translationKey, editedValue);
      setIsEditing(false);
    } catch (error) {
      setEditedValue(value);
      toast.error("Failed to save translation");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlur = () => {
    setEditedValue(value);
    setIsEditing(false);
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
