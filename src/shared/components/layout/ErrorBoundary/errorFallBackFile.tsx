'use client';

import ErrorPage from '@/shared/components/common/errorPage';
import useTranslation from '@/shared/hooks/useTranslation';
import {ErrorFallbackProps} from '@/shared/interfaces/common';

export const ErrorFallback = ({onReset}: ErrorFallbackProps) => {
  const {t} = useTranslation();

  return (
    <ErrorPage
      code={t('errorFallback.heading')}
      title={t('errorFallback.title')}
      message={t('errorFallback.message')}
      backLabel={t('errorFallback.goBack')}
      primaryAction={{
        label: t('errorFallback.tryAgain'),
        onClick: onReset,
        icon: 'mdi:refresh',
      }}
    />
  );
};
