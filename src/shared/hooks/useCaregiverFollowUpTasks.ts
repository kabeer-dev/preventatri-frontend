'use client';

import {useMemo} from 'react';

import {FOLLOW_UP_CAREGIVER_CARD_PARAMS} from '@/shared/constants/followUps';
import {FollowUpTask} from '@/shared/interfaces/followUp';
import {followUpTaskQueries} from '@/shared/reactQuery';

// The caregiver's open follow-up tasks, nearest due first. The backend scopes
// caregivers to what is assigned to them.
export const useCaregiverFollowUpTasks = () => {
  const {useFetchFollowUpTasksList} = followUpTaskQueries();

  const query = useFetchFollowUpTasksList({
    params: FOLLOW_UP_CAREGIVER_CARD_PARAMS,
  });

  const tasks: FollowUpTask[] = useMemo(
    () => query.data?.tasks ?? [],
    [query.data]
  );

  return {tasks, isLoading: query.isLoading};
};
