'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import RHFAsyncAutocompleteField from '@/shared/components/common/inputs/RHFAsyncAutocompleteField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {FormDrawer} from '@/shared/components/common/modals';
import {NEW_CHECKLIST_FORM_ID} from '@/shared/constants/checklistBuilder';
import useTranslation from '@/shared/hooks/useTranslation';
import {NewChecklistModalUIProps} from '@/shared/interfaces/checklistBuilder';
import {NewChecklistFormValues} from '@/shared/types/checklistBuilder';

import ChecklistTypeSelector from './ChecklistTypeSelector';

const NewChecklistModalUI = ({
  isOpen,
  isDirty,
  isLoading,
  control,
  sourceTemplates,
  isSourceDisabled,
  onClose,
  onSubmit,
  onTypeChange,
}: NewChecklistModalUIProps) => {
  const {t} = useTranslation();

  return (
    <FormDrawer
      title={t('assessmentChecklists.create.title')}
      subtitle={t('assessmentChecklists.create.subtitle')}
      isOpen={isOpen}
      onClose={onClose}
      formId={NEW_CHECKLIST_FORM_ID}
      isDirty={isDirty}
      isLoading={isLoading}
      submitLabel={t('assessmentChecklists.create.submit')}
      footerStartContent={
        <Typography variant='body2' sx={{color: 'text.disabled'}}>
          {t('assessmentChecklists.create.savedAsDraft')}
        </Typography>
      }
    >
      <form id={NEW_CHECKLIST_FORM_ID} onSubmit={onSubmit}>
        <Box className='flex flex-col gap-4 pt-2'>
          <RHFTextField<NewChecklistFormValues>
            name='title'
            control={control}
            label={t('assessmentChecklists.builder.fields.name')}
            required
            fullWidth
            disabled={isLoading}
          />

          <RHFTextField<NewChecklistFormValues>
            name='description'
            control={control}
            label={t('assessmentChecklists.builder.fields.description')}
            multiline
            minRows={2}
            fullWidth
            disabled={isLoading}
          />

          <ChecklistTypeSelector
            control={control}
            disabled={isLoading}
            onTypeChange={onTypeChange}
          />

          <RHFAsyncAutocompleteField<NewChecklistFormValues>
            name='sourceTemplateId'
            control={control}
            label={t('assessmentChecklists.create.startFrom')}
            placeholder={t('assessmentChecklists.create.startFromPlaceholder')}
            source={sourceTemplates}
            disabled={isSourceDisabled || isLoading}
            loadingText={t('common.loading')}
            noOptionsText={t('assessmentChecklists.create.noSources')}
          />
        </Box>
      </form>
    </FormDrawer>
  );
};

export default NewChecklistModalUI;
