'use client';

import useGetLoggedInUser from './useGetLoggedInUser';

// The organization's IANA time zone, read once with the logged-in user so
// every role has it. Undefined until the user loads, which falls back to the
// browser zone in the date helpers.
export const useOrganizationTimeZone = (): {zone: string | undefined} => {
  const {currentUser} = useGetLoggedInUser();

  const zone: unknown = currentUser?.currentActiveOrganization?.timeZone;

  return {zone: typeof zone === 'string' && zone ? zone : undefined};
};
