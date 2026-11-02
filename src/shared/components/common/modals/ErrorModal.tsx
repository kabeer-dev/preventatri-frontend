import useTranslation from '@/shared/hooks/useTranslation';
import {ErrorModalProps} from '@/shared/interfaces/modals';

import {GeneralModal} from './GeneralModal';

export const ErrorModal = ({
  title,
  onConfirm,
  isOpen,
  label,
  content,
  onClose,
}: ErrorModalProps) => {
  const {t} = useTranslation();

  return (
    <GeneralModal
      title={title}
      content={content}
      buttons={[
        {
          title: label || t('modal.confirmLabel'),
          handleClick: onConfirm,
          styles: 'bg-red text-white',
        },
      ]}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};
