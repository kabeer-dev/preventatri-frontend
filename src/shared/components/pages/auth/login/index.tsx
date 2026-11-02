'use client';

import {useState} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useSearchParams} from 'next/navigation';
import {useForm} from 'react-hook-form';

import {OTP_REGENERATE_TYPE, OTP_VIEW_TYPE} from '@/shared/constants/general';
import {AUTH_ROUTES} from '@/shared/constants/paths';
import {USER_ERRORS_TYPES} from '@/shared/constants/responses/errors/users';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import {LoginError, User} from '@/shared/interfaces/auth';
import {useOTPContext} from '@/shared/providers/OTPExecutionProvider';
import {userMutations} from '@/shared/reactQuery';
import {loginUserSchema} from '@/shared/schemas/auth';
import {LoginPayload} from '@/shared/types/auth';
import {canAccessRoute, getHomeRoute} from '@/shared/utils/routeUtils';
import {getSafeReturnUrl, markReturnUrlRestored} from '@/shared/utils/urlUtils';

import LoginFormUI from './LoginFormUI';

export default function LoginForm() {
  const {ct} = useTranslation();
  const router = useLocaleRouter();
  const searchParams = useSearchParams();
  const {useLoginMutation} = userMutations();

  const {setOtpMutationConfigData} = useOTPContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const returnUrl = getSafeReturnUrl({
    returnUrl: searchParams.get('returnUrl'),
  });

  const onSuccess = ({data: {user}}: {data: {user: User}}) => {
    if (!user) return;

    // Only honor the returnUrl if this user's role can actually access it.
    // A returnUrl left behind by a different-role user (e.g. an admin on the
    // triage-engine page) would otherwise send a caregiver to an unauthorized /
    // not-found page. Fall back to the default dashboard in that case.
    const role = user.currentActiveOrganization?.role;
    const returnPathname = returnUrl ? returnUrl.split(/[?#]/)[0] : null;

    const canUseReturnUrl =
      Boolean(returnPathname) &&
      canAccessRoute({pathname: returnPathname as string, role});

    if (canUseReturnUrl) markReturnUrlRestored();

    router.push({
      url: canUseReturnUrl ? returnUrl! : getHomeRoute({role}),
    });
  };

  const ERROR_REDIRECTS: Record<string, () => string> = {
    [USER_ERRORS_TYPES.userNotVerified.value]:
      AUTH_ROUTES.unverifiedLoginAttempt,
    [USER_ERRORS_TYPES.accountLocked.value]: AUTH_ROUTES.accountLocked,
  };

  const onError = ({error: {type} = {}}: LoginError) => {
    setIsSubmitting(false);

    const redirectRoute = type ? ERROR_REDIRECTS[type] : undefined;

    if (redirectRoute) {
      router.push({url: redirectRoute()});
    }
  };

  const {mutateAsync: executeLoginMutation, isPending} = useLoginMutation();

  const {control, handleSubmit} = useForm<LoginPayload>({
    resolver: zodResolver(ct({constant: loginUserSchema})),
    defaultValues: {email: '', password: ''},
  });

  const onSubmit = (payload: LoginPayload) => {
    setIsSubmitting(true);

    setOtpMutationConfigData({
      mutation: executeLoginMutation,
      payload,
      type: OTP_VIEW_TYPE.page.value,
      otpRegenerateType: OTP_REGENERATE_TYPE.public.value,
      callBackFuncs: {onSuccess, onError},
    });
  };

  return (
    <LoginFormUI
      control={control}
      isPending={isPending || isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
