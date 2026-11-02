'use client';

import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';

const useOrgName = (): string | undefined => {
  const {currentUser} = useGetLoggedInUser();

  return currentUser?.currentActiveOrganization?.name;
};

export default useOrgName;
