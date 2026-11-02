'use client';

import {useId, useState} from 'react';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {useForm} from 'react-hook-form';

import {radius} from '@/@core/theme/spacing';
import RHFDateField from '@/shared/components/common/inputs/RHFDateField';
import {ChevronDownIcon} from '@/shared/components/icons';
import {
  DATE_RANGE_CONTROL,
  STATISTICS_DEFAULT_RANGE_DAYS,
  STATISTICS_RANGE_PRESET_OPTIONS,
  TREND_RANGE_LABEL_FORMAT,
} from '@/shared/constants/dashboard';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  DateRangeControlProps,
  DateRangeFormValues,
} from '@/shared/interfaces/inputs';
import {
  formatDateRangeLabel,
  getInclusiveDayCount,
  getPastDateRange,
  toDateOnlyString,
} from '@/shared/utils/dateUtils';

const DateRangeControl = ({
  range,
  onRangeChange,
  presets = STATISTICS_RANGE_PRESET_OPTIONS,
  maxRangeDays,
}: DateRangeControlProps) => {
  const {t} = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const titleId = useId();

  const {control, handleSubmit, setError} = useForm<DateRangeFormValues>({
    values: {from: range.from ?? null, to: range.to ?? null},
  });

  const closePanel = () => setAnchorEl(null);

  const applyRange = ({from, to}: {from: string; to: string}) => {
    onRangeChange({range: {from, to}});
    closePanel();
  };

  const applyCustomRange = (formValues: DateRangeFormValues) => {
    const from = toDateOnlyString({value: formValues.from});
    const to = toDateOnlyString({value: formValues.to});

    if (!from || !to) return;

    if (from > to) {
      setError('to', {message: t('dashboard.dateRange.endBeforeStart')});

      return;
    }

    const rangeDays = (getInclusiveDayCount({from, to}) ?? 1) - 1;

    if (maxRangeDays && rangeDays > maxRangeDays) {
      setError('to', {
        message: t('dashboard.dateRange.tooLong', {days: maxRangeDays}),
      });

      return;
    }

    applyRange({from, to});
  };

  const resetToDefault = () =>
    applyRange(getPastDateRange({days: STATISTICS_DEFAULT_RANGE_DAYS}));

  const rangeLabel =
    formatDateRangeLabel({
      range,
      sameYearStartFormat: TREND_RANGE_LABEL_FORMAT.sameYearStart,
      fullFormat: TREND_RANGE_LABEL_FORMAT.full,
    }) || t('dashboard.dateRange.trigger');

  return (
    <>
      <Button
        variant='outlined'
        color='secondary'
        aria-haspopup='dialog'
        aria-expanded={!!anchorEl}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        className='shrink-0 gap-2 rounded-xl px-3 py-1.5'
        sx={{
          minHeight: DATE_RANGE_CONTROL.triggerHeight,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary',
          '&:hover': {
            bgcolor: 'customColors.brandTint',
            borderColor: 'customColors.brandEdge',
          },
        }}
      >
        <Icon
          icon={DATE_RANGE_CONTROL.triggerIcon}
          width={DATE_RANGE_CONTROL.triggerIconSize}
          className='text-brand shrink-0'
          aria-hidden
        />
        {rangeLabel}
        <ChevronDownIcon
          size={DATE_RANGE_CONTROL.chevronSize}
          className='text-ink-subtle shrink-0'
          aria-hidden
        />
      </Button>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={closePanel}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        disableEnforceFocus
        slotProps={{
          paper: {
            role: 'dialog',
            'aria-labelledby': titleId,
            sx: {
              width: DATE_RANGE_CONTROL.panelWidth,
              maxWidth: 'calc(100vw - 2rem)',
              borderRadius: `${radius.md}px`,
              mt: 2,
            },
          },
        }}
      >
        <Box sx={{p: 4}}>
          <Typography variant='h3' id={titleId}>
            {t('dashboard.dateRange.title')}
          </Typography>
          <Typography variant='small' sx={{color: 'text.secondary'}}>
            {t('dashboard.dateRange.subtitle')}
          </Typography>
        </Box>

        <Divider />

        <Box
          role='radiogroup'
          aria-label={t('dashboard.dateRange.presets')}
          sx={{p: 4, display: 'flex', flexDirection: 'column', gap: 1}}
        >
          {presets.map(({value, labelKey}) => {
            const presetRange = getPastDateRange({days: Number(value)});

            const isApplied =
              presetRange.from === range.from && presetRange.to === range.to;

            return (
              <Box
                key={value}
                component='button'
                type='button'
                role='radio'
                aria-checked={isApplied}
                onClick={() => applyRange(presetRange)}
                className='flex w-full cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left'
                sx={{
                  bgcolor: isApplied ? 'customColors.brandTint' : 'transparent',
                  borderColor: isApplied ? 'primary.main' : 'divider',
                }}
              >
                <Box
                  aria-hidden
                  className='size-4 shrink-0 rounded-full border-4'
                  sx={{
                    borderColor: isApplied ? 'primary.main' : 'divider',
                    bgcolor: 'background.paper',
                  }}
                />
                <Typography variant={isApplied ? 'bodyStrong' : 'body'}>
                  {t(labelKey)}
                </Typography>
                <Typography
                  variant='mono'
                  sx={{ml: 'auto', color: 'text.secondary'}}
                >
                  {presetRange.from}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Divider />

        <Box
          component='form'
          onSubmit={handleSubmit(applyCustomRange)}
          sx={{p: 4, display: 'flex', flexDirection: 'column', gap: 3}}
        >
          <Typography variant='eyebrow' sx={{color: 'text.secondary'}}>
            {t('dashboard.dateRange.customRange')}
          </Typography>

          <Box className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <RHFDateField
              name='from'
              control={control}
              label={t('dashboard.dateRange.from')}
              size='small'
              rules={{required: t('dashboard.dateRange.bothDatesRequired')}}
            />
            <RHFDateField
              name='to'
              control={control}
              label={t('dashboard.dateRange.to')}
              size='small'
              rules={{required: t('dashboard.dateRange.bothDatesRequired')}}
            />
          </Box>

          <Box className='flex flex-wrap items-center gap-3'>
            <Button variant='text' size='small' onClick={resetToDefault}>
              {t('dashboard.dateRange.reset')}
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              size='small'
              sx={{ml: 'auto'}}
              onClick={closePanel}
            >
              {t('dashboard.dateRange.cancel')}
            </Button>
            <Button type='submit' variant='contained' size='small'>
              {t('dashboard.dateRange.apply')}
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default DateRangeControl;
