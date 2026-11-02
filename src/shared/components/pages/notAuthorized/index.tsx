'use client';

import ErrorPage from '@/shared/components/common/errorPage';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {getHomeRoute} from '@/shared/utils/routeUtils';

export default function NotAuthorizedContent() {
  const {t} = useTranslation();
  const {userRole} = useUserRole();

  return (
    <ErrorPage
      code={t('accessDenied.heading')}
      title={t('accessDenied.title')}
      message={t('accessDenied.message')}
      backLabel={t('accessDenied.goBack')}
      primaryAction={{
        href: getHomeRoute({role: userRole}),
        label: t('accessDenied.goToDashboard'),
      }}
    />
  );
}
