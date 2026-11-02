import {I18Config} from './shared/interfaces/translations';

export const i18nConfig: I18Config = {
  locales: ['en'], // List of available language codes. Add new language files in the locales directory as needed.
  defaultLocale: 'en', // The default language, which can be changed as per project requirements.
};

export const i18nNamespaces: string[] = [
  'home',
  'dashboard',
  'triage-engine',
  'auth',
  'validation',
  'common',
  'caregiver',
  'settings',
  'metadata',
  'modal',
  'maintenance',
  'not-found',
  'reports',
];

// i18nNamespaces contains the list of namespaces (JSON files) created in the locales directory.
// For example, if a developer creates common.json, include 'common' in this array.

// When using the useTranslation hook, pass i18nNamespaces as an argument but in our boilerplate no need to pass it becuase we create a custom hook to handel this scenario Now you just need to just extract {t} function from useTranslation and its start working .
