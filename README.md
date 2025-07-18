# @pidchashyi/next-i18n

A powerful, **type-safe** internationalization library for Next.js 15 App Router with real-time editable translations, server-side rendering support, and comprehensive TypeScript integration.

## 🌟 Key Features

- 🔒 **Full TypeScript Support** - Complete type safety for translation keys and language codes
- ⚡ **Next.js 15 App Router** - Server Components, Server Actions, and cookie-based persistence
- ✏️ **Editable Translations** - Double-click any translation to edit it inline with real-time updates
- 📁 **File-based Translations** - JSON files in `src/i18n/locales/` with automatic loading
- 🍪 **Cookie Persistence** - Language preferences persist across sessions
- 🚀 **Optimistic Updates** - Instant UI updates with error handling and rollback
- 🎯 **Smart Fallbacks** - Visual indicators for missing translations
- 🔄 **Real-time Synchronization** - Changes update instantly across components
- 📱 **Responsive Design** - Built-in Tailwind CSS styling support
- 🛡️ **Error Handling** - Comprehensive error boundaries and user feedback

## 📦 Installation

```bash
npm install @pidchashyi/next-i18n
# or
yarn add @pidchashyi/next-i18n
# or
pnpm add @pidchashyi/next-i18n
```

### Peer Dependencies

The library requires these peer dependencies:

```bash
npm install next react react-dom
# TypeScript (recommended)
npm install -D typescript @types/react @types/node
```

## 🚀 Quick Start

### 1. Setup Translation Files

Create your translation files in the expected directory structure:

```
src/
  i18n/
    locales/
      en.json
      es.json
      fr.json
```

**Example translation files:**

```json
// src/i18n/locales/en.json
{
  "welcome": "Welcome to our app",
  "goodbye": "Goodbye",
  "user.name": "User Name",
  "user.email": "Email Address",
  "navigation.home": "Home",
  "navigation.about": "About Us",
  "navigation.contact": "Contact",
  "errors.notFound": "Page not found",
  "errors.serverError": "Something went wrong",
  "forms.submit": "Submit",
  "forms.cancel": "Cancel"
}
```

```json
// src/i18n/locales/es.json
{
  "welcome": "Bienvenido a nuestra aplicación",
  "goodbye": "Adiós",
  "user.name": "Nombre de Usuario",
  "user.email": "Dirección de Correo",
  "navigation.home": "Inicio",
  "navigation.about": "Acerca de Nosotros",
  "navigation.contact": "Contacto",
  "errors.notFound": "Página no encontrada",
  "errors.serverError": "Algo salió mal",
  "forms.submit": "Enviar",
  "forms.cancel": "Cancelar"
}
```

### 2. Create Type-Safe Configuration

```typescript
// lib/i18n-config.ts
import type { FlatTranslations } from "@pidchashyi/next-i18n";

// Define your supported languages
export const supportedLanguages = ["en", "es", "fr"] as const;
export type SupportedLanguages = typeof supportedLanguages;

// Define your translation structure (must match your JSON files)
export type AppTranslations = {
  welcome: string;
  goodbye: string;
  "user.name": string;
  "user.email": string;
  "navigation.home": string;
  "navigation.about": string;
  "navigation.contact": string;
  "errors.notFound": string;
  "errors.serverError": string;
  "forms.submit": string;
  "forms.cancel": string;
} & FlatTranslations;

// Create the provider configuration
export const createI18nConfig = (
  initialLanguage: SupportedLanguages[number]
) => ({
  initialLanguage,
  supportedLanguages,
});
```

### 3. Setup the Provider in Your App Layout

```tsx
// app/layout.tsx
import { I18nProvider } from "@pidchashyi/next-i18n";
import { createI18nConfig } from "@/lib/i18n-config";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <I18nProvider config={createI18nConfig("en")}>{children}</I18nProvider>
      </body>
    </html>
  );
}
```

### 4. Create a Typed Hook (Recommended)

```typescript
// hooks/use-app-i18n.ts
import { createTypedI18nHook } from "@pidchashyi/next-i18n";
import type { AppTranslations } from "@/lib/i18n-config";

export const useAppI18n = createTypedI18nHook<AppTranslations>();
```

### 5. Use Translations in Components

