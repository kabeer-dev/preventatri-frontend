'use client';

import {ConfirmationModal} from '@/shared/components/common/modals';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';

// Shown to an organization admin who opens an HHAeXchange screen before the
// organization has connected its own HHAeXchange credentials.
const HhaConnectPrompt = () => {
  const {t} = useTranslation();
  const {push, replace} = useLocaleRouter();

  const handleConnect = () => {
    push({url: `${DASHBOARD_ROUTES.settings.all()}?section=integrations`});
  };

  const handleNotNow = () => {
    replace({url: DASHBOARD_ROUTES.home()});
  };

  return (
    <ConfirmationModal
      isOpen
      title={t('hhaConnectPrompt.title')}
      content={t('hhaConnectPrompt.content')}
      confirmLabel={t('hhaConnectPrompt.connect')}
      dismissLabel={t('hhaConnectPrompt.notNow')}
      onCancel={handleNotNow}
      onConfirm={handleConnect}
    />
  );
};

export default HhaConnectPrompt;
