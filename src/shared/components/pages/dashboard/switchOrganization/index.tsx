'use client';

import AcceptOrganizationInvitationUI from '@/shared/components/pages/dashboard/acceptOrganizationInvitation/AcceptOrganizationInvitationUI';
import {MyOrganization} from '@/shared/interfaces/auth';
import {SwitchOrganizationProps} from '@/shared/interfaces/orgUser';
import {userMutations, userQueries} from '@/shared/reactQuery';

/**
 * Where login sends a person who joined another organization from an emailed
 * link. It shows the same "you've joined" screen as the link page, and its
 * button makes that organization the current one and reloads the app on its
 * dashboard.
 */
const SwitchOrganization = ({organizationId}: SwitchOrganizationProps) => {
  const {useFetchMyOrganizations} = userQueries();
  const {useSwitchOrganizationMutation} = userMutations();

  const {data, isLoading} = useFetchMyOrganizations({});

  const {mutate: executeSwitch, isPending: isSwitching} =
    useSwitchOrganizationMutation();

  const organizations: MyOrganization[] = data?.organizations ?? [];

  const organization = organizations.find(
    (item) => item.organizationId === organizationId
  );

  return (
    <AcceptOrganizationInvitationUI
      organizationName={organization?.organizationName}
      isLoading={isLoading}
      isSwitching={isSwitching}
      errorMessage=''
      onGoToDashboard={() => executeSwitch({payload: {organizationId}})}
    />
  );
};

export default SwitchOrganization;
