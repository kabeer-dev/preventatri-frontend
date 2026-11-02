import useTranslation from '@/shared/hooks/useTranslation';
import {InformModalProps} from '@/shared/interfaces/modals';

import {GeneralModal} from './GeneralModal';

export const InfoModal = ({
  title,
  onConfirm,
  isOpen,
  label,
  content,
  onClose,
}: InformModalProps) => {
  const {t} = useTranslation();

  return (
    <GeneralModal
      title={title}
      content={content}
      buttons={[
        {
          title: label || t('modal.confirmLabel'),
          handleClick: onConfirm,
          styles: 'bg-primary text-white',
        },
      ]}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};
