'use client';

import {ConfirmationModal} from '@/shared/components/common/modals';
import useTranslation from '@/shared/hooks/useTranslation';
import {UnassignPatientsDialogProps} from '@/shared/interfaces/caseManager';

/**
 * Held between "Update" and the actual save when the submitted roster drops
 * patients: removing a patient also removes this case manager's pending
 * follow-up tasks and supervisory visits for them, so the admin acknowledges
 * that before anything is written.
 */
const UnassignPatientsDialog = ({
  isOpen,
  isLoading = false,
  onCancel,
  onConfirm,
}: UnassignPatientsDialogProps) => {
  const {t} = useTranslation();

  return (
    <ConfirmationModal
      isOpen={isOpen}
      title={t('caseManager.unassignPatientsTitle')}
      content={t('caseManager.unassignPatientsMessage')}
      dismissLabel={t('caseManager.cancelButton')}
      confirmLabel={t('caseManager.unassignPatientsConfirm')}
      onCancel={onCancel}
      onConfirm={onConfirm}
      confirmLoading={isLoading}
    />
  );
};

export default UnassignPatientsDialog;
