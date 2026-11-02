'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {ConfirmationModal} from '@/shared/components/common/modals';
import {ReasonDialogProps} from '@/shared/interfaces/workItem';

// A confirmation that asks for a reason (cancel, send back) or an optional
// note (approve). The parent remounts it on open (key) so the text resets.
const ReasonDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  message,
  reasonLabel,
  reasonPlaceholder,
  confirmLabel,
  dismissLabel,
  maxLength,
  confirmColor = 'error',
  isReasonRequired = true,
}: ReasonDialogProps) => {
  const [reason, setReason] = useState('');

  return (
    <ConfirmationModal
      isOpen={isOpen}
      title={title}
      confirmLabel={confirmLabel}
      dismissLabel={dismissLabel}
      confirmButtonColor={confirmColor}
      onCancel={onClose}
      onConfirm={() => onConfirm({reason: reason.trim()})}
      confirmLoading={isLoading}
      disableConfirm={isReasonRequired && !reason.trim()}
      maxWidth='sm'
      content={
        <Box className='flex flex-col gap-3'>
          <Typography variant='body2' sx={{color: 'text.secondary'}}>
            {message}
          </Typography>
          <TextField
            autoFocus
            required={isReasonRequired}
            fullWidth
            multiline
            minRows={3}
            label={reasonLabel}
            placeholder={reasonPlaceholder}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            disabled={isLoading}
            slotProps={{htmlInput: {maxLength}}}
          />
        </Box>
      }
    />
  );
};

export default ReasonDialog;
