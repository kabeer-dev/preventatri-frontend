'use client';

import Logo from '@/shared/components/common/logo';
import MaintenanceContainer from '@/shared/components/common/maintenance/MaintenanceContainer';
import MaintenanceMessage from '@/shared/components/common/maintenance/MaintenanceMessage';
import useTranslation from '@/shared/hooks/useTranslation';

export default function MaintenancePage() {
  const {t} = useTranslation();

  return (
    <MaintenanceContainer>
      <Logo className='mb-8' />
      <MaintenanceMessage
        title={t('maintenance.title')}
        message={t('maintenance.message')}
      />
    </MaintenanceContainer>
  );
}
