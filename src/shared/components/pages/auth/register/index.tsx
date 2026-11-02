'use client';

import {useState} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

import {AUTH_ROUTES} from '@/shared/constants/paths';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import {userMutations} from '@/shared/reactQuery';
import {registerUserSchema} from '@/shared/schemas/auth';
import {RegisterPayload} from '@/shared/types/auth';

import RegisterFormUI from './RegisterFormUI';

export default function RegisterForm() {
  const {ct} = useTranslation();
  const router = useLocaleRouter();
  const {useSignupMutation} = userMutations();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSuccess = () => {
    router.push({url: AUTH_ROUTES.registerVerifyRequest()});
  };

  const {mutate: executeSignupMutation, isPending} = useSignupMutation();

  const {control, handleSubmit} = useForm<RegisterPayload>({
    resolver: zodResolver(ct({constant: registerUserSchema})),
    defaultValues: {
      organizationName: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      password: '',
    },
  });

  const onSubmit = (payload: RegisterPayload) => {
    setIsSubmitting(true);

    executeSignupMutation({
      payload,
      callBackFuncs: {onSuccess, onError: () => setIsSubmitting(false)},
    });
  };

  return (
    <RegisterFormUI
      control={control}
      isPending={isPending || isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
