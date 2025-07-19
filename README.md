# @pidchashyi/next-i18n

A type-safe i18n library for Next.js applications with inline editing capabilities and automatic translation management.

## 🚀 Features

- 🔒 **Full TypeScript support** with type-safe translation keys
- ⚡ **Server-side rendering** compatible with Next.js App Router
- ✏️ **Inline editing** with double-click to edit translations
- 🍪 **Automatic language persistence** via cookies
- 📁 **Configurable locale directory** through i18n.json
- 🎯 **Missing translation detection** with visual indicators
- 🔄 **Real-time updates** with optimistic UI updates

## 📋 Installation

```bash
npm install @pidchashyi/next-i18n
# or
bun add @pidchashyi/next-i18n
```

### Dependencies

This library requires the following dependencies:

- `@pidchashyi/try-catch`: ^2.1.0
- `next`: 15.3.5
- `react`: ^18.3.1
- `react-hot-toast`: ^2.5.2

## 🛠️ Setup

### 1. Create translation files

Create your locale JSON files in `src/i18n/locales` (default) or your custom directory:

```
src/i18n/locales/
├── en.json
├── uk.json
└── fr.json
```

Example `en.json`:

```json
{
  "common": {
    "welcome": "Welcome",
    "submit": "Submit"
  },
  "navigation": {
    "home": "Home",
    "about": "About"
  }
}
```

Example `uk.json`:

```json
{
  "common": {
    "welcome": "Ласкаво Просимо",
    "submit": "Підтвердити"
  },
  "navigation": {
    "home": "Головна",
    "about": "Детальніше"
  }
}
```

### 2. Configure custom locale directory (optional)

Create `i18n.json` in your project root to customize the locale folder:

```json
{
  "path": "locales"
}
```

### 3. Setup the Provider

Wrap your app with `I18nProvider` in your root layout:

```tsx
import { I18nProvider } from "@pidchashyi/next-i18n";
import type { ReactNode } from "react";

interface Properties {
  children: ReactNode;
}

const RootLayout = ({ children }: Properties) => {
  return (
    <html>
      <body>
        <I18nProvider
          config={{
            initialLanguage: "en",
            supportedLanguages: ["en", "uk", "fr"],
            enabled: true, // Optional: enables/disables inline editing (default: true)
          }}
        >
          {children}
        </I18nProvider>
      </body>
    </html>
  );
};

export default RootLayout;
```

## 🎯 Usage

### Basic Usage with Type Safety

Create a typed hook for your translations:

```tsx
import { createTypedI18nHook } from "@pidchashyi/next-i18n";
// pass the base language json file in order to get type-safety
import jsonData from "@/i18n/locales/en.json";

const SUPPORTED_LANGUAGES = ["en", "uk", "fr"] as const;

export const useI18n = createTypedI18nHook<
  typeof SupportedLanguages,
  typeof jsonData
>();
```

Use in your components:

```tsx
"use client";

import { useI18n } from "./hooks/useI18n";

const HomePage = () => {
  const { t, language, changeLanguage } = useI18n();

  return (
    <>
      <h1>{t("common.welcome")}</h1>
      <p>Current language: {language}</p>

      <button onClick={() => changeLanguage("uk")}>Ukrainian</button>
    </>
  );
};

export default HomePage;
```

### Inline Editing

All translations rendered by `t()` support multiple ways to trigger inline editing:

#### **Edit Triggers:**

- **Double-click** - Traditional method to start editing
- **Ctrl/Cmd + Click** - Most reliable method, works inside buttons and other interactive elements
- **Right-click** - Context menu trigger for editing
- **Keyboard navigation** - Tab to focus the text, then press `Enter` or `Space` to edit

#### **Edit Controls:**

- **Enter** to save changes
- **Escape** to cancel editing
- **Click outside** to cancel editing

```tsx
// This text supports multiple editing methods
<h1>{t("common.welcome")}</h1>

// Works even inside buttons - use Ctrl/Cmd + Click
<button className="px-4 py-2 bg-blue-500 text-white">
  {t("common.submit")}
</button>
```

**Pro Tip:** When translations are inside buttons or other interactive elements, use **Ctrl/Cmd + Click** for the most reliable editing experience.

Missing translations are automatically highlighted in red and can also be edited inline using any of the above methods.

### Language Switching

Change language programmatically:

```tsx
const { changeLanguage } = useI18n();

// Switch to Spanish
await changeLanguage("uk");
```

Language preference is automatically saved in cookies and persists across sessions.

### Production Mode

Disable inline editing in production environments:

```tsx
<I18nProvider
  config={{
    initialLanguage: "en",
    supportedLanguages: ["en", "uk", "fr"],
    enabled: process.env.NODE_ENV === "development", // Only enable in development
  }}
>
  {children}
</I18nProvider>
```

## 🔧 API Reference

### `I18nProvider`

Server component that provides i18n context to your app.

```tsx
interface I18nProviderProps {
  children: React.ReactNode;
  config: {
    initialLanguage: string;
    supportedLanguages: string[];
    enabled?: boolean; // Optional: enables/disables inline editing (default: true)
  };
}
```

### `createTypedI18nHook<TSupportedLanguages, TTranslations>()`

Creates a type-safe hook for accessing translations.

**Returns:** `useI18n` hook with the following interface:

```tsx
{
  t: (key: keyof TTranslations) => ReactNode;
  language: TSupportedLanguages[number];
  changeLanguage: (lang: TSupportedLanguages[number]) => Promise<void>;
  enabled?: boolean; // Whether inline editing is enabled
}
```

### Configuration Options

#### `i18n.json` (optional)

```json
{
  "path": "custom/path/to/locales"
}
```

- **`path`**: Custom directory path for locale files (relative to project root)
- **Default**: `src/i18n/locales`

## 📁 Project Structure

```
your-project/
├── i18n.json                    # Optional config
├── src/i18n/locales/           # Default locale directory
│   ├── en.json
│   ├── uk.json
│   └── fr.json
└── app/
    ├── layout.tsx              # Setup I18nProvider
    └── page.tsx                # Use translations
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
