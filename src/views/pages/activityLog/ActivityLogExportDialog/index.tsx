'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import {Controller, useForm, useWatch} from 'react-hook-form';

import RHFDateField from '@/shared/components/common/inputs/RHFDateField';
import FormModal from '@/shared/components/common/modals/FormModal';
import {
  ACTIVITY_LOG_EXPORT,
  ACTIVITY_LOG_EXPORT_FORMAT_OPTIONS,
} from '@/shared/constants/activityLog';
import {DASHBOARD_EXPORT_FORMATS} from '@/shared/constants/dashboard';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  AuditLogExportDialogProps,
  AuditLogExportFormValues,
} from '@/shared/interfaces/activityLog';
import {DashboardExportFormat} from '@/shared/interfaces/dashboard';
import {exportActivityLogs} from '@/shared/utils/activityLogExport';
import {
  DateTime,
  getToday,
  toDateOnlyString,
  toDateTime,
} from '@/shared/utils/dateUtils';
import {showToast} from '@/shared/utils/toasts';

const EXPORT_FORM_ID = 'activity-log-export-form';

const EXPORT_FORM_DEFAULTS: AuditLogExportFormValues = {
  fromDate: null,
  toDate: null,
  format: DASHBOARD_EXPORT_FORMATS.PDF,
};

const ActivityLogExportDialog = ({
  isOpen,
  onClose,
}: AuditLogExportDialogProps) => {
  const {t} = useTranslation();
  const [isExporting, setIsExporting] = useState(false);

  const {control, handleSubmit, reset, setError} =
    useForm<AuditLogExportFormValues>({defaultValues: EXPORT_FORM_DEFAULTS});

  const [watchedFromDate, watchedToDate] = useWatch({
    control,
    name: ['fromDate', 'toDate'],
  });

  const today = getToday();
  const fromDateTime = toDateTime({value: watchedFromDate});
  const toDateTimeValue = toDateTime({value: watchedToDate});

  // Both pickers stay within a maxRangeDays-wide window of each other (and
  // never past today), whichever end the admin picks first.
  const fromDateMaxCandidates = [today, toDateTimeValue].filter(
    (value): value is NonNullable<typeof value> => !!value
  );

  const fromDateMax = fromDateMaxCandidates.length
    ? DateTime.min(...fromDateMaxCandidates)
    : today;

  const fromDateMin = toDateTimeValue
    ? toDateTimeValue.minus({days: ACTIVITY_LOG_EXPORT.maxRangeDays - 1})
    : undefined;

  const toDateMaxCandidates = [
    today,
    fromDateTime?.plus({days: ACTIVITY_LOG_EXPORT.maxRangeDays - 1}),
  ].filter((value): value is NonNullable<typeof value> => !!value);

  const toDateMax = toDateMaxCandidates.length
    ? DateTime.min(...toDateMaxCandidates)
    : today;
  const toDateMin = fromDateTime ?? undefined;

  const closeDialog = () => {
    if (isExporting) return;
    reset(EXPORT_FORM_DEFAULTS);
    onClose();
  };

  const onSubmit = async (values: AuditLogExportFormValues) => {
    const fromDate = toDateOnlyString({value: values.fromDate});
    const toDate = toDateOnlyString({value: values.toDate});

    if (!fromDate || !toDate) return;

    if (fromDate > toDate) {
      setError('toDate', {message: t('activityLog.export.endBeforeStart')});

      return;
    }

    const rangeDays =
      DateTime.fromISO(toDate).diff(DateTime.fromISO(fromDate), 'days').days +
      1;

    if (rangeDays > ACTIVITY_LOG_EXPORT.maxRangeDays) {
      setError('toDate', {message: t('activityLog.export.maxRangeExceeded')});

      return;
    }

    setIsExporting(true);

    try {
      const {count} = await exportActivityLogs({
        fromDate,
        toDate,
        format: values.format,
        t,
      });

      if (!count) {
        setError('toDate', {message: t('activityLog.export.noResults')});

        return;
      }

      showToast({type: 'success', message: t('activityLog.export.success')});
      closeDialog();
    } catch (err) {
      console.error('Activity log export failed', err);
      showToast({type: 'error', message: t('activityLog.export.error')});
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <FormModal
      title={t('activityLog.export.title')}
      isOpen={isOpen}
      onClose={closeDialog}
      formId={EXPORT_FORM_ID}
      isLoading={isExporting}
      isDirty={false}
      width={ACTIVITY_LOG_EXPORT.dialogWidth}
      footer={
        <Box className='flex justify-end gap-3'>
          <Button
            variant='outlined'
            color='secondary'
            type='button'
            onClick={closeDialog}
            disabled={isExporting}
          >
            {t('activityLog.export.cancel')}
          </Button>
          <Button
            variant='contained'
            type='submit'
            form={EXPORT_FORM_ID}
            loading={isExporting}
            disabled={isExporting}
          >
            {t('activityLog.export.submit')}
          </Button>
        </Box>
      }
    >
      <Box
        component='form'
        id={EXPORT_FORM_ID}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{display: 'flex', flexDirection: 'column', gap: 4}}
      >
        <Typography variant='small' sx={{color: 'text.secondary'}}>
          {t('activityLog.export.subtitle')}
        </Typography>

        <Box className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <RHFDateField
            name='fromDate'
            control={control}
            label={t('activityLog.export.from')}
            disabled={isExporting}
            minDate={fromDateMin}
            maxDate={fromDateMax}
            rules={{required: t('activityLog.export.bothDatesRequired')}}
          />
          <RHFDateField
            name='toDate'
            control={control}
            label={t('activityLog.export.to')}
            disabled={isExporting}
            minDate={toDateMin}
            maxDate={toDateMax}
            rules={{required: t('activityLog.export.bothDatesRequired')}}
          />
        </Box>

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
            {t('activityLog.export.formatLabel')}
          </Typography>

          <Controller
            name='format'
            control={control}
            render={({field}) => (
              <RadioGroup
                row
                value={field.value}
                onChange={(event) =>
                  field.onChange(event.target.value as DashboardExportFormat)
                }
              >
                {ACTIVITY_LOG_EXPORT_FORMAT_OPTIONS.map(({value, labelKey}) => (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={<Radio size='small' disabled={isExporting} />}
                    label={t(labelKey)}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </Box>
      </Box>
    </FormModal>
  );
};

export default ActivityLogExportDialog;