```tsx
// components/welcome-section.tsx
"use client";

import { useAppI18n } from "@/hooks/use-app-i18n";

export function WelcomeSection() {
  const { t, language, changeLanguage } = useAppI18n();

  return (
    <div className="p-6">
      {/* Type-safe translations with IntelliSense */}
      <h1 className="text-3xl font-bold">
        {t("welcome")} {/* Double-click to edit! */}
      </h1>

      <p className="mt-4">{t("user.name")}: John Doe</p>

      {/* Language switcher */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Current Language: {language}
        </label>
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>
    </div>
  );
}
```

## ✏️ Editable Translations

### How It Works

The library includes a powerful inline editing system:

1. **Double-click any translation** to edit it
2. **Press Enter** to save changes
3. **Press Escape** to cancel editing
4. **Click outside** to cancel editing
5. Changes are **saved to the JSON file** automatically
6. **Optimistic updates** provide instant feedback
7. **Error handling** with automatic rollback on failure

### Visual Feedback

- **Missing translations** show as red, pulsing text with the translation key
- **Editing state** shows an input field with focus
- **Saving state** shows loading indicators
- **Success/error** notifications via toast messages

```tsx
// Example: Missing translation handling
export function ExampleComponent() {
  const { t } = useAppI18n();

  return (
    <div>
      {/* This will show "missing.key" in red if not found */}
      {t("missing.key")}

      {/* This will show the translated text and be editable */}
      {t("welcome")}
    </div>
  );
}
```

## 🔧 Advanced Usage

### Dynamic Language Detection

```tsx
// app/layout.tsx
import { cookies } from "next/headers";
import { I18nProvider } from "@pidchashyi/next-i18n";
import { createI18nConfig, supportedLanguages } from "@/lib/i18n-config";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const savedLanguage = cookieStore.get("language")?.value;

  // Use saved language or default to 'en'
  const initialLanguage = supportedLanguages.includes(savedLanguage as any)
    ? savedLanguage
    : "en";

  return (
    <html lang={initialLanguage}>
      <body>
        <I18nProvider config={createI18nConfig(initialLanguage)}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
```

### Server Components with Translations

```tsx
// app/page.tsx (Server Component)
import { ClientWelcomeSection } from "@/components/client-welcome-section";

export default function HomePage() {
  return (
    <div>
      <h1>This is a server component</h1>
      {/* Client component with translations */}
      <ClientWelcomeSection />
    </div>
  );
}
```

### Complex Translation Structures

```typescript
// Types for deeply nested translations
export type AppTranslations = {
  "pages.home.title": string;
  "pages.home.description": string;
  "pages.about.team.title": string;
  "pages.about.team.member.name": string;
  "forms.contact.fields.name.label": string;
  "forms.contact.fields.name.placeholder": string;
  "forms.contact.fields.name.error.required": string;
  "forms.contact.fields.name.error.minLength": string;
} & FlatTranslations;
```

```json
// src/i18n/locales/en.json
{
  "pages.home.title": "Welcome Home",
  "pages.home.description": "This is our homepage",
  "pages.about.team.title": "Our Team",
  "pages.about.team.member.name": "Team Member",
  "forms.contact.fields.name.label": "Full Name",
  "forms.contact.fields.name.placeholder": "Enter your full name",
  "forms.contact.fields.name.error.required": "Name is required",
  "forms.contact.fields.name.error.minLength": "Name must be at least 2 characters"
}
```

### Language Validation

```typescript
// utils/language-utils.ts
import type { SupportedLanguages } from "@/lib/i18n-config";

export function isValidLanguage(
  lang: string,
  supportedLanguages: readonly string[]
): lang is SupportedLanguages[number] {
  return supportedLanguages.includes(lang);
}

// Usage
const userLanguage = getUserLanguagePreference();
if (isValidLanguage(userLanguage, supportedLanguages)) {
  await changeLanguage(userLanguage); // Type-safe!
}
```

### Custom Translation Components

