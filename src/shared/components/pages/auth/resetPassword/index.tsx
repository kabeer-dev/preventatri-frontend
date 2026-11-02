'use client';

import {useState} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {jwtDecode} from 'jwt-decode';
import {useForm} from 'react-hook-form';

import useTranslation from '@/shared/hooks/useTranslation';
import {userMutations} from '@/shared/reactQuery';
import {resetPasswordSchema} from '@/shared/schemas/auth';
import {ResetPasswordPayload} from '@/shared/types/auth';
import {tryCatch} from '@/shared/utils/tryCatchUtils';

import InvalidTokenCard from './InvalidTokenCard';
import PasswordUpdatedCard from './PasswordUpdatedCard';
import ResetPasswordFormUI from './ResetPasswordFormUI';

export default function ResetPassword({token}: {token: string}) {
  const {ct} = useTranslation();

  const [tokenError] = useState(() => {
    const {success} = tryCatch({fn: () => jwtDecode(token)});

    return !success;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

  const {control, handleSubmit} = useForm<ResetPasswordPayload>({
    resolver: zodResolver(ct({constant: resetPasswordSchema})),
    defaultValues: {password: '', confirmPassword: ''},
  });

  const onSuccess = () => {
    setIsSubmitting(false);
    setIsPasswordUpdated(true);
  };

  const onError = () => {
    setIsSubmitting(false);
  };

  const {useResetPasswordMutation} = userMutations();

  const {mutate: executeResetPasswordMutation, isPending} =
    useResetPasswordMutation();

  const onSubmit = (payload: ResetPasswordPayload) => {
    setIsSubmitting(true);

    executeResetPasswordMutation({
      payload,
      params: {token},
      callBackFuncs: {onError, onSuccess},
    });
  };

  if (tokenError) {
    return <InvalidTokenCard />;
  }

  if (isPasswordUpdated) {
    return <PasswordUpdatedCard />;
  }

  return (
    <ResetPasswordFormUI
      control={control}
      isPending={isPending || isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
