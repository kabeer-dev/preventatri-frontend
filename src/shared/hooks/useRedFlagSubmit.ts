'use client';

import {useCallback, useRef, useState} from 'react';

import {AudioRecorderHandle} from '@/shared/components/common/inputs/AudioRecorder';
import {SendRedFlagParams} from '@/shared/interfaces/hooks';
import {assessmentMutations} from '@/shared/reactQuery';
import {buildRedFlagFormData} from '@/shared/utils/redFlagUtils';

/**
 * The attachments and the one request behind every red flag form. The
 * caregiver's form and the nurse's page both hold their photos and voice note
 * here, so the two send the same multipart body.
 */
const useRedFlagSubmit = () => {
  const {useCreateEmergencyFlagMutation} = assessmentMutations();

  const audioRecorderRef = useRef<AudioRecorderHandle | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const {mutate: createRedFlag, isPending: isSubmitting} =
    useCreateEmergencyFlagMutation();

  const onImagesChange = useCallback(({files}: {files: File[]}) => {
    setImages(files);
  }, []);

  const onAudioChange = useCallback(
    ({audioBlob: blob}: {audioBlob: Blob | null}) => {
      setAudioBlob(blob);
    },
    []
  );

  const sendRedFlag = async ({
    reason,
    description,
    patientId,
    onSuccess,
  }: SendRedFlagParams) => {
    let finalAudioBlob = audioBlob;

    // Send is often hit while still talking. Stop the recorder first so the
    // note just made travels with the flag.
    if (audioRecorderRef.current?.isRecording) {
      const blob = await audioRecorderRef.current.stopRecording();

      if (blob) {
        finalAudioBlob = blob;
        setAudioBlob(blob);
      }
    }

    createRedFlag({
      payload: buildRedFlagFormData({
        reason,
        description,
        patientId,
        images,
        audioBlob: finalAudioBlob,
      }),
      callBackFuncs: {onSuccess},
    });
  };

  return {
    audioRecorderRef,
    images,
    audioBlob,
    onImagesChange,
    onAudioChange,
    sendRedFlag,
    isSubmitting,
  };
};

export default useRedFlagSubmit;
