'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {BaseDialog} from '@/shared/components/common/modals';
import {MarkCompleteDialogProps} from '@/shared/interfaces/modals';

const COMPLETION_NOTES_MAX_LENGTH = 5000;

const MarkCompleteDialog = ({
  isOpen,
  isSubmitting,
  labels,
  ariaLabelledBy = 'mark-complete-title',
  onCancel,
  onConfirm,
}: MarkCompleteDialogProps) => {
  const [notes, setNotes] = useState('');

  const handleCancel = () => {
    setNotes('');
    onCancel();
  };

  const handleConfirm = () => {
    onConfirm({completionNotes: notes.trim()});
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={handleCancel}
      width={550}
      ariaLabelledBy={ariaLabelledBy}
      paperSx={{maxHeight: '90vh'}}
      disableEscapeKeyDown={isSubmitting}
      disableBackdropClick={isSubmitting}
      disableCloseButton={isSubmitting}
    >
      <Box
        className='p-6'
        sx={{display: 'flex', flexDirection: 'column', overflow: 'hidden'}}
      >
        <Typography
          id={ariaLabelledBy}
          variant='h6'
          component='h2'
          className='font-semibold text-gray-900 mb-6 pr-10'
        >
          {labels.title}
        </Typography>

        <Box sx={{flex: 1, overflowY: 'auto', pr: 2, mr: -2, pt: 2}}>
          <TextField
            autoFocus
            required
            fullWidth
            multiline
            minRows={3}
            maxRows={6}
            label={labels.notesLabel}
            placeholder={labels.notesPlaceholder}
            helperText={labels.notesHelper}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSubmitting}
            slotProps={{
              htmlInput: {maxLength: COMPLETION_NOTES_MAX_LENGTH},
            }}
          />
        </Box>

        <Box className='mt-6'>
          <Box className='flex justify-end gap-3'>
            <Button
              variant='outlined'
              onClick={handleCancel}
              className='w-auto px-6'
              disabled={isSubmitting}
            >
              {labels.cancel}
            </Button>
            <Button
              variant='contained'
              onClick={handleConfirm}
              className='w-auto px-6 bg-success hover:bg-success/90'
              loading={isSubmitting}
              disabled={isSubmitting || !notes.trim()}
            >
              {labels.confirm}
            </Button>
          </Box>
        </Box>
      </Box>
    </BaseDialog>
  );
};

export default MarkCompleteDialog;
