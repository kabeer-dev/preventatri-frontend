'use client';

import {useState} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useQueryClient} from '@tanstack/react-query';
import {useForm} from 'react-hook-form';

import AlertReviewCard from '@/shared/components/common/alertReview/AlertReviewCard';
import Call911Banner from '@/shared/components/common/Call911Banner';
import FileDropzone from '@/shared/components/common/inputs/FileDropzone';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {
  ACTION_TAKEN_CHECKBOXES,
  MAX_RESOLUTION_ATTACHMENTS,
} from '@/shared/constants/flag';
import {
  FOLLOW_UP_DUE_TIME_DEFAULT,
  FOLLOW_UP_TASK_DEFAULT_PRIORITY,
} from '@/shared/constants/followUps';
import {ALLOWED_ACTION_TAKEN_ATTACHMENT_ACCEPT} from '@/shared/constants/general';
import {EMERGENCY_FLAGS, FLAGS} from '@/shared/constants/reactQueryConstants';
import {STALE_FLAG_ERROR_TYPES} from '@/shared/constants/responses/errors/assessments';
import {
  SUPERVISORY_VISIT_DEFAULT_END_TIME,
  SUPERVISORY_VISIT_DEFAULT_START_TIME,
} from '@/shared/constants/supervisoryVisits';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {ActionTakenFormProps} from '@/shared/interfaces/flag';
import {useMutations as useFlagMutations} from '@/shared/reactQuery/flags/mutations';
import {actionTakenFormSchema} from '@/shared/schemas/flag';
import {ActionTakenFormValues} from '@/shared/types/flag';
import {
  buildResolveEscalationPayload,
  buildResolveFormData,
} from '@/shared/utils/actionTakenUtils';

import AlsoCreateSection from './actionTaken/AlsoCreateSection';
import ResolutionActionsGroup from './actionTaken/ResolutionActionsGroup';
import ResolveSubmitFooter from './actionTaken/ResolveSubmitFooter';

const ACTION_TAKEN_FORM_DEFAULTS: ActionTakenFormValues = {
  ...(Object.fromEntries(
    ACTION_TAKEN_CHECKBOXES.map(({name}) => [name, false])
  ) as Pick<
    ActionTakenFormValues,
    (typeof ACTION_TAKEN_CHECKBOXES)[number]['name']
  >),
  notes: '',
  requireFollowUp: false,
  followUpTitle: '',
  followUpDate: null,
  followUpTime: FOLLOW_UP_DUE_TIME_DEFAULT,
  followUpDescription: '',
  followUpAssigneeUserOrganizationId: '',
  followUpPriority: FOLLOW_UP_TASK_DEFAULT_PRIORITY,
  followUpChecklistTemplateId: '',
  requireSupervisoryVisit: false,
  supervisoryVisitDate: null,
  supervisoryVisitStartTime: SUPERVISORY_VISIT_DEFAULT_START_TIME,
  supervisoryVisitEndTime: SUPERVISORY_VISIT_DEFAULT_END_TIME,
  supervisoryVisitAssigneeUserOrganizationId: '',
  supervisoryVisitChecklistTemplateId: '',
  visitInstructions: '',
};

const ActionTakenForm = ({
  flagId,
  patientId,
  onResolved,
}: ActionTakenFormProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ActionTakenFormValues>({
    resolver: zodResolver(actionTakenFormSchema({t, zone})),
    defaultValues: ACTION_TAKEN_FORM_DEFAULTS,
  });

  const [resolutionFiles, setResolutionFiles] = useState<File[]>([]);

  const {useResolveFlagCaseDemoMutation} = useFlagMutations();
  const {mutate, isPending} = useResolveFlagCaseDemoMutation();

  const onSubmit = (values: ActionTakenFormValues) => {
    const payload = buildResolveEscalationPayload({values, zone});

    mutate({
      params: {id: flagId},
      payload: buildResolveFormData({payload, files: resolutionFiles}),
      callBackFuncs: {
        onSuccess: onResolved,

        // The backend already surfaces a clear message (e.g. "expired and is
        // being reassigned to the next level" / "already resolved") via the
        // error toast. On those outcomes the flag has left this user's queue, so
        // refresh the flag lists (which drops the stale popup) and close the
        // modal so the UI matches reality instead of showing a dead flag.
        onError: (err: {error?: {type?: string}}) => {
          if (!STALE_FLAG_ERROR_TYPES.includes(err?.error?.type ?? '')) return;

          queryClient.invalidateQueries({
            queryKey: [FLAGS.fetchActiveFlags.queryKey],
          });
          queryClient.invalidateQueries({
            queryKey: [EMERGENCY_FLAGS.fetchEmergencyFlagsList.queryKey],
          });

          onResolved?.();
        },
      },
    });
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{display: 'grid', gap: 3.5, minWidth: 0}}
    >
      <Call911Banner />

      <AlertReviewCard title={t('flag.actionTaken.header')}>
        <Typography
          variant='small'
          component='p'
          sx={{m: 0, px: 4.5, mt: -1.5, mb: 2, color: 'customColors.inkFaint'}}
        >
          {t('flag.actionTaken.prompt')}
        </Typography>

        <ResolutionActionsGroup
          control={control}
          disabled={isPending}
          errorMessage={errors.guidedCaregiverOnCall?.message}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            px: 4.5,
            pt: 4,
          }}
        >
          <RHFTextField
            name='notes'
            control={control}
            label={t('flag.actionTaken.notesLabel')}
            placeholder={t('flag.actionTaken.notesPlaceholder')}
            multiline
            rows={3}
            disabled={isPending}
          />

          <Box>
            <Typography
              variant='small'
              component='span'
              sx={{
                display: 'block',
                mb: 1.75,
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              {t('flag.actionTaken.attachDocumentsLabel')}
            </Typography>
            <FileDropzone
              files={resolutionFiles}
              onFilesChange={({files}) => setResolutionFiles(files)}
              accept={ALLOWED_ACTION_TAKEN_ATTACHMENT_ACCEPT}
              maxFiles={MAX_RESOLUTION_ATTACHMENTS}
              disabled={isPending}
              previewSize={56}
            />
          </Box>

          <AlsoCreateSection
            control={control}
            patientId={patientId}
            disabled={isPending}
          />
        </Box>

        <ResolveSubmitFooter disabled={isPending} />
      </AlertReviewCard>
    </Box>
  );
};

export default ActionTakenForm;
