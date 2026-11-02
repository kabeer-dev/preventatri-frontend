'use client';

import {useCallback, useMemo} from 'react';

import {
  CAREGIVER_ACTIVITY_KINDS,
  CAREGIVER_ALL_PATIENTS,
  CAREGIVER_SENT_STATUSES,
} from '@/shared/constants/caregiver';
import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  CaregiverActivityFilters,
  CaregiverActivityItem,
} from '@/shared/interfaces/caregiverActivity';
import {assessmentQueries} from '@/shared/reactQuery';
import {
  groupActivityByDay,
  toChecklistActivity,
  toRedFlagActivity,
} from '@/shared/utils/caregiverActivity';
import {fromIso, getToday} from '@/shared/utils/dateUtils';

/**
 * The Activity feed: the caregiver's sent checklists and her red flags, in one
 * list. Both endpoints already scope to the signed-in caregiver, so nothing
 * here asks for someone else's work. The merge, the sort and every filter
 * happen in the browser, because the two lists cannot be paged as one.
 *
 * Both lists are read page by page. A half-loaded feed is worse than none,
 * which is why one failed list fails the whole hook rather than quietly
 * dropping its half of the rows.
 */
const useCaregiverActivity = ({
  filters,
}: {
  filters: CaregiverActivityFilters;
}) => {
  const {t} = useTranslation();

  const {useFetchAllSubmissions, useFetchAllEmergencyFlags} =
    assessmentQueries();

  const {
    data: submissionsData,
    isLoading: isSubmissionsLoading,
    isError: isSubmissionsError,
    refetch: refetchSubmissions,
  } = useFetchAllSubmissions({
    params: {status: CAREGIVER_SENT_STATUSES, ...SUB_ROUTE_PARAMS},
  });

  const {
    data: redFlagsData,
    isLoading: isRedFlagsLoading,
    isError: isRedFlagsError,
    refetch: refetchRedFlags,
  } = useFetchAllEmergencyFlags({params: {...SUB_ROUTE_PARAMS}});

  const items: CaregiverActivityItem[] = useMemo(() => {
    const checklists = (submissionsData?.submissions || []).map(
      (submission: any) => toChecklistActivity({submission, t})
    );

    const redFlags = (redFlagsData?.emergencyFlags || []).map((redFlag: any) =>
      toRedFlagActivity({redFlag, t})
    );

    return [...checklists, ...redFlags]
      .filter(({timestamp}) => Boolean(timestamp))
      .sort(
        (a, b) =>
          (fromIso({value: b.timestamp})?.toMillis() ?? 0) -
          (fromIso({value: a.timestamp})?.toMillis() ?? 0)
      );
  }, [submissionsData, redFlagsData, t]);

  const visibleItems = useMemo(() => {
    const from = getToday().minus({days: filters.range});

    return items.filter((item) => {
      const date = fromIso({value: item.timestamp});

      if (!date || date < from) return false;

      if (
        filters.kind !== CAREGIVER_ACTIVITY_KINDS.all &&
        item.kind !== filters.kind
      ) {
        return false;
      }

      // Matched on the id both payloads carry, so two patients who share a
      // name are never folded into one another.
      return (
        filters.patient === CAREGIVER_ALL_PATIENTS ||
        item.patientId === filters.patient
      );
    });
  }, [items, filters]);

  const days = useMemo(
    () => groupActivityByDay({items: visibleItems, t}),
    [visibleItems, t]
  );

  const refetch = useCallback(() => {
    refetchSubmissions();
    refetchRedFlags();
  }, [refetchRedFlags, refetchSubmissions]);

  return {
    days,
    isLoading: isSubmissionsLoading || isRedFlagsLoading,
    isError: isSubmissionsError || isRedFlagsError,
    refetch,
  };
};

export default useCaregiverActivity;
