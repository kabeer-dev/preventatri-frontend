'use client';

import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';

// HHAeXchange is connected to one organization. The server says whether the
// organization the person is working in is that one.
const useHhaEnabled = (): boolean => {
  const {currentUser} = useGetLoggedInUser();

  return currentUser?.currentActiveOrganization?.hhaEnabled === true;
};

export default useHhaEnabled;
