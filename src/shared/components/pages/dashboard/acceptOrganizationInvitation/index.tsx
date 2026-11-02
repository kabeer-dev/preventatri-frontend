'use client';

import {useEffect, useRef, useState} from 'react';

import {AUTH_ROUTES, DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import {
  AcceptedOrganizationInvitation,
  AcceptOrganizationInvitationProps,
} from '@/shared/interfaces/orgUser';
import {userMutations} from '@/shared/reactQuery';

import AcceptOrganizationInvitationUI from './AcceptOrganizationInvitationUI';

const AcceptOrganizationInvitation = ({
  token,
}: AcceptOrganizationInvitationProps) => {
  const {
    useAcceptOrganizationInvitationMutation,
    useSwitchOrganizationMutation,
  } = userMutations();

  const router = useLocaleRouter();

  // The auth guard already reads the user when there is a login cookie, so this
  // only reads that result and never asks the server while logged out.
  const {isLoggedIn, isLoading: isUserLoading} = useGetLoggedInUser({
    enabled: false,
  });

  const {mutate: executeAccept} = useAcceptOrganizationInvitationMutation();

  const {mutate: executeSwitch, isPending: isSwitching} =
    useSwitchOrganizationMutation();

  const [invitation, setInvitation] =
    useState<AcceptedOrganizationInvitation>();
  const [isAccepting, setIsAccepting] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // A link works once, so the call must not run twice (React strict mode runs
  // effects twice in development).
  const hasAccepted = useRef(false);

  useEffect(() => {
    if (hasAccepted.current) return;

    hasAccepted.current = true;

    executeAccept({
      params: {token},
      callBackFuncs: {
        onSuccess: ({
          data,
        }: {
          data?: {invitation?: AcceptedOrganizationInvitation};
        }) => {
          setInvitation(data?.invitation);
          setIsAccepting(false);
        },
        onError: (error: {message?: string}) => {
          setErrorMessage(error?.message || '');
          setIsAccepting(false);
        },
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onGoToDashboard = () => {
    if (!invitation) {
      router.push({url: DASHBOARD_ROUTES.home()});

      return;
    }

    const {organizationId} = invitation;

    if (isLoggedIn) {
      executeSwitch({payload: {organizationId}});

      return;
    }

    // After login the switch page makes the new organization the current one.
    const returnUrl = encodeURIComponent(
      DASHBOARD_ROUTES.switchOrganization({organizationId})
    );

    router.push({url: `${AUTH_ROUTES.login()}?returnUrl=${returnUrl}`});
  };

  return (
    <AcceptOrganizationInvitationUI
      organizationName={invitation?.organizationName}
      isLoading={isAccepting || isUserLoading}
      isSwitching={isSwitching}
      errorMessage={errorMessage}
      onGoToDashboard={onGoToDashboard}
    />
  );
};

export default AcceptOrganizationInvitation;
