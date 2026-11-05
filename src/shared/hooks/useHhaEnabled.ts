'use client';

import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';

// Each organization connects its own HHAeXchange credentials. The server says
// whether the organization the person is working in has done so.
const useHhaEnabled = (): boolean => {
  const {currentUser} = useGetLoggedInUser();

  return currentUser?.currentActiveOrganization?.hhaEnabled === true;
};

export default useHhaEnabled;
