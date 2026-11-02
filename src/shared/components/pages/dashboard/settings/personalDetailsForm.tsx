'use client';

import {useEffect} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

import {OTP_REGENERATE_TYPE, OTP_VIEW_TYPE} from '@/shared/constants/general';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useTranslation from '@/shared/hooks/useTranslation';
import {User} from '@/shared/interfaces/auth';
import {useOTPContext} from '@/shared/providers/OTPExecutionProvider';
import {userMutations} from '@/shared/reactQuery';
import {personalDetailsSchema} from '@/shared/schemas/settings';
import {PersonalDetailsUpdateFormPayload} from '@/shared/types/settings';
import {showToast} from '@/shared/utils/toasts';

import PersonalDetailsFormUI from './personalDetailsFormUI';

const defaultValues: PersonalDetailsUpdateFormPayload = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNo: '',
  address: '',
  city: '',
  zipCode: '',
};

const generateDefaultValue = ({
  user,
}: {
  user: User;
}): PersonalDetailsUpdateFormPayload => ({
  firstName: user.firstName || '',
  lastName: user.lastName || '',
  email: user.email || '',
  phoneNo: user.phoneNo || '',
  address: user.address || '',
  city: user.city || '',
  zipCode: user.zipCode || '',
});

export default function PersonalDetailsForm() {
  const {t, ct} = useTranslation();
  const {useUpdateProfileMutation} = userMutations();

  const {setOtpMutationConfigData} = useOTPContext();

  const {currentUser: user} = useGetLoggedInUser();

  const {mutateAsync: executeProfileUpdateMutation, isPending} =
    useUpdateProfileMutation();

  const {control, handleSubmit, formState, reset} =
    useForm<PersonalDetailsUpdateFormPayload>({
      resolver: zodResolver(ct({constant: personalDetailsSchema})),
      defaultValues,
    });

  const {isDirty, dirtyFields} = formState;

  useEffect(() => {
    if (user) {
      reset(generateDefaultValue({user}));
    }
  }, [user, reset]);

  const onSubmit = (payload: PersonalDetailsUpdateFormPayload) => {
    const dirtyPayload = (
      Object.keys(dirtyFields) as Array<keyof PersonalDetailsUpdateFormPayload>
    ).reduce((acc, key) => {
      if (dirtyFields[key]) {
        Object.assign(acc, {[key]: payload[key]});
      }

      return acc;
    }, {} as Partial<PersonalDetailsUpdateFormPayload>);

    if (dirtyPayload.email && dirtyPayload.phoneNo) {
      showToast({
        type: 'warning',
        message: t('personalDetailsForm.updateOneFieldOnly'),
      });

      return;
    }

    setOtpMutationConfigData({
      mutation: executeProfileUpdateMutation,
      payload: dirtyPayload,
      type: OTP_VIEW_TYPE.modal.value,
      otpRegenerateType: OTP_REGENERATE_TYPE.private.value,
    });
  };

  const handleFormReset = () => {
    if (user) reset(generateDefaultValue({user}));
  };

  return (
    <PersonalDetailsFormUI
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      onReset={handleFormReset}
      isDirty={isDirty}
      isPending={isPending}
    />
  );
}
