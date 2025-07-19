import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function flattenTranslations(
  obj: Record<string, any>,
  prefix: string = ""
): Record<string, string> {
  const flattened: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenTranslations(value, newKey));
    } else if (typeof value === "string") {
      flattened[newKey] = value;
    }
  }

  return flattened;
}

export function interpolateVariables(
  template: string,
  variables?: Record<string, string | number>
): string {
  if (!variables) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = variables[key];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Extract all placeholder variables from a template string
 * @param template The template string with placeholders like "Hello {name}!"
 * @returns Array of placeholder names ["name"]
 */
export function extractPlaceholders(template: string): string[] {
  const matches = template.match(/\{(\w+)\}/g);
  if (!matches) return [];

  return matches.map((match) => match.slice(1, -1)); // Remove { and }
}

/**
 * Validate that all original placeholders are preserved in the edited text
 * @param originalTemplate The original template with placeholders
 * @param editedText The edited text that should preserve placeholders
 * @returns Object with validation result and missing placeholders
 */
export function validatePlaceholders(
  originalTemplate: string,
  editedText: string
): {
  isValid: boolean;
  missingPlaceholders: string[];
  extraPlaceholders: string[];
} {
  const originalPlaceholders = extractPlaceholders(originalTemplate);
  const editedPlaceholders = extractPlaceholders(editedText);

  const missingPlaceholders = originalPlaceholders.filter(
    (placeholder) => !editedPlaceholders.includes(placeholder)
  );

  const extraPlaceholders = editedPlaceholders.filter(
    (placeholder) => !originalPlaceholders.includes(placeholder)
  );

  return {
    isValid: missingPlaceholders.length === 0,
    missingPlaceholders,
    extraPlaceholders,
  };
}

/**
 * Check if a template string contains any interpolation placeholders
 * @param template The template string to check
 * @returns True if the template contains placeholders
 */
export function hasPlaceholders(template: string): boolean {
  return /\{(\w+)\}/g.test(template);
}
