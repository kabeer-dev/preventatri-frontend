'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import Icon from '@/@core/components/icon';
import useTranslation from '@/shared/hooks/useTranslation';
import {EscalationStepHandleProps} from '@/shared/interfaces/settings';

const EscalationStepHandle = ({
  step,
  index,
  isAdmin,
  disabled,
  onHandleHeldChange,
  onMove,
}: EscalationStepHandleProps) => {
  const {t} = useTranslation();

  if (isAdmin) {
    return (
      <Tooltip title={t('escalationSettings.adminPinned')}>
        <Box className='flex h-8 items-center justify-center'>
          <Icon
            icon='mdi:lock-outline'
            fontSize={18}
            aria-label={t('escalationSettings.adminPinned')}
          />
        </Box>
      </Tooltip>
    );
  }

  return (
    <IconButton
      size='small'
      disabled={disabled}
      aria-label={t('escalationSettings.reorderAriaLabel', {step: index + 1})}
      onPointerDown={() => onHandleHeldChange(true)}
      onPointerUp={() => onHandleHeldChange(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          onMove({
            id: step.id,
            toIndex: index + (event.key === 'ArrowUp' ? -1 : 1),
          });
        }
      }}
      sx={{cursor: 'grab', color: 'text.secondary'}}
    >
      <Icon icon='mdi:drag-vertical' fontSize={18} />
    </IconButton>
  );
};

export default EscalationStepHandle;
