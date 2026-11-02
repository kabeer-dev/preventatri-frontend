'use client';

import {useState} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, useWatch} from 'react-hook-form';

import {RED_FLAG_OTHER_REASON} from '@/shared/constants/redFlag';
import useCaregiverPatientOptions from '@/shared/hooks/useCaregiverPatientOptions';
import useRedFlagSubmit from '@/shared/hooks/useRedFlagSubmit';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverRedFlagFormState} from '@/shared/interfaces/caregiverRedFlag';
import {caregiverRedFlagSchema} from '@/shared/schemas/redFlag';
import {
  CaregiverRedFlagInput,
  CaregiverRedFlagValues,
} from '@/shared/types/redFlag';
import {buildRedFlagDescription} from '@/shared/utils/redFlagUtils';

/**
 * The red flag form's state and its one request. Both shells call this, so the
 * dialog on a desktop and the full screen on a phone send exactly the same
 * multipart body to POST /assessments/emergency-flags.
 *
 * "Other" has no free-text field on the API, so the text the caregiver types
 * is carried at the front of the description and the reason stays the "Other"
 * value the backend already knows.
 */
const useRedFlagForm = ({
  defaultPatientId = '',
}: {defaultPatientId?: string} = {}): CaregiverRedFlagFormState => {
  const {t} = useTranslation();

  const [sentPatientFirstName, setSentPatientFirstName] = useState('');
  const [isSent, setIsSent] = useState(false);

  const {patients, isLoading: isPatientsLoading} = useCaregiverPatientOptions();

  const {
    audioRecorderRef,
    images,
    onImagesChange,
    onAudioChange,
    sendRedFlag,
    isSubmitting,
  } = useRedFlagSubmit();

  const {
    control,
    handleSubmit,
    formState: {isValid},
  } = useForm<CaregiverRedFlagInput, unknown, CaregiverRedFlagValues>({
    resolver: zodResolver(caregiverRedFlagSchema({t})),
    mode: 'onChange',
    defaultValues: {
      patientId: defaultPatientId,
      reason: '',
      otherReason: '',
      description: '',
    },
  });

  const patientId = useWatch({control, name: 'patientId'});
  const reason = useWatch({control, name: 'reason'});

  const selectedPatient =
    patients.find((patient) => patient.id === patientId) || null;

  const submitRedFlag = (values: CaregiverRedFlagValues) =>
    sendRedFlag({
      reason: values.reason,
      description: buildRedFlagDescription({
        reason: values.reason,
        otherReason: values.otherReason,
        description: values.description,
      }),
      patientId: values.patientId,
      onSuccess: () => {
        setSentPatientFirstName(selectedPatient?.firstName || '');
        setIsSent(true);
      },
    });

  return {
    control,
    patients,
    isPatientsLoading,
    selectedPatient,
    isOtherReason: Number(reason) === RED_FLAG_OTHER_REASON,
    images,
    onImagesChange,
    onAudioChange,
    audioRecorderRef,
    onSubmit: () => handleSubmit(submitRedFlag)(),
    isSubmitting,
    isValid,
    isSent,
    sentPatientFirstName,
  };
};

export default useRedFlagForm;
