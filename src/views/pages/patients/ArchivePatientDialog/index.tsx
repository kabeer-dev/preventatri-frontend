'use client';

import {DeleteConfirmationModal} from '@/shared/components/common/modals/DeleteConfirmationModal';
import useTranslation from '@/shared/hooks/useTranslation';
import {ArchivePatientDialogProps} from '@/shared/interfaces/patient';
import {patientMutations} from '@/shared/reactQuery';
import {getFullName} from '@/shared/utils/general';

const ArchivePatientDialog = ({
  isOpen,
  patient,
  onClose,
  onArchived,
}: ArchivePatientDialogProps) => {
  const {t} = useTranslation();

  const {useDeletePatientMutation} = patientMutations();
  const {mutate: archivePatient, isPending} = useDeletePatientMutation();

  const name = getFullName({
    firstName: patient?.firstName,
    lastName: patient?.lastName,
  });

  const handleArchive = () => {
    if (!patient?.id) return;

    archivePatient({
      params: {id: patient.id},
      callBackFuncs: {onSuccess: onArchived},
    });
  };

  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      title={t('patients.archiveTitle')}
      content={[
        t('patients.archiveMessage', {name}),
        t('patients.archiveWarningAssessments'),
      ]}
      dismissLabel={t('patients.cancelButton')}
      deleteLabel={t('patients.archiveButton')}
      onCancel={onClose}
      onDelete={handleArchive}
      deleteLoading={isPending}
      onClose={onClose}
    />
  );
};

export default ArchivePatientDialog;
