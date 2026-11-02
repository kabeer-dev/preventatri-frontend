import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import useTranslation from '@/shared/hooks/useTranslation';
import {FormSurfaceActionsProps} from '@/shared/interfaces/modals';

// The cancel/submit pair every form surface ends with. Submitting is wired
// through `form` rather than a click handler so the surface never has to hold
// the form's onSubmit.
const FormSurfaceActions = ({
  formId,
  isLoading,
  isEditMode,
  isDirty,
  onCancel,
  submitLabel,
  cancelLabel,
  allowPristineSubmit = false,
}: FormSurfaceActionsProps) => {
  const {t} = useTranslation();

  return (
    <Box className='flex justify-end gap-3'>
      <Button
        variant='outlined'
        color='secondary'
        type='button'
        onClick={onCancel}
        disabled={isLoading}
      >
        {cancelLabel || t('modal.closeButton')}
      </Button>
      <Button
        variant='contained'
        type='submit'
        form={formId}
        loading={isLoading}
        disabled={isLoading || (!isDirty && !allowPristineSubmit)}
      >
        {submitLabel ||
          (isEditMode ? t('modal.updateButton') : t('modal.saveButton'))}
      </Button>
    </Box>
  );
};

export default FormSurfaceActions;
