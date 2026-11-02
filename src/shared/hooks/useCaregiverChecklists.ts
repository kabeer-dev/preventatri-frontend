'use client';

import {useMemo} from 'react';

import {CAREGIVER_CHECKLIST_STATUSES} from '@/shared/constants/caregiver';
import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import {CaregiverChecklist} from '@/shared/interfaces/caregiverChecklist';
import {assessmentQueries} from '@/shared/reactQuery';
import {
  getDueTodayChecklists,
  getLateChecklists,
  getSentTodayChecklists,
  getUpcomingChecklists,
  toCaregiverChecklist,
} from '@/shared/utils/caregiverChecklists';

/**
 * The caregiver's own checklist dues, already split into the four buckets the
 * screens show. The server scopes GET /assessments/submissions to the signed-in
 * caregiver, so no assignee filter is sent from here.
 *
 * Every page is read, not just the first, so the late count on Today and in
 * the sidebar badge is the real number rather than "at least this many".
 *
 * Pass a patientId for the patient page; leave it out for Today and Patients.
 */
const useCaregiverChecklists = ({
  patientId,
  enabled = true,
}: {patientId?: string; enabled?: boolean} = {}) => {
  const {useFetchAllSubmissions} = assessmentQueries();

  const {data, isLoading, isError, refetch} = useFetchAllSubmissions({
    params: {
      status: CAREGIVER_CHECKLIST_STATUSES,
      patientId,
      ...SUB_ROUTE_PARAMS,
    },
    enabled,
  });

  const checklists: CaregiverChecklist[] = useMemo(
    () =>
      (data?.submissions || []).map((submission: any) =>
        toCaregiverChecklist({submission})
      ),
    [data]
  );

  const late = useMemo(() => getLateChecklists({checklists}), [checklists]);

  const dueToday = useMemo(
    () => getDueTodayChecklists({checklists}),
    [checklists]
  );

  const sentToday = useMemo(
    () => getSentTodayChecklists({checklists}),
    [checklists]
  );

  const upcoming = useMemo(
    () => getUpcomingChecklists({checklists}),
    [checklists]
  );

  return {
    checklists,
    late,
    dueToday,
    sentToday,
    upcoming,
    isLoading,
    isError,
    refetch,
  };
};

export default useCaregiverChecklists;
