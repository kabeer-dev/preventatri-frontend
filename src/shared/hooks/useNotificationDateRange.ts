'use client';

import {useCallback} from 'react';

import {parseAsString, useQueryStates} from 'nuqs';

import {FILTER_PARAMS} from '@/shared/constants/general';
import {NotificationDateRange} from '@/shared/interfaces/notification';

// The date window a notifications list is filtered by, kept in the URL so it
// survives a reload. Empty strings mean all time.
const useNotificationDateRange = () => {
  const [range, setRange] = useQueryStates(
    {
      [FILTER_PARAMS.startDate]: parseAsString.withDefault(''),
      [FILTER_PARAMS.endDate]: parseAsString.withDefault(''),
    },
    {clearOnDefault: true}
  );

  const setDateRange = useCallback(
    ({startDate, endDate}: NotificationDateRange) =>
      setRange({
        [FILTER_PARAMS.startDate]: startDate,
        [FILTER_PARAMS.endDate]: endDate,
      }),
    [setRange]
  );

  const dateRange: NotificationDateRange = {
    startDate: range[FILTER_PARAMS.startDate],
    endDate: range[FILTER_PARAMS.endDate],
  };

  return {dateRange, setDateRange};
};

export default useNotificationDateRange;
