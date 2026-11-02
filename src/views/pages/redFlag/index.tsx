'use client';

import {useState} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import useRedFlagSubmit from '@/shared/hooks/useRedFlagSubmit';
import useTranslation from '@/shared/hooks/useTranslation';
import {patientQueries} from '@/shared/reactQuery';
import {redFlagFormSchema} from '@/shared/schemas/redFlag';
import {RedFlagFormInput, RedFlagFormValues} from '@/shared/types/redFlag';
import {transformPatientResponse} from '@/shared/utils/patientUtils';

import RedFlagFormUI from './RedFlagFormUI';
import RedFlagSubmittedUI from './RedFlagSubmittedUI';

interface RedFlagPageProps {
  patientId: string;
}

const RedFlagPage = ({patientId}: RedFlagPageProps) => {
  const {t} = useTranslation();
  const {useFetchPatient} = patientQueries();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [submittedValues, setSubmittedValues] =
    useState<RedFlagFormValues | null>(null);

  const {
    data: patientData,
    isLoading,
    isError,
  } = useFetchPatient({id: patientId});

  const {
    audioRecorderRef,
    images,
    audioBlob,
    onImagesChange,
    onAudioChange,
    sendRedFlag,
    isSubmitting,
  } = useRedFlagSubmit();

  const {
    control,
    handleSubmit,
    formState: {isValid},
  } = useForm<RedFlagFormInput, unknown, RedFlagFormValues>({
    resolver: zodResolver(redFlagFormSchema({t})),
    mode: 'onChange',
    defaultValues: {
      reason: '',
      description: '',
    },
  });

  const submitRedFlag = (data: RedFlagFormValues) =>
    sendRedFlag({
      reason: data.reason,
      description: data.description,
      patientId,
      onSuccess: () => {
        setSubmittedValues(data);
        setIsSubmitted(true);
      },
    });

  const onSubmit = () => handleSubmit(submitRedFlag)();

  if (isLoading) return <PageSkeleton {...PAGE_SKELETONS.redFlagForm} />;

  const rawPatient = patientData?.patient;

  if (!rawPatient || isError) {
    return (
      <ContentNotAvailable
        title={t('patients.notFoundTitle')}
        message={t('patients.notFoundMessage')}
      />
    );
  }

  const patient = transformPatientResponse({patient: rawPatient});

  if (isSubmitted && submittedValues) {
    return (
      <RedFlagSubmittedUI
        patient={patient}
        submittedValues={submittedValues}
        images={images}
        audioBlob={audioBlob}
      />
    );
  }

  return (
    <RedFlagFormUI
      patient={patient}
      control={control}
      images={images}
      onImagesChange={onImagesChange}
      onAudioChange={onAudioChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      isValid={isValid}
      audioRecorderRef={audioRecorderRef}
    />
  );
};

export default RedFlagPage;
