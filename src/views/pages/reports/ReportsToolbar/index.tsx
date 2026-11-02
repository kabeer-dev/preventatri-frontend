'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import DateRangeControl from '@/shared/components/common/inputs/DateRangeControl';
import AddFilterMenu from '@/shared/components/common/listToolbar/AddFilterMenu';
import AppliedFilterChips from '@/shared/components/common/listToolbar/AppliedFilterChips';
import {
  REPORT_MAX_RANGE_DAYS,
  REPORT_RANGE_PRESETS,
  REPORT_TOOLBAR,
} from '@/shared/constants/reports';
import useTranslation from '@/shared/hooks/useTranslation';
import {ReportsToolbarProps} from '@/shared/interfaces/reports';
import {formatMillis} from '@/shared/utils/dateUtils';

const ReportsToolbar = ({
  range,
  updatedAt,
  onRangeChange,
  filters,
}: ReportsToolbarProps) => {
  const {t} = useTranslation();

  const updatedTime = formatMillis({
    millis: updatedAt,
    format: REPORT_TOOLBAR.updatedFormat,
  });

  return (
    <Box className='flex flex-col gap-2.5'>
      <Box
        role='toolbar'
        aria-label={t('reports.toolbarLabel')}
        className='flex flex-wrap items-center gap-3'
      >
        <DateRangeControl
          range={range}
          onRangeChange={onRangeChange}
          presets={REPORT_RANGE_PRESETS}
          maxRangeDays={REPORT_MAX_RANGE_DAYS}
        />

        <AddFilterMenu {...filters} />

        {updatedTime && (
          <Typography
            variant='small'
            className='text-ink-muted ml-auto tabular-nums'
          >
            {t('reports.updated', {time: updatedTime})}
          </Typography>
        )}
      </Box>

      <AppliedFilterChips {...filters} />
    </Box>
  );
};

export default ReportsToolbar;
