'use client';

import {useState} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useForm} from 'react-hook-form';

import FileDropzone from '@/shared/components/common/inputs/FileDropzone';
import RHFSegmentedField from '@/shared/components/common/inputs/RHFSegmentedField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {FormDrawer} from '@/shared/components/common/modals';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  CompletionDrawerProps,
  CompletionFormValues,
} from '@/shared/interfaces/workItem';
import {completionSchema} from '@/shared/schemas/workItem';

// Outcome, notes and evidence for closing a work item (follow-up task,
// supervisory visit). Lateness is shown, never hidden. Extra sections (e.g.
// follow-ups to spawn) render under the evidence through `children`.
const CompletionDrawer = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  formId,
  labels,
  outcomeOptions,
  outcomeValues,
  defaultOutcome,
  defaultNotes,
  notesFieldName,
  warning,
  accept,
  maxFiles,
  children,
}: CompletionDrawerProps) => {
  const {t} = useTranslation();

  // The parent remounts the drawer on open (key), so form and files start
  // clean without an effect.
  const [files, setFiles] = useState<File[]>([]);

  const {
    control,
    handleSubmit,
    formState: {isDirty},
  } = useForm<CompletionFormValues>({
    resolver: zodResolver(
      completionSchema({
        t,
        outcomeValues,
        notesFieldName,
        notesLimit: 5000,
      })
    ),
    defaultValues: {
      outcome: defaultOutcome,
      completionNotes: defaultNotes || '',
    },
  });

  return (
    <FormDrawer
      title={labels.title}
      subtitle={labels.subtitle}
      isOpen={isOpen}
      onClose={onClose}
      formId={formId}
      isDirty={isDirty || files.length > 0}
      isLoading={isLoading}
      submitLabel={labels.confirm}
      allowPristineSubmit
      footerStartContent={
        <Typography variant='small' sx={{color: 'text.disabled'}}>
          {labels.permanent}
        </Typography>
      }
    >
      <form
        id={formId}
        onSubmit={handleSubmit((values) => onSubmit({values, files}))}
        className='pt-2'
      >
        <Box className='grid grid-cols-1 gap-4'>
          {warning && (
            <Alert severity='error' variant='outlined'>
              {warning}
            </Alert>
          )}

          <RHFSegmentedField
            name='outcome'
            control={control}
            label={labels.outcome}
            options={outcomeOptions}
            disabled={isLoading}
          />

          <RHFTextField
            name='completionNotes'
            control={control}
            label={`${labels.notes} · ${labels.notesHint}`}
            placeholder={labels.notesPlaceholder}
            multiline
            rows={4}
            disabled={isLoading}
          />

          <Box>
            <Typography
              variant='small'
              sx={{
                display: 'block',
                mb: 1.5,
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              {labels.evidence} · {labels.evidenceOptional}
            </Typography>
            <FileDropzone
              files={files}
              onFilesChange={({files: next}) => setFiles(next)}
              accept={accept}
              maxFiles={maxFiles}
              disabled={isLoading}
              previewSize={56}
            />
          </Box>
        </Box>
      </form>

      {/* Outside the form: a nested form's submit (e.g. queuing a follow-up)
          bubbles through React portals and would file the item early. */}
      {children && <Box className='mt-4'>{children}</Box>}
    </FormDrawer>
  );
};

export default CompletionDrawer;
