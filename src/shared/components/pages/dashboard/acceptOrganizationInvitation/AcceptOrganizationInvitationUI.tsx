import ErrorPage from '@/shared/components/common/errorPage';
import GlobalLoader from '@/shared/components/common/loaders/GlobalLoader';
import useTranslation from '@/shared/hooks/useTranslation';
import {AcceptOrganizationInvitationUIProps} from '@/shared/interfaces/orgUser';

const AcceptOrganizationInvitationUI = ({
  organizationName,
  isLoading,
  isSwitching,
  errorMessage,
  onGoToDashboard,
}: AcceptOrganizationInvitationUIProps) => {
  const {t} = useTranslation();

  if (isLoading) return <GlobalLoader className='h-screen' />;

  const isFailed = !organizationName || Boolean(errorMessage);

  const primaryAction = {
    label: t('dashboard.organizationInvitation.goToDashboard'),
    icon: 'mdi:arrow-right',
    isLoading: isSwitching,
    onClick: onGoToDashboard,
  };

  if (isFailed) {
    return (
      <ErrorPage
        code={t('dashboard.organizationInvitation.invalidCode')}
        title={t('dashboard.organizationInvitation.invalidTitle')}
        message={errorMessage}
        primaryAction={primaryAction}
      />
    );
  }

  return (
    <ErrorPage
      code={t('dashboard.organizationInvitation.joinedCode')}
      title={t('dashboard.organizationInvitation.joinedTitle', {
        organizationName,
      })}
      message={t('dashboard.organizationInvitation.joinedSubtitle')}
      primaryAction={primaryAction}
    />
  );
};

export default AcceptOrganizationInvitationUI;
