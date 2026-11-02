'use client';

import {ConfirmationModal} from '@/shared/components/common/modals';
import ReasonDialog from '@/shared/components/common/modals/ReasonDialog';
import {
  ORGANIZATION_REASON_ACTIONS,
  ORGANIZATION_REASON_MAX_LENGTH,
} from '@/shared/constants/superAdmin';
import useTranslation from '@/shared/hooks/useTranslation';
import {OrganizationActionDialogProps} from '@/shared/interfaces/superAdmin';

/**
 * The confirm step of an organization action. Reject and suspend also take an
 * optional reason; approve and reactivate only confirm.
 */
const OrganizationActionDialog = ({
  request,
  isLoading,
  onClose,
  onConfirm,
}: OrganizationActionDialogProps) => {
  const {t} = useTranslation();

  if (!request) return null;

  const {organization, action} = request;
  const copy = {name: organization.organizationName};

  if (ORGANIZATION_REASON_ACTIONS.includes(action)) {
    return (
      <ReasonDialog
        key={`${organization.id}-${action}`}
        isOpen
        onClose={onClose}
        onConfirm={({reason}) => onConfirm({reason})}
        isLoading={isLoading}
        title={t(`superAdmin.dialog.${action}.title`)}
        message={t(`superAdmin.dialog.${action}.message`, copy)}
        reasonLabel={t('superAdmin.dialog.reasonLabel')}
        reasonPlaceholder={t('superAdmin.dialog.reasonPlaceholder')}
        confirmLabel={t(`superAdmin.dialog.${action}.confirm`)}
        dismissLabel={t('superAdmin.dialog.cancel')}
        maxLength={ORGANIZATION_REASON_MAX_LENGTH}
        isReasonRequired={false}
      />
    );
  }

  return (
    <ConfirmationModal
      isOpen
      title={t(`superAdmin.dialog.${action}.title`)}
      content={t(`superAdmin.dialog.${action}.message`, copy)}
      confirmLabel={t(`superAdmin.dialog.${action}.confirm`)}
      dismissLabel={t('superAdmin.dialog.cancel')}
      confirmButtonColor='primary'
      confirmLoading={isLoading}
      onCancel={onClose}
      onConfirm={() => onConfirm({})}
    />
  );
};

export default OrganizationActionDialog;
