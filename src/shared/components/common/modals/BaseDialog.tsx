'use client';

import {ReactNode} from 'react';

import Dialog from '@mui/material/Dialog';
import {SxProps, Theme} from '@mui/material/styles';

import DialogCloseButton from './DialogCloseButton';

export interface BaseDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  width?: number | string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  disableCloseButton?: boolean;
  hideCloseButton?: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  paperSx?: SxProps<Theme>;
}

const BaseDialog = ({
  isOpen,
  onClose,
  children,
  width,
  maxWidth = false,
  fullWidth = false,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  disableCloseButton = false,
  hideCloseButton = false,
  ariaLabelledBy,
  ariaDescribedBy,
  paperSx,
}: BaseDialogProps) => {
  // eslint-disable-next-line local-rules/enforce-single-object-param
  const handleClose = (
    _: unknown,
    reason: 'backdropClick' | 'escapeKeyDown'
  ) => {
    if (reason === 'backdropClick' && disableBackdropClick) return;
    if (reason === 'escapeKeyDown' && disableEscapeKeyDown) return;
    onClose?.();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      slotProps={{
        paper: {
          sx: {
            ...(width && {width, maxWidth: '90vw'}),
            ...paperSx,
          },
        },
      }}
    >
      {!hideCloseButton && (
        <DialogCloseButton
          onClick={onClose}
          disabled={disableCloseButton}
          className='absolute top-4 right-4 z-10'
        />
      )}

      {children}
    </Dialog>
  );
};

export default BaseDialog;
