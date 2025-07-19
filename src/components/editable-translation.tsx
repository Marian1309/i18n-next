import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "./input";
import {
  cn,
  validatePlaceholders,
  hasPlaceholders,
  extractPlaceholders,
} from "../lib/cn";

type EditableTranslationProps<TKey extends string = string> = {
  translationKey: TKey;
  template: string; // Original template with placeholders
  interpolatedValue: string; // Interpolated display value
  language: string;
  onSave: (key: TKey, newValue: string) => Promise<void>;
  enabled?: boolean;
};

export const EditableTranslation = <TKey extends string = string>({
  translationKey,
  template,
  interpolatedValue,
  language,
  onSave,
  enabled = true,
}: EditableTranslationProps<TKey>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(template);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setEditedValue(template);
    setIsEditing(false);
    setIsSaving(false);
    setValidationError(null);
  }, [template, language]);

  // Ensure input gets focus when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      // Focus the input and place cursor at the end
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const canEdit = () => {
    return (
      enabled &&
      !isSaving &&
      interpolatedValue !== `Missing translation: ${translationKey}`
    );
  };

  const startEditing = () => {
    if (!canEdit()) return;
    setEditedValue(template); // Edit the template, not the interpolated value
    setValidationError(null);
    setIsEditing(true);
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
    if (editedValue === template || isSaving) return;

    // Validate placeholders if the original template has any
    if (hasPlaceholders(template)) {
      const validation = validatePlaceholders(template, editedValue);

      if (!validation.isValid) {
        const missingPlaceholders = validation.missingPlaceholders
          .map((p) => `{${p}}`)
          .join(", ");
        setValidationError(
          `Missing required placeholders: ${missingPlaceholders}`
        );
        return;
      }

      // Warn about extra placeholders but don't prevent saving
      if (validation.extraPlaceholders.length > 0) {
        const extraPlaceholders = validation.extraPlaceholders
          .map((p) => `{${p}}`)
          .join(", ");
        toast(`Warning: Added new placeholders: ${extraPlaceholders}`, {
          icon: "⚠️",
          duration: 4000,
        });
      }
    }

    setIsSaving(true);
    setValidationError(null);

    try {
      await onSave(translationKey, editedValue);
      setIsEditing(false);
    } catch (error) {
      setEditedValue(template);
      toast.error("Failed to save translation");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputBlur = () => {
    // Delay the blur handling to prevent race conditions with other events
    setTimeout(() => {
      // Check if the input is still mounted and should stay focused
      if (inputRef.current && document.activeElement === inputRef.current) {
        return; // Input is still focused, don't close
      }

      setEditedValue(template);
      setIsEditing(false);
      setValidationError(null);
    }, 10);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    // Prevent all key events from bubbling up to parent elements
    e.stopPropagation();

    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditedValue(template);
      setIsEditing(false);
      setValidationError(null);
    } else if (e.key === " ") {
      // Explicitly handle space key to prevent any interference
      e.stopPropagation();
      // Ensure input maintains focus after space is typed
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
    // Allow all other keys to work normally in the input
  };

  // Get placeholder hints for the title
  const placeholderHints = hasPlaceholders(template)
    ? `Available placeholders: ${extractPlaceholders(template)
        .map((p) => `{${p}}`)
        .join(", ")}`
    : "";

  if (isEditing) {
    return (
      <div className="relative inline-block">
        <Input
          ref={inputRef}
          value={editedValue}
          onChange={(e) => {
            setEditedValue(e.target.value);
            setValidationError(null); // Clear error on typing
          }}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          onClick={(e) => e.stopPropagation()} // Prevent click events from bubbling
          disabled={isSaving}
          autoFocus
          className={cn(
            isSaving && "cursor-wait opacity-50",
            validationError && "border-red-500 focus:ring-red-500"
          )}
          title={placeholderHints}
        />
        {validationError && (
          <div className="absolute top-full left-0 mt-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 whitespace-nowrap z-10">
            {validationError}
          </div>
        )}
        {placeholderHints && !validationError && (
          <div className="absolute top-full left-0 mt-1 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded px-2 py-1 whitespace-nowrap z-10">
            {placeholderHints}
          </div>
        )}
      </div>
    );
  }

  return (
    <span
      ref={spanRef}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={enabled ? 0 : undefined}
      role={enabled ? "button" : undefined}
      aria-label={
        enabled ? `Edit translation: ${interpolatedValue}` : undefined
      }
      title={
        enabled
          ? `Ctrl+click or right-click to edit${
              placeholderHints ? ` • ${placeholderHints}` : ""
            }`
          : undefined
      }
      className={cn(
        interpolatedValue === `Missing translation: ${translationKey}` &&
          "text-red-500 animate-pulse font-bold",
        isSaving && "cursor-wait opacity-50",
        enabled &&
          "cursor-pointer hover:bg-gray-100 hover:rounded px-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:rounded"
      )}
    >
      {interpolatedValue}
    </span>
  );
};
