import useTranslation from '@/shared/hooks/useTranslation';
import {DeleteConfirmationModalProps} from '@/shared/interfaces/modals';

import {ConfirmationModal} from './ConfirmationModal';

export const DeleteConfirmationModal = ({
  title,
  isOpen,
  content,
  dismissLabel,
  deleteLabel,
  onCancel,
  onDelete,
  deleteLoading,
  onClose,
}: DeleteConfirmationModalProps) => {
  const {t} = useTranslation();

  const handleCancel = () => {
    onCancel();
    onClose(false);
  };

  return (
    <ConfirmationModal
      onCancel={handleCancel}
      title={title}
      isOpen={isOpen}
      content={content}
      dismissLabel={dismissLabel || t('modalButtons.cancelLabel')}
      confirmLabel={deleteLabel || t('modalButtons.deleteLabel')}
      onConfirm={onDelete}
      confirmLoading={deleteLoading}
    />
  );
};
