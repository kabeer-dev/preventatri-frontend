'use client';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import AddFilterMenu from '@/shared/components/common/listToolbar/AddFilterMenu';
import AppliedFilterChips from '@/shared/components/common/listToolbar/AppliedFilterChips';
import useTranslation from '@/shared/hooks/useTranslation';
import {ListToolbarFiltersProps} from '@/shared/interfaces/listToolbar';
import ActivityLogDateRangeFilter from '@/views/pages/activityLog/ActivityLogDateRangeFilter';

interface ActivityLogFiltersBarProps {
  toolbarFilters: ListToolbarFiltersProps;
  dateRange: {fromDate: string; toDate: string};
  onDateRangeChange: ({
    fromDate,
    toDate,
  }: {
    fromDate: string;
    toDate: string;
  }) => void;
  eventsCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
}

const ActivityLogFiltersBar = ({
  toolbarFilters,
  dateRange,
  onDateRangeChange,
  eventsCount,
  isRefreshing,
  onRefresh,
}: ActivityLogFiltersBarProps) => {
  const {t} = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: {xs: 'column', sm: 'row'},
        alignItems: {xs: 'stretch', sm: 'center'},
        gap: 2,
        width: '100%',
      }}
    >
      <Box
        className='flex flex-wrap items-center gap-2.5'
        sx={{flex: 1, minWidth: 0}}
      >
        <ActivityLogDateRangeFilter
          fromDate={dateRange.fromDate}
          toDate={dateRange.toDate}
          onChange={onDateRangeChange}
        />

        <AppliedFilterChips {...toolbarFilters} />

        {!!toolbarFilters.fields.length && (
          <AddFilterMenu {...toolbarFilters} />
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          flexShrink: 0,
          ml: {xs: 0, sm: 'auto'},
        }}
      >
        <Typography
          variant='small'
          sx={{color: 'text.secondary', whiteSpace: 'nowrap'}}
        >
          {t('activityLog.table.eventsCount', {count: eventsCount})}
        </Typography>

        <Tooltip title={t('activityLog.table.refresh')}>
          <span>
            <IconButton
              size='small'
              disabled={isRefreshing}
              onClick={onRefresh}
              aria-label={t('activityLog.table.refresh')}
            >
              <Icon
                icon='mdi:refresh'
                fontSize={18}
                className={isRefreshing ? 'animate-spin' : undefined}
              />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ActivityLogFiltersBar;
