'use client';

import {useMemo} from 'react';

import {SYSTEM_ROLES} from '@/shared/constants/common';
import {WorkItemCareTeamMember} from '@/shared/interfaces/workItem';
import {supervisoryVisitQueries} from '@/shared/reactQuery';

import {useCareTeamOptions} from './useCareTeamOptions';
import useGetLoggedInUser from './useGetLoggedInUser';
import useTranslation from './useTranslation';

const ASSIGNEE_ROLES: string[] = [
  SYSTEM_ROLES.nurse.value,
  SYSTEM_ROLES.admin.value,
  SYSTEM_ROLES.caseManager.value,
];

const CAREGIVER_ROLES: string[] = [SYSTEM_ROLES.caregiver.value];

// One care-team fetch feeds both pickers of the visit form: who performs the
// visit (nurse / admin / case manager) and which caregivers are present.
export const useSupervisoryVisitCareTeamOptions = ({
  patientId,
  enabled = true,
}: {
  patientId?: string;
  enabled?: boolean;
}) => {
  const {t} = useTranslation();
  const {currentUser} = useGetLoggedInUser();
  const {useFetchSupervisoryVisitAssignees} = supervisoryVisitQueries();

  const query = useFetchSupervisoryVisitAssignees({
    patientId: patientId || '',
    enabled: enabled && Boolean(patientId),
  });

  const members: WorkItemCareTeamMember[] = useMemo(
    () => query.data?.assignees ?? [],
    [query.data]
  );

  const assigneeOptions = useCareTeamOptions({
    members,
    roles: ASSIGNEE_ROLES,
    t,
  });

  const caregiverOptions = useCareTeamOptions({
    members,
    roles: CAREGIVER_ROLES,
    t,
  });

  const selfUserOrgId =
    members.find(
      (member) =>
        member.userId === currentUser?.id &&
        ASSIGNEE_ROLES.includes(member.role)
    )?.userOrgId ?? null;

  return {
    assigneeOptions,
    caregiverOptions,
    selfUserOrgId,
    isLoading: query.isLoading,
  };
};