```tsx
// components/formatted-translation.tsx
"use client";

import { useAppI18n } from "@/hooks/use-app-i18n";

interface FormattedTranslationProps {
  translationKey: keyof AppTranslations;
  values?: Record<string, string | number>;
  className?: string;
}

export function FormattedTranslation({
  translationKey,
  values = {},
  className,
}: FormattedTranslationProps) {
  const { t } = useAppI18n();

  let translatedText = t(translationKey);

  // Simple variable replacement
  Object.entries(values).forEach(([key, value]) => {
    translatedText = translatedText
      .toString()
      .replace(new RegExp(`{{${key}}}`, "g"), String(value));
  });

  return <span className={className}>{translatedText}</span>;
}

// Usage
<FormattedTranslation
  translationKey="welcome.user"
  values={{ name: "John", count: 5 }}
  className="font-bold"
/>;
```

## 🎨 Styling and Customization

### Default Styling

The library uses Tailwind CSS classes for styling. Key classes include:

- **Missing translations**: `animate-[pulse_2s_ease-in-out_infinite] rounded-xl px-2 py-1 font-bold text-red-500`
- **Input field**: Customizable through the `Input` component
- **Loading states**: `cursor-wait opacity-50`
- **Interactive elements**: `cursor-text`

### Custom Styling

You can override the default styles by providing your own CSS classes:

```tsx
// Custom input styling
const CustomInput = ({ className, ...props }: ComponentProps<"input">) => (
  <input
    className={cn(
      "your-custom-classes",
      "focus:ring-2 focus:ring-blue-500",
      className
    )}
    {...props}
  />
);
```

## 📚 API Reference

### Types

```typescript
// Core types
type SupportedLanguages = readonly string[];
type FlatTranslations = Record<string, TranslationValue>;
type TranslationValue = string | Record<string, any>;
type TranslationKeys<T> = LeafKeys<T>; // Extracts nested keys

// Configuration types
type I18nProviderConfig<TLanguages> = {
  initialLanguage: TLanguages[number];
  supportedLanguages: TLanguages;
};

type LanguageConfig<TLanguages, TTranslations> = {
  initialLanguage: TLanguages[number];
  supportedLanguages: TLanguages;
  json: TTranslations;
};

// Context type
type I18nContextType<TTranslations> = {
  t: (key: TranslationKeys<TTranslations>) => ReactNode;
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
};
```

### Components

#### `I18nProvider`

The main provider component (Server Component).

```tsx
interface I18nProviderProps {
  children: ReactNode;
  config: I18nProviderConfig<SupportedLanguages>;
}
```

**Features:**

- Reads language from cookies
- Loads initial translations server-side
- Wraps children with `I18nClient`
- Includes toast notifications

#### `I18nClient`

Client-side translation manager.

```tsx
interface I18nClientProps {
  config: LanguageConfig<SupportedLanguages, FlatTranslations>;
  children: ReactNode;
}
```

**Features:**

- Manages translation state
- Provides React context
- Handles optimistic updates
- Manages language switching

#### `TranslationDisplay`

Individual translation renderer with editing capabilities.

```tsx
interface TranslationDisplayProps<TKey extends string> {
  translationKey: TKey;
  value: string | undefined;
  language: string;
  onSave: (key: TKey, newValue: string) => Promise<void>;
}
```

**Features:**

- Shows missing translation indicators
- Renders editable translations
- Handles save operations

#### `EditableTranslation`

The inline editing interface.

```tsx
interface EditableTranslationProps<TKey extends string> {
  translationKey: TKey;
  value: string;
  language: string;
  onSave: (key: TKey, newValue: string) => Promise<void>;
}
```

**Features:**

- Double-click to edit
- Keyboard shortcuts (Enter/Escape)
- Loading states
- Error handling

### Hooks

#### `createTypedI18nHook<TTranslations>()`

Creates a type-safe hook for consuming translations.

```typescript
const useAppI18n = createTypedI18nHook<AppTranslations>();

// Returns
type TypedI18nHook = () => {
  t: (key: TranslationKeys<TTranslations>) => ReactNode;
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
};
```

#### `useTranslationManager(config)`

Internal hook for managing translation state (not typically used directly).

```typescript
const { language, translations, handleTranslationSave, changeLanguage } =
  useTranslationManager(config);
```

### Server Actions

#### `changeLanguageAction(lang, config)`

Updates the language cookie server-side.

```typescript
const changeLanguageAction = async (
  lang: string,
  config: LanguageConfig<SupportedLanguages, FlatTranslations>
) => Promise<void>;
```

