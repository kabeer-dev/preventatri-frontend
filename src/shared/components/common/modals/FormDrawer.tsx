'use client';

import {useId} from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';

import {layout} from '@/@core/theme/spacing';
import FormSurfaceActions from '@/shared/components/common/modals/FormSurfaceActions';
import useTranslation from '@/shared/hooks/useTranslation';
import useUnsavedChangesGuard from '@/shared/hooks/useUnsavedChangesGuard';
import {FormDrawerProps} from '@/shared/interfaces/modals';

import {ConfirmationModal} from './ConfirmationModal';
import DialogCloseButton from './DialogCloseButton';

// The right-hand record drawer: a fixed header, a scrolling body and a footer
// that stays put, at the one drawer width the design system defines. Records
// are created and edited here rather than in a centred dialog.
const FormDrawer = ({
  title,
  subtitle,
  children,
  isOpen,
  onClose,
  formId = 'drawer-form',
  isLoading = false,
  isEditMode = false,
  isDirty,
  disableEscapeKeyDown,
  submitLabel,
  footerStartContent,
  subheader,
  cancelLabel,
  onCancel,
  allowPristineSubmit,
}: FormDrawerProps) => {
  const {t} = useTranslation();
  const titleId = useId();

  const {isConfirmOpen, requestClose, confirmClose, cancelClose} =
    useUnsavedChangesGuard({isDirty, isLoading, onClose});

  return (
    <>
      <Drawer
        anchor='right'
        open={isOpen}
        onClose={(_event, reason) => {
          if (isLoading) return;
          if (reason === 'escapeKeyDown' && disableEscapeKeyDown) return;

          requestClose();
        }}
        aria-labelledby={titleId}
        slotProps={{
          paper: {
            sx: {
              width: '100%',
              maxWidth: layout.drawerWidth,
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box className='flex items-start gap-3 px-5 py-4'>
          <Box className='min-w-0'>
            <Typography variant='h2' component='h2' id={titleId}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant='small' sx={{color: 'text.disabled'}}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <DialogCloseButton
            onClick={requestClose}
            disabled={isLoading}
            className='ml-auto'
          />
        </Box>

        {subheader && <Box className='border-rule border-t'>{subheader}</Box>}

        <Box className='border-rule min-h-0 flex-auto overflow-y-auto border-t px-5 py-4'>
          {children}
        </Box>

        <Box className='border-rule bg-page flex flex-wrap items-center gap-3 border-t px-5 py-4'>
          {footerStartContent && (
            <Box className='min-w-0 flex-1'>{footerStartContent}</Box>
          )}
          <Box className='ml-auto'>
            <FormSurfaceActions
              formId={formId}
              isLoading={isLoading}
              isEditMode={isEditMode}
              isDirty={isDirty}
              onCancel={onCancel || requestClose}
              submitLabel={submitLabel}
              cancelLabel={cancelLabel}
              allowPristineSubmit={allowPristineSubmit}
            />
          </Box>
        </Box>
      </Drawer>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        title={t('modal.unsavedChangesTitle')}
        content={t('modal.unsavedChangesMessage')}
        confirmLabel={t('modal.confirmLabel')}
        dismissLabel={t('modal.dismissLabel')}
        onConfirm={confirmClose}
        onCancel={cancelClose}
      />
    </>
  );
};

export default FormDrawer;
