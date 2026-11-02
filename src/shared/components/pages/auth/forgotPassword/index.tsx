'use client';

import {useState} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

import useTranslation from '@/shared/hooks/useTranslation';
import {userMutations} from '@/shared/reactQuery';
import {sendResetPasswordLinkSchema} from '@/shared/schemas/auth';
import {ForgotPasswordPayload} from '@/shared/types/auth';

import ForgotPasswordFormUI from './ForgotPasswordFormUI';
import LinkSentResetUI from './LinkSentResetUI';

export default function ForgotPasswordForm() {
  const {ct} = useTranslation();

  const {useSendResetPasswordMutation} = userMutations();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentToEmail, setSentToEmail] = useState<string | null>(null);

  const {mutate: executeSendResetPasswordMutation, isPending} =
    useSendResetPasswordMutation();

  const {control, handleSubmit} = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(ct({constant: sendResetPasswordLinkSchema})),
    defaultValues: {email: ''},
  });

  const onSubmit = (payload: ForgotPasswordPayload) => {
    setIsSubmitting(true);

    const revealNothing = () => {
      setIsSubmitting(false);
      setSentToEmail(payload.email);
    };

    executeSendResetPasswordMutation({
      payload,
      callBackFuncs: {onError: revealNothing, onSuccess: revealNothing},
    });
  };

  if (sentToEmail) {
    return (
      <LinkSentResetUI
        email={sentToEmail}
        onResend={() => setSentToEmail(null)}
      />
    );
  }

  return (
    <ForgotPasswordFormUI
      control={control}
      isPending={isPending || isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
