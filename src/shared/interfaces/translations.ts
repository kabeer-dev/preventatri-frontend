import {ReactNode} from 'react';

export interface I18Config {
  locales: string[];
  defaultLocale: string;
}

export interface TranslationsProviderProps {
  children: ReactNode;
  locale: string;
  namespaces?: string[];
  resources?: Record<string, any>;
}
