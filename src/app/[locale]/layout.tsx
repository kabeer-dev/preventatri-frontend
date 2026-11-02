import {cookies} from 'next/headers';
import {NuqsAdapter} from 'nuqs/adapters/next/app';
import {Toaster} from 'react-hot-toast';

import initializeTranslations from '@/i18n';
import {i18nConfig, i18nNamespaces} from '@/i18nConfig';
import AuthGuard from '@/shared/components/layout/guards/authGuard';
import RoleGuard from '@/shared/components/layout/guards/roleGuard';
import SocketWrapper from '@/shared/components/layout/socketWrapper';
import SuspenseWrapper from '@/shared/components/layout/SuspenseWrapper';
import MaintenancePage from '@/shared/components/pages/maintenance';
import {RootLayoutProps} from '@/shared/interfaces/common';
import {OTPExecutionProvider} from '@/shared/providers';
import {
  AppProvider,
  ReduxProvider,
  TranslationsProvider,
  ReactQueryProvider,
  MUIProvider,
  SettingsProvider,
} from '@/shared/providers';
import {getAuthTokenCookieName} from '@/shared/utils/getAuthTokenKey';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

export function generateStaticParams() {
  return i18nConfig.locales.map((locale: string) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: RootLayoutProps) {
  const {locale} = await params;
  const cookieStore = await cookies();
  const {resources} = await initializeTranslations({locale});

  const isNotMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== 'true';

  if (isNotMaintenance) {
    const authToken = cookieStore.get(getAuthTokenCookieName())?.value;

    return (
      <SettingsProvider>
        <MUIProvider>
          <AppProvider>
            <ReduxProvider>
              {/* <GoogleMapProvider /> */}
              <TranslationsProvider
                namespaces={i18nNamespaces}
                locale={locale}
                resources={resources}
              >
                <ReactQueryProvider>
                  <AuthGuard isAuthTokenInCookies={authToken ? true : false}>
                    <RoleGuard>
                      <OTPExecutionProvider>
                        <NuqsAdapter>
                          <SuspenseWrapper>
                            <SocketWrapper>{children}</SocketWrapper>
                          </SuspenseWrapper>
                        </NuqsAdapter>
                      </OTPExecutionProvider>
                    </RoleGuard>
                  </AuthGuard>
                </ReactQueryProvider>
              </TranslationsProvider>
            </ReduxProvider>
          </AppProvider>
          <Toaster position='top-right' />
        </MUIProvider>
      </SettingsProvider>
    );
  }

  return (
    <SettingsProvider>
      <MUIProvider>
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={locale}
          resources={resources}
        >
          <MaintenancePage />
        </TranslationsProvider>
      </MUIProvider>
    </SettingsProvider>
  );
}

export const generateMetadata = async () => await getMetadataDetails();