#### `updateTranslationAction(lang, key, newValue)`

Saves translation changes to the JSON file.

```typescript
const updateTranslationAction = async (
  lang: string,
  key: string,
  newValue: string
) => Promise<{ success: true; translations: any }>;
```

#### `loadTranslations(lang)`

Loads translations from the JSON file.

```typescript
const loadTranslations = async (lang: string) => Promise<FlatTranslations>;
```

## 🔒 Type Safety Features

### Translation Key Validation

```typescript
// ✅ Valid - key exists in translation files
t("welcome");
t("user.name");
t("navigation.home");

// ❌ TypeScript error - key doesn't exist
t("invalid.key"); // Error: Argument of type '"invalid.key"' is not assignable
```

### Language Code Validation

```typescript
// ✅ Valid - language in supportedLanguages
await changeLanguage("en");
await changeLanguage("es");

// ❌ TypeScript error - unsupported language
await changeLanguage("de"); // Error: Argument of type '"de"' is not assignable
```

### IntelliSense Support

- **Translation keys**: Full autocomplete when typing `t("`
- **Language codes**: Autocomplete for supported languages
- **Type hints**: Hover information for all functions
- **Error detection**: Real-time TypeScript validation

## 🚀 Performance Optimizations

### Built-in Optimizations

1. **Optimistic Updates**: UI updates immediately before server confirmation
2. **Memoized Callbacks**: Translation function is memoized with `useCallback`
3. **Efficient Re-renders**: Only updates when language or translations change
4. **Cookie Persistence**: Avoids unnecessary server requests
5. **Error Boundaries**: Graceful handling of failed operations

### Server-Side Rendering

- **Initial Load**: Translations loaded server-side for faster first paint
- **Cookie Integration**: Language preference available on first render
- **No Hydration Issues**: Server and client state synchronized

### Development Features

- **Hot Reloading**: Changes reflect immediately in development
- **Error Feedback**: Toast notifications for save operations
- **Visual Debugging**: Missing translations are clearly highlighted

## 🛠️ Development Workflow

### Adding New Languages

1. Create new JSON file: `src/i18n/locales/[lang].json`
2. Add language to `supportedLanguages` array
3. Restart development server
4. Language automatically available in UI

### Adding New Translation Keys

1. Add key-value pairs to all language JSON files
2. Update `AppTranslations` type if using TypeScript
3. Keys immediately available with full type safety

### Editing Translations

1. **In Development**: Double-click any translation to edit
2. **In Production**: Same functionality (if enabled)
3. **File Updates**: Changes saved directly to JSON files
4. **No Build Required**: Changes take effect immediately

## 🔧 Configuration Options

### Provider Configuration

```typescript
const config = {
  initialLanguage: "en", // Default language
  supportedLanguages: ["en", "es"], // Available languages
};
```

### File Structure Configuration

The library expects this structure (currently not configurable):

```
src/
  i18n/
    locales/
      en.json
      es.json
      [language].json
```

### Cookie Configuration

Language preference cookie settings:

- **Name**: `"language"`
- **Path**: `"/"`
- **Max Age**: `365 * 24 * 60 * 60` (1 year)

## 🐛 Troubleshooting

### Common Issues

**Translation files not found:**

```
Error: Failed to read file
```

- Ensure files exist in `src/i18n/locales/[lang].json`
- Check file permissions
- Verify file names match language codes exactly

**TypeScript errors:**

```
Property 'key' does not exist on type 'AppTranslations'
```

- Update `AppTranslations` type to match JSON files
- Ensure all translation files have the same keys
- Check for typos in translation keys

**Hydration mismatches:**

```
Warning: Text content did not match
```

- Ensure server and client have same initial language
- Check cookie availability during SSR

### Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG=@pidchashyi/next-i18n
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md).

### Development Setup

1. Clone the repository
2. Install dependencies: `bun install`
3. Build the library: `bun run build`
4. Run tests: `bun test`

### Release Process

1. Update version in `package.json`
2. Run `bun run build`
3. Publish: `npm publish`

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Next.js 15 App Router
- Powered by React 18 features
- Styled with Tailwind CSS
- Toast notifications by react-hot-toast

---

**Made with ❤️ by [Marian Pidchashyi](https://github.com/Marian1309)**
