'use client';

import {useState} from 'react';

import CurrentOrganizationBadgeUI from '@/@core/layouts/components/shared-components/CurrentOrganizationBadgeUI';
import {MyOrganization} from '@/shared/interfaces/auth';
import {userMutations, userQueries} from '@/shared/reactQuery';

// The organization the person is working in, shown in the top bar on every
// page, and the way to switch to another. Only people in more than one
// organization need it, so everyone else sees nothing.
const CurrentOrganizationBadge = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const {useFetchMyOrganizations} = userQueries();
  const {useSwitchOrganizationMutation} = userMutations();

  const {data} = useFetchMyOrganizations();

  const {mutate: executeSwitchOrganization, isPending: isSwitching} =
    useSwitchOrganizationMutation();

  const organizations: MyOrganization[] = data?.organizations ?? [];

  const current = organizations.find((organization) => organization.isCurrent);

  if (organizations.length < 2 || !current) return null;

  const handleSelect = (organization: MyOrganization) => {
    setAnchorEl(null);

    if (organization.isCurrent) return;

    executeSwitchOrganization({
      payload: {organizationId: organization.organizationId},
    });
  };

  return (
    <CurrentOrganizationBadgeUI
      organizations={organizations}
      currentName={current.organizationName}
      isSwitching={isSwitching}
      anchorEl={anchorEl}
      onOpen={setAnchorEl}
      onClose={() => setAnchorEl(null)}
      onSelect={handleSelect}
    />
  );
};

export default CurrentOrganizationBadge;
