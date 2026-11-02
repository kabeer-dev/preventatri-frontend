'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

import {OTP_REGENERATE_TYPE, OTP_VIEW_TYPE} from '@/shared/constants/general';
import {USER_SUCCESS_TYPES} from '@/shared/constants/responses/success/users';
import useTranslation from '@/shared/hooks/useTranslation';
import {useOTPContext} from '@/shared/providers/OTPExecutionProvider';
import {userMutations} from '@/shared/reactQuery';
import {passwordUpdateSchema} from '@/shared/schemas/settings';
import {PasswordUpdateFormPayload} from '@/shared/types/settings';

import {LogoutOption} from './logoutOption';
import PasswordUpdateFormUI from './passwordUpdateFormUI';

export default function PasswordUpdateForm() {
  const {ct} = useTranslation();
  const {useUpdateProfileMutation} = userMutations();
  const {setOtpMutationConfigData} = useOTPContext();

  const {mutateAsync: executeProfileUpdateMutation, isPending} =
    useUpdateProfileMutation();

  const {control, handleSubmit, formState, reset} =
    useForm<PasswordUpdateFormPayload>({
      resolver: zodResolver(ct({constant: passwordUpdateSchema})),
      defaultValues: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    });

  const {isDirty} = formState;

  const onSuccess = ({data: {type}}: {data: {type: string}}) => {
    if (type === USER_SUCCESS_TYPES.profileUpdatedSuccessfully.value) {
      reset();
    }
  };

  const onSubmit = (payload: PasswordUpdateFormPayload) => {
    setOtpMutationConfigData({
      mutation: executeProfileUpdateMutation,
      payload,
      type: OTP_VIEW_TYPE.modal.value,
      otpRegenerateType: OTP_REGENERATE_TYPE.private.value,
      callBackFuncs: {onSuccess},
      extraComponentToRender: <LogoutOption />,
    });
  };

  return (
    <PasswordUpdateFormUI
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      isDirty={isDirty}
      isPending={isPending}
    />
  );
}
