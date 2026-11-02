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
  NOTIFICATION_DATE_RANGE_CONTROL,
  NOTIFICATION_DATE_RANGE_PRESETS,
} from '@/shared/constants/notificationTypes';
import {DateRange, DateRangeFormValues} from '@/shared/interfaces/inputs';
import {
  formatDateRangeLabel,
  getPastDateRange,
  toDateOnlyString,
} from '@/shared/utils/dateUtils';

interface NotificationDateRangeFilterProps {
  startDate: string;
  endDate: string;
  onChange: ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => void;
}

const NotificationDateRangeFilter = ({
  startDate,
  endDate,
  onChange,
}: NotificationDateRangeFilterProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const titleId = useId();

  const range: DateRange = {
    from: startDate || undefined,
    to: endDate || undefined,
  };

  const {control, handleSubmit, setError} = useForm<DateRangeFormValues>({
    values: {from: range.from ?? null, to: range.to ?? null},
  });

  const closePanel = () => setAnchorEl(null);

  const applyRange = ({from, to}: {from: string; to: string}) => {
    onChange({startDate: from, endDate: to});
    closePanel();
  };

  const applyCustomRange = (formValues: DateRangeFormValues) => {
    const from = toDateOnlyString({value: formValues.from});
    const to = toDateOnlyString({value: formValues.to});

    if (!from || !to) return;

    if (from > to) {
      setError('to', {message: 'End date must be after the start date'});

      return;
    }

    applyRange({from, to});
  };

  const clearRange = () => applyRange({from: '', to: ''});

  const rangeLabel =
    formatDateRangeLabel({
      range,
      sameYearStartFormat: 'd MMM',
      fullFormat: 'd MMM yyyy',
    }) || 'Filter by date';

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
          minHeight: NOTIFICATION_DATE_RANGE_CONTROL.triggerHeight,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary',
          whiteSpace: 'nowrap',
          '&:hover': {
            bgcolor: 'customColors.brandTint',
            borderColor: 'customColors.brandEdge',
          },
        }}
      >
        <Icon
          icon={NOTIFICATION_DATE_RANGE_CONTROL.triggerIcon}
          width={NOTIFICATION_DATE_RANGE_CONTROL.triggerIconSize}
          className='text-brand shrink-0'
          aria-hidden
        />
        {rangeLabel}
        <ChevronDownIcon
          size={NOTIFICATION_DATE_RANGE_CONTROL.chevronSize}
          className='text-ink-subtle shrink-0'
          aria-hidden
        />
      </Button>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={closePanel}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        transformOrigin={{vertical: 'top', horizontal: 'left'}}
        disableEnforceFocus
        slotProps={{
          paper: {
            role: 'dialog',
            'aria-labelledby': titleId,
            sx: {
              width: NOTIFICATION_DATE_RANGE_CONTROL.panelWidth,
              maxWidth: 'calc(100vw - 2rem)',
              borderRadius: `${radius.md}px`,
              mt: 2,
            },
          },
        }}
      >
        <Box sx={{p: 4}}>
          <Typography variant='h3' id={titleId}>
            Filter by date
          </Typography>
          <Typography variant='small' sx={{color: 'text.secondary'}}>
            Show notifications from a preset window or a custom range.
          </Typography>
        </Box>

        <Divider />

        <Box
          role='radiogroup'
          aria-label='Date presets'
          sx={{p: 4, display: 'flex', flexDirection: 'column', gap: 1}}
        >
          {NOTIFICATION_DATE_RANGE_PRESETS.map(({days, label}) => {
            const presetRange = getPastDateRange({days});

            const isApplied =
              presetRange.from === range.from && presetRange.to === range.to;

            return (
              <Box
                key={days}
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
                  {label}
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
            Custom range
          </Typography>

          <Box className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <RHFDateField
              name='from'
              control={control}
              label='From'
              size='small'
              rules={{required: 'Both dates are required'}}
            />
            <RHFDateField
              name='to'
              control={control}
              label='To'
              size='small'
              rules={{required: 'Both dates are required'}}
            />
          </Box>

          <Box className='flex flex-wrap items-center gap-3'>
            <Button variant='text' size='small' onClick={clearRange}>
              Reset
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              size='small'
              sx={{ml: 'auto'}}
              onClick={closePanel}
            >
              Cancel
            </Button>
            <Button type='submit' variant='contained' size='small'>
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationDateRangeFilter;
