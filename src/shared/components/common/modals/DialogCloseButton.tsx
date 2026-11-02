'use client';

import IconButton from '@mui/material/IconButton';

import Icon from '@/@core/components/icon';
import useTranslation from '@/shared/hooks/useTranslation';
import {DialogCloseButtonProps} from '@/shared/interfaces/modals';

const DialogCloseButton = ({
  onClick,
  disabled = false,
  className,
}: DialogCloseButtonProps) => {
  const {t} = useTranslation();

  return (
    <IconButton
      aria-label={t('modal.closeButton')}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      <Icon icon='mdi:close' fontSize={18} />
    </IconButton>
  );
};

export default DialogCloseButton;
