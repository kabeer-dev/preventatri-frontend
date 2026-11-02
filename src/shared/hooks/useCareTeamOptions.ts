'use client';

import {useMemo} from 'react';

import {FOLLOW_UP_CARE_TEAM_ROLE_LABEL_KEYS} from '@/shared/constants/followUps';
import {
  SelectOption,
  WorkItemCareTeamMember,
} from '@/shared/interfaces/workItem';
import {TranslateFunction} from '@/shared/types/common';
import {getFullName} from '@/shared/utils/general';
import {getRoleLabel} from '@/shared/utils/workItemUtils';

const LABEL_SEPARATOR = ' · ';

// "Alice Reyes · Nurse · Primary nurse" picker options from care-team members.
// A care-team role that only repeats the system role ("Caregiver · Caregiver")
// is dropped, and two members with the same name and role get their email so
// they can be told apart.
export const buildCareTeamOptions = ({
  members,
  t,
}: {
  members: WorkItemCareTeamMember[];
  t: TranslateFunction;
}): SelectOption[] => {
  const identityCounts = new Map<string, number>();

  const nameOf = (member: WorkItemCareTeamMember) =>
    getFullName({firstName: member.firstName, lastName: member.lastName}) ||
    member.email ||
    member.userOrgId;

  const identityOf = (member: WorkItemCareTeamMember) =>
    `${nameOf(member)}|${member.role}`;

  for (const member of members) {
    const identity = identityOf(member);
    identityCounts.set(identity, (identityCounts.get(identity) || 0) + 1);
  }

  return members.map((member) => {
    const name = nameOf(member);
    const roleLabel = getRoleLabel({role: member.role});

    const careTeamLabel = t(
      FOLLOW_UP_CARE_TEAM_ROLE_LABEL_KEYS[member.careTeamRole] || ''
    );

    const isDuplicateName = (identityCounts.get(identityOf(member)) || 0) > 1;

    return {
      value: member.userOrgId,
      label: [
        name,
        isDuplicateName && member.email && member.email !== name
          ? member.email
          : '',
        roleLabel,
        careTeamLabel !== roleLabel ? careTeamLabel : '',
      ]
        .filter(Boolean)
        .join(LABEL_SEPARATOR),
    };
  });
};

// The members with one of `roles`, as options; every member when no roles.
export const useCareTeamOptions = ({
  members,
  roles,
  t,
}: {
  members: WorkItemCareTeamMember[];
  roles?: string[];
  t: TranslateFunction;
}): SelectOption[] =>
  useMemo(
    () =>
      buildCareTeamOptions({
        members: roles
          ? members.filter((member) => roles.includes(member.role))
          : members,
        t,
      }),
    [members, roles, t]
  );
