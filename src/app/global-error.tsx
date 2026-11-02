'use client';

import './globals.css';

import {useEffect} from 'react';

import {fontVariables} from '@/@core/theme/fonts';
import {getRumClient, initializeRUM} from '@/instrumentation';
import ErrorPage from '@/shared/components/common/errorPage';
import {GLOBAL_ERROR_COPY} from '@/shared/constants/globalError';
import {GlobalErrorProps} from '@/shared/interfaces/common';
import {MUIProvider, SettingsProvider} from '@/shared/providers';

initializeRUM();

export default function GlobalError({error}: GlobalErrorProps) {
  useEffect(() => {
    getRumClient()?.recordError(error);
  }, [error]);

  return (
    <html lang='en' className={fontVariables}>
      <body>
        <title>{GLOBAL_ERROR_COPY.title}</title>
        <SettingsProvider>
          <MUIProvider>
            <ErrorPage
              code={GLOBAL_ERROR_COPY.code}
              title={GLOBAL_ERROR_COPY.title}
              message={GLOBAL_ERROR_COPY.message}
              backLabel={GLOBAL_ERROR_COPY.goBack}
              primaryAction={{
                label: GLOBAL_ERROR_COPY.reloadPage,
                onClick: () => window.location.reload(),
                icon: 'mdi:refresh',
              }}
            />
          </MUIProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
