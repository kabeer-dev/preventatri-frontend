'use client';

import {useState, useMemo, useSyncExternalStore} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import {userMutations} from '@/shared/reactQuery';
import {acceptInvitationSchema} from '@/shared/schemas/auth';
import {AcceptInvitationPayload} from '@/shared/types/auth';
import {decodeVerificationToken} from '@/shared/utils/jwtUtils';
import {tryCatch} from '@/shared/utils/tryCatchUtils';

const defaultValues: AcceptInvitationPayload = {
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
};

const subscribeToNothing = () => () => {};

const useAcceptInvitation = ({token}: {token: string}) => {
  const router = useLocaleRouter();
  const {ct} = useTranslation();

  const decoded = useMemo(
    () => tryCatch({fn: () => decodeVerificationToken({token})}),
    [token]
  );

  const {success, response} = decoded;
  const tokenError = !success || !response;
  const invitedUser = tokenError ? undefined : response.data?.user;
  const email = invitedUser?.email || '';

  const hasHydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );

  const isTokenExpired = hasHydrated && !tokenError && response.hasExpired;

  const {control, handleSubmit} = useForm<AcceptInvitationPayload>({
    resolver: zodResolver(ct({constant: acceptInvitationSchema})),
    defaultValues: {
      ...defaultValues,
      firstName: invitedUser?.firstName || '',
      lastName: invitedUser?.lastName || '',
    },
  });

  const {useAcceptInvitationMutation} = userMutations();

  const {mutate: executeAcceptInvitation, isPending} =
    useAcceptInvitationMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit((formData: AcceptInvitationPayload) => {
    const {...payload} = formData;

    setIsSubmitting(true);

    executeAcceptInvitation({
      payload,
      params: {token},
      callBackFuncs: {
        onSuccess: () => {
          router.push({url: DASHBOARD_ROUTES.home()});
        },
        onError: () => {
          setIsSubmitting(false);
        },
      },
    });
  });

  return {
    isTokenExpired,
    tokenError,
    email,
    control,
    isPending: isPending || isSubmitting,
    onSubmit,
  };
};

export default useAcceptInvitation;
