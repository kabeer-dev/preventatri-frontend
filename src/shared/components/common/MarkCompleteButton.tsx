'use client';

import {MouseEvent, useState} from 'react';

import {Icon} from '@iconify/react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import MarkCompleteDialog from '@/shared/components/common/MarkCompleteDialog';
import {MarkCompleteButtonProps} from '@/shared/interfaces/modals';

const MarkCompleteButton = ({
  buttonLabel,
  dialogLabels,
  isSubmitting,
  onConfirm,
  ariaLabelledBy,
  buttonIcon = 'mdi:check-all',
  iconOnly = false,
  tooltip,
}: MarkCompleteButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (e: MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleConfirm = ({completionNotes}: {completionNotes: string}) => {
    onConfirm({completionNotes, close: () => setIsOpen(false)});
  };

  return (
    <>
      {iconOnly ? (
        <IconButton
          size='small'
          onClick={handleOpen}
          sx={{color: 'text.secondary'}}
          aria-label='mark-completed'
          title={tooltip ?? buttonLabel}
        >
          <Icon icon={buttonIcon} fontSize={20} />
        </IconButton>
      ) : (
        <Button
          variant='contained'
          onClick={handleOpen}
          startIcon={<Icon icon={buttonIcon} fontSize={20} />}
          className='bg-success hover:bg-success/90'
        >
          {buttonLabel}
        </Button>
      )}

      <MarkCompleteDialog
        key={isOpen ? 'open' : 'closed'}
        isOpen={isOpen}
        isSubmitting={isSubmitting}
        labels={dialogLabels}
        ariaLabelledBy={ariaLabelledBy}
        onCancel={() => setIsOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default MarkCompleteButton;
