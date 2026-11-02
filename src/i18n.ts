import {createInstance} from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import {initReactI18next} from 'react-i18next/initReactI18next';

import {i18nConfig, i18nNamespaces} from '@/i18nConfig';

export const i18nInstance = createInstance();

let initPromise: Promise<unknown> | null = null;

export default async function initializeTranslations({
  locale,
  resources = null,
  namespaces = i18nNamespaces,
}: {
  locale: string;
  resources?: Record<string, any> | null;
  namespaces?: string[];
}) {
  if (!initPromise) {
    i18nInstance.use(initReactI18next);

    if (!resources) {
      i18nInstance.use(
        resourcesToBackend(
          (language: string, namespace: string) =>
            import(`@/locales/${language}/${namespace}.json`)
        )
      );
    }

    initPromise = i18nInstance
      .init({
        /* debug: true, // i18next will log information to help resolve possible issues */
        lng: locale,
        resources: resources || undefined,
        fallbackLng: i18nConfig.defaultLocale,
        supportedLngs: i18nConfig.locales,
        defaultNS: namespaces,
        fallbackNS: namespaces,
        ns: namespaces,
        preload: resources ? [] : i18nConfig.locales,
        returnObjects: true,
        initAsync: !resources,
      })
      .catch((error) => {
        initPromise = null;
        throw error;
      });
  }

  await initPromise;

  if (i18nInstance.language !== locale) {
    await i18nInstance.changeLanguage(locale);
  }

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
}
