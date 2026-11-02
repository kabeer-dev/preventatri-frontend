'use client';

import {ConfirmationModal} from '@/shared/components/common/modals/ConfirmationModal';
import useTranslation from '@/shared/hooks/useTranslation';
import {ChecklistBuilderConfirmationsProps} from '@/shared/interfaces/checklistBuilder';

const ChecklistBuilderConfirmations = ({
  confirmAction,
  onConfirm,
  onCancel,
}: ChecklistBuilderConfirmationsProps) => {
  const {t} = useTranslation();
  const isDelete = confirmAction === 'delete';
  const copyKey = isDelete ? 'delete' : 'publish';

  return (
    <ConfirmationModal
      isOpen={Boolean(confirmAction)}
      title={t(`assessmentChecklists.builder.confirm.${copyKey}.title`)}
      content={t(`assessmentChecklists.builder.confirm.${copyKey}.message`)}
      confirmLabel={t(
        `assessmentChecklists.builder.confirm.${copyKey}.confirm`
      )}
      confirmButtonColor={isDelete ? 'error' : 'primary'}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default ChecklistBuilderConfirmations;
