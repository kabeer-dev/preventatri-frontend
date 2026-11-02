'use client';

import {useMemo} from 'react';

import {FollowUpCareTeamMember} from '@/shared/interfaces/followUp';
import {followUpTaskQueries} from '@/shared/reactQuery';

import {useCareTeamOptions} from './useCareTeamOptions';
import useGetLoggedInUser from './useGetLoggedInUser';
import useTranslation from './useTranslation';

// The patient's care team as picker options, plus the caller's own membership
// when they are on that team. Nothing loads until a patient is chosen.
export const useFollowUpAssigneeOptions = ({
  patientId,
  enabled = true,
}: {
  patientId?: string;
  enabled?: boolean;
}) => {
  const {t} = useTranslation();
  const {currentUser} = useGetLoggedInUser();
  const {useFetchFollowUpAssignees} = followUpTaskQueries();

  const query = useFetchFollowUpAssignees({
    patientId: patientId || '',
    enabled: enabled && Boolean(patientId),
  });

  const members: FollowUpCareTeamMember[] = useMemo(
    () => query.data?.assignees ?? [],
    [query.data]
  );

  const options = useCareTeamOptions({members, t});

  const selfUserOrgId =
    members.find((member) => member.userId === currentUser?.id)?.userOrgId ??
    null;

  return {options, selfUserOrgId, isLoading: query.isLoading};
};
