import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Flattens a nested object into dot notation keys
 * @param obj - The nested object to flatten
 * @param prefix - The current prefix for nested keys
 * @returns A flattened object with dot notation keys
 */
export function flattenTranslations(
  obj: Record<string, any>,
  prefix: string = ""
): Record<string, string> {
  const flattened: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Recursively flatten nested objects
      Object.assign(flattened, flattenTranslations(value, newKey));
    } else if (typeof value === "string") {
      // Only add string values
      flattened[newKey] = value;
    }
  }

  return flattened;
}
