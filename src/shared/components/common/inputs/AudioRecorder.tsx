'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  AUDIO_MIME_TYPE,
  AUDIO_RECORDER_MIME_TYPES,
  type AudioRecorderMimeType,
  MAX_AUDIO_RECORDING_SECONDS,
} from '@/shared/constants/general';
import useTranslation from '@/shared/hooks/useTranslation';
import {showToast} from '@/shared/utils/toasts';

import AudioRecorderUI from './AudioRecorderUI';

export interface AudioRecorderHandle {
  isRecording: boolean;
  stopRecording: () => Promise<Blob | null>;
}

interface AudioRecorderProps {
  onAudioChange: ({audioBlob}: {audioBlob: Blob | null}) => void;
  disabled?: boolean;
  idleLabel?: string;
  recordingLabel?: string;
  recordedLabel?: string;
}

const AudioRecorder = forwardRef<AudioRecorderHandle, AudioRecorderProps>(
  (
    {onAudioChange, disabled, idleLabel, recordingLabel, recordedLabel},
    ref
  ) => {
    const {t} = useTranslation();
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const elapsedRef = useRef(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const stopResolverRef = useRef<((blob: Blob | null) => void) | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimer = useCallback(() => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        isRecording,
        stopRecording: () =>
          // eslint-disable-next-line local-rules/enforce-single-object-param
          new Promise<Blob | null>((resolve) => {
            if (!isRecording || !mediaRecorderRef.current) {
              resolve(null);

              return;
            }

            stopResolverRef.current = resolve;
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearTimer();
          }),
      }),
      [isRecording, clearTimer]
    );

    const audioUrl = useMemo(
      () => (audioBlob ? URL.createObjectURL(audioBlob) : null),
      [audioBlob]
    );

    const supportedAudioMimeType = useMemo<AudioRecorderMimeType | ''>(() => {
      if (
        typeof MediaRecorder === 'undefined' ||
        typeof MediaRecorder.isTypeSupported !== 'function'
      ) {
        return '';
      }

      return (
        AUDIO_RECORDER_MIME_TYPES.find((mimeType) =>
          MediaRecorder.isTypeSupported(mimeType)
        ) || ''
      );
    }, []);

    const stopMediaStream = useCallback(() => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      mediaRecorderRef.current = null;
    }, []);

    useEffect(() => {
      return () => {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
      };
    }, [audioUrl]);

    useEffect(
      () => () => {
        const mediaRecorder = mediaRecorderRef.current;

        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.ondataavailable = null;
          mediaRecorder.onstop = null;
          mediaRecorder.stop();
        }

        stopMediaStream();
        clearTimer();
      },
      [stopMediaStream, clearTimer]
    );

    const handleToggleRecording = useCallback(async () => {
      if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        clearTimer();

        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        showToast({
          type: 'error',
          message: t('audioRecorder.microphoneUnavailable'),
        });

        return;
      }

      if (typeof MediaRecorder === 'undefined') {
        showToast({
          type: 'error',
          message: t('audioRecorder.recordingUnsupported'),
        });

        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});

        const mediaRecorder = supportedAudioMimeType
          ? new MediaRecorder(stream, {mimeType: supportedAudioMimeType})
          : new MediaRecorder(stream);
        const chunks: BlobPart[] = [];

        streamRef.current = stream;
        mediaRecorder.ondataavailable = ({data}: BlobEvent) => {
          if (data.size > 0) {
            chunks.push(data);
          }
        };

        mediaRecorder.onstop = () => {
          clearTimer();

          const blob = new Blob(chunks, {
            type:
              mediaRecorder.mimeType ||
              supportedAudioMimeType ||
              AUDIO_MIME_TYPE,
          });

          setIsRecording(false);
          stopMediaStream();

          const finalBlob = blob.size === 0 ? null : blob;

          if (finalBlob) {
            setAudioBlob(finalBlob);
            onAudioChange({audioBlob: finalBlob});
          }

          if (stopResolverRef.current) {
            stopResolverRef.current(finalBlob);
            stopResolverRef.current = null;
          }
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
        setElapsedSeconds(0);
        elapsedRef.current = 0;
        timerRef.current = setInterval(() => {
          elapsedRef.current += 1;
          setElapsedSeconds(elapsedRef.current);

          if (elapsedRef.current >= MAX_AUDIO_RECORDING_SECONDS) {
            clearTimer();
            mediaRecorderRef.current?.stop();
          }
        }, 1000);
      } catch (_error) {
        stopMediaStream();
        setIsRecording(false);
        clearTimer();
        showToast({
          type: 'error',
          message: t('audioRecorder.microphoneAccessError'),
        });
      }
    }, [
      isRecording,
      onAudioChange,
      stopMediaStream,
      supportedAudioMimeType,
      clearTimer,
      t,
    ]);

    const handleRemove = useCallback(() => {
      setAudioBlob(null);
      setElapsedSeconds(0);
      onAudioChange({audioBlob: null});
    }, [onAudioChange]);

    const state = isRecording ? 'recording' : audioBlob ? 'recorded' : 'idle';

    return (
      <AudioRecorderUI
        state={state}
        disabled={disabled}
        idleLabel={idleLabel || t('audioRecorder.addAudioNote')}
        maxDurationLabel={t('audioRecorder.maxDuration')}
        stopLabel={recordingLabel || t('audioRecorder.stopRecording')}
        recordedLabel={recordedLabel || t('audioRecorder.audioRecorded')}
        elapsedSeconds={elapsedSeconds}
        audioUrl={audioUrl}
        onToggleRecording={handleToggleRecording}
        onRemove={handleRemove}
      />
    );
  }
);

AudioRecorder.displayName = 'AudioRecorder';

export default AudioRecorder;
