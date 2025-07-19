import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "./input";
import { cn } from "../lib/cn";

type EditableTranslationProps<TKey extends string = string> = {
  translationKey: TKey;
  value: string;
  language: string;
  onSave: (key: TKey, newValue: string) => Promise<void>;
  enabled?: boolean;
};

export const EditableTranslation = <TKey extends string = string>({
  translationKey,
  value,
  language,
  onSave,
  enabled = false,
}: EditableTranslationProps<TKey>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setEditedValue(value);
    setIsEditing(false);
    setIsSaving(false);
  }, [value, language]);

  const canEdit = () => {
    return (
      enabled && !isSaving && value !== `Missing translation: ${translationKey}`
    );
  };

  const startEditing = () => {
    if (!canEdit()) return;
    setIsEditing(true);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startEditing();
  };

  const handleClick = (e: React.MouseEvent) => {
    // Ctrl/Cmd + Click to edit
    if ((e.ctrlKey || e.metaKey) && canEdit()) {
      e.preventDefault();
      e.stopPropagation();
      startEditing();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!canEdit()) return;
    e.preventDefault();
    e.stopPropagation();
    startEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter or Space to start editing when focused
    if ((e.key === "Enter" || e.key === " ") && canEdit() && !isEditing) {
      e.preventDefault();
      e.stopPropagation();
      startEditing();
    }
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

  const handleInputBlur = () => {
    setEditedValue(value);
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
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
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        disabled={isSaving}
        autoFocus
        className={isSaving ? "cursor-wait opacity-50" : ""}
      />
    );
  }

  return (
    <span
      ref={spanRef}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={enabled ? 0 : undefined}
      role={enabled ? "button" : undefined}
      aria-label={enabled ? `Edit translation: ${value}` : undefined}
      title={
        enabled ? "Double-click, Ctrl+click, or right-click to edit" : undefined
      }
      className={cn(
        value === `Missing translation: ${translationKey}` &&
          "text-red-500 animate-pulse font-bold",
        isSaving && "cursor-wait opacity-50",
        enabled &&
          "cursor-pointer hover:bg-gray-100 hover:rounded px-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:rounded"
      )}
    >
      {value}
    </span>
  );
};
