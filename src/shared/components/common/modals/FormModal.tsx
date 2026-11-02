import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import FormSurfaceActions from '@/shared/components/common/modals/FormSurfaceActions';
import useTranslation from '@/shared/hooks/useTranslation';
import useUnsavedChangesGuard from '@/shared/hooks/useUnsavedChangesGuard';
import {FormSurfaceProps} from '@/shared/interfaces/modals';

import BaseDialog from './BaseDialog';
import {ConfirmationModal} from './ConfirmationModal';

const FormModal = ({
  title,
  children,
  isOpen,
  onClose,
  formId = 'modal-form',
  isLoading = false,
  isEditMode = false,
  width = 900,
  footer,
  footerStartContent,
  disableEscapeKeyDown,
  disableBackdropClick,
  isDirty,
}: FormSurfaceProps) => {
  const {t} = useTranslation();

  const {isConfirmOpen, requestClose, confirmClose, cancelClose} =
    useUnsavedChangesGuard({isDirty, isLoading, onClose});

  const footerActions = (
    <FormSurfaceActions
      formId={formId}
      isLoading={isLoading}
      isEditMode={isEditMode}
      isDirty={isDirty}
      onCancel={requestClose}
    />
  );

  const defaultFooter = footerStartContent ? (
    <Box className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
      <Box>{footerStartContent}</Box>
      {footerActions}
    </Box>
  ) : (
    footerActions
  );

  return (
    <>
      <BaseDialog
        isOpen={isOpen}
        onClose={requestClose}
        width={width}
        ariaLabelledBy='form-modal-title'
        paperSx={{maxHeight: '90vh'}}
        disableEscapeKeyDown={isLoading || Boolean(disableEscapeKeyDown)}
        disableBackdropClick={isLoading || Boolean(disableBackdropClick)}
        disableCloseButton={isLoading}
      >
        <Box
          className='p-6'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Title */}
          <Typography
            variant='h2'
            component='h2'
            id='form-modal-title'
            className='mb-6 pr-10'
          >
            {title}
          </Typography>

          {/* Body - Scrollable, with its own right padding so the scrollbar doesn't overlap content */}
          <Box sx={{flex: 1, overflowY: 'auto', pr: 2, mr: -2}}>{children}</Box>

          {/* Footer - Fixed at bottom */}
          <Box className='mt-6'>{footer ?? defaultFooter}</Box>
        </Box>
      </BaseDialog>

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

export default FormModal;
