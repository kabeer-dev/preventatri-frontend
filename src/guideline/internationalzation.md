# Internationalization Guide

# Purpose

This guide explains how to implement internationalization (i18n) in our frontend application to support multiple languages for a seamless user experience.

# Locale Files

The locale/ directory contains the translation files, where each language has its own folder named after the language code. Inside these folders, translations are organized by namespace.

File Structure:
locale/
├── en/
│ └── common.json
├── fr/
│ └── common.json
└── nl/
└── common.json

# Translation Files:

File Naming: Each language folder (e.g., en, fr, nl) contains JSON files with key-value pairs for translations.
Key-Value Pairs: Keys are used in the code, and values are the actual translations.

Example (in locale/en/common.json):

{
"home": {
"message": "Welcome to our application!"
}
}

# i18n Configuration

# Step 1: Add New Locales

Update the i18nConfig to add any new languages:

export const i18nConfig = {
locales: ['en', 'fr', 'nl'], // Add new languages here.
defaultLocale: 'en' // Change the default language if required.
};

# Step 2: Add Namespaces

Ensure that each namespace (file) you create in the locale/ directory is included in i18nNamespaces:

export const i18nNamespaces = ['dashboard', 'auth', 'common', 'home'];

# Step 3: Using Translations

When implementing internationalization in a component, follow these steps:

# 1 Custom Router:

Replace `useRouter` from `next/navigation` with the custom `useLocaleRouter` hook provided by the boilerplate.
Use the `Link`component from the utility function for localized routing.

# 2 Custom Hook for Translations:

1- Import the custom `useTranslation` hook from the boilerplate

example import useTranslation from `'@/shared/hooks/useTranslation'`;

2- Extract the translation function `(t)` from `useTranslation`

`const { t } = useTranslation();`

3-Render Translations: Use the t function to access translated strings by providing the corresponding key:

example {t('home.message')}

# Example Implementation

import useTranslation from `'@/shared/hooks/useTranslation'`;
import useLocaleRouter from `'@/shared/hooks/useLocaleRouter'`;
import Link from `'@/shared/utils/LocalLink'`;

const HomePage = () => {
const { t } = useTranslation();
const router = useLocaleRouter();

return (

<div>
<h1>{t('home.message')}</h1>
<Link href="/about">{t('common.learnMore')}</Link>
</div>
);
};
