# @pidchashyi/next-i18n

A **type-safe** i18n library for React applications with TypeScript support, featuring compile-time validation of languages and translation keys.

## 🔥 Key Features

- **Type-safe language codes** - Compile-time validation of supported languages
- **Type-safe translation keys** - IntelliSense and validation for translation keys
- **Strongly typed translation functions** - No more runtime errors from typos
- **Next.js 15 App Router support** - Server and client components
- **Editable translations** - Built-in translation editing capabilities
- **Cookie-based persistence** - Language preferences persist across sessions

## 📦 Installation

```bash
npm install @pidchashyi/next-i18n
# or
yarn add @pidchashyi/next-i18n
# or
pnpm add @pidchashyi/next-i18n
```

## 🚀 Quick Start

### 1. Define Your Languages and Translations (Type-Safe)

```typescript
// lib/i18n.ts
import {
  defineLanguages,
  defineTranslations,
  createI18nConfig,
} from "@pidchashyi/next-i18n";

// Define supported languages with type safety
export const supportedLanguages = defineLanguages(["en", "es", "fr"] as const);
export type SupportedLanguages = typeof supportedLanguages;

// Define your translation structure (based on your JSON files)
export const sampleTranslations = defineTranslations({
  welcome: "Welcome",
  goodbye: "Goodbye",
  "user.name": "User Name",
  "user.email": "Email Address",
  "navigation.home": "Home",
  "navigation.about": "About",
  "errors.notFound": "Page not found",
});
export type Translations = typeof sampleTranslations;

// Create type-safe configuration
export const i18nConfig = createI18nConfig(supportedLanguages);
```

### 2. Create Translation Files

```json
// src/i18n/locales/en.json
{
  "welcome": "Welcome",
  "goodbye": "Goodbye",
  "user.name": "User Name",
  "user.email": "Email Address",
  "navigation.home": "Home",
  "navigation.about": "About",
  "errors.notFound": "Page not found"
}
```

```json
// src/i18n/locales/es.json
{
  "welcome": "Bienvenido",
  "goodbye": "Adiós",
  "user.name": "Nombre de Usuario",
  "user.email": "Dirección de Correo",
  "navigation.home": "Inicio",
  "navigation.about": "Acerca de",
  "errors.notFound": "Página no encontrada"
}
```

### 3. Setup Provider (App Router)

```tsx
// app/layout.tsx
import { I18nProvider } from "@pidchashyi/next-i18n";
import {
  i18nConfig,
  type SupportedLanguages,
  type Translations,
} from "@/lib/i18n";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <I18nProvider<SupportedLanguages, Translations>
          config={i18nConfig.createConfig("en")}
        >
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
```

### 4. Create Typed Hook (Recommended)

```typescript
// hooks/use-typed-i18n.ts
import { createTypedI18nHook } from "@pidchashyi/next-i18n";
import type { SupportedLanguages, Translations } from "@/lib/i18n";

export const useTypedI18n = createTypedI18nHook<
  SupportedLanguages,
  Translations
>();
```

### 5. Use in Components

```tsx
// components/welcome.tsx
"use client";

import { useTypedI18n } from "@/hooks/use-typed-i18n";

export function Welcome() {
  const { t, language, changeLanguage } = useTypedI18n();

  return (
    <div>
      {/* Type-safe translation keys with IntelliSense */}
      <h1>{t("welcome")}</h1>
      <p>{t("user.name")}</p>

      {/* Type-safe language switching */}
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value as any)}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
}
```

## 🛡️ Type Safety Benefits

### ✅ Language Code Validation

```typescript
// ✅ This works - 'en' is in supportedLanguages
changeLanguage("en");

// ❌ TypeScript error - 'de' is not in supportedLanguages
changeLanguage("de"); // Error: Argument of type '"de"' is not assignable
```

### ✅ Translation Key Validation

```typescript
// ✅ This works - 'welcome' exists in translations
t("welcome");

// ❌ TypeScript error - 'invalid.key' doesn't exist
t("invalid.key"); // Error: Argument of type '"invalid.key"' is not assignable
```

### ✅ IntelliSense Support

When you type `t('`, you'll get full autocomplete for all available translation keys!

## 🎨 Advanced Usage

### Nested Translation Keys

```typescript
export const translations = defineTranslations({
  "user.profile.name": "Profile Name",
  "user.profile.email": "Profile Email",
  "settings.theme.dark": "Dark Mode",
  "settings.theme.light": "Light Mode",
});

// All nested keys are type-safe
t("user.profile.name"); // ✅ Valid
t("settings.theme.dark"); // ✅ Valid
t("invalid.nested.key"); // ❌ TypeScript error
```

### Language Validation Helper

```typescript
import { isValidLanguage } from "@pidchashyi/next-i18n";
import { supportedLanguages } from "@/lib/i18n";

const userLanguage = getUserLanguageFromSomewhere();

if (isValidLanguage(userLanguage, supportedLanguages)) {
  // userLanguage is now typed as SupportedLanguages[number]
  changeLanguage(userLanguage);
}
```

### Generic Components

```tsx
// For maximum flexibility, you can still use generics
import { useI18n } from "@pidchashyi/next-i18n";

function GenericComponent<
  TLanguages extends SupportedLanguages,
  TTranslations extends FlatTranslations
>() {
  const { t } = useI18n<TLanguages, TTranslations>();

  return <div>{t("welcome" as any)}</div>;
}
```

## 🔧 Migration from v1.x

The library maintains backward compatibility, but to get type safety:

1. **Update your language definition:**

```typescript
// Before
const config = {
  supportedLanguages: ["en", "es"],
  initialLanguage: "en",
};

// After (type-safe)
const supportedLanguages = defineLanguages(["en", "es"] as const);
const config = createI18nConfig(supportedLanguages).createConfig("en");
```

2. **Create typed hooks:**

```typescript
// Before
import { useI18n } from "@pidchashyi/next-i18n";

// After (type-safe)
import { createTypedI18nHook } from "@pidchashyi/next-i18n";
export const useTypedI18n = createTypedI18nHook<
  YourLanguages,
  YourTranslations
>();
```

## 📚 API Reference

### Types

- `SupportedLanguages` - Readonly array of language codes
- `TranslationKeys<T>` - Extract keys from translation object
- `FlatTranslations` - Flat key-value translation structure
- `I18nContextType<TLanguages, TTranslations>` - Typed context interface

### Utilities

- `defineLanguages(languages)` - Type-safe language definition [[memory:3663219]]
- `defineTranslations(translations)` - Type-safe translation definition
- `createI18nConfig(languages)` - Create typed configuration factory
- `createTypedI18nHook<TTranslations>()` - Create typed hook
- `isValidLanguage(lang, supportedLanguages)` - Language validation

### Components

- `I18nProvider<TLanguages, TTranslations>` - Type-safe provider
- `I18nClient<TLanguages, TTranslations>` - Type-safe client wrapper

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

MIT License - see LICENSE file for details.
