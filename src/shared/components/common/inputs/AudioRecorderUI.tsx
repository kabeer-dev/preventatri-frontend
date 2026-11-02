import {Icon} from '@iconify/react';

import CustomAudioPlayer from '@/shared/components/common/audio/CustomAudioPlayer';
import {MAX_AUDIO_RECORDING_SECONDS} from '@/shared/constants/general';
import {cn} from '@/shared/utils/tailwindUtils';

const WAVEFORM_BARS = 7;

// eslint-disable-next-line local-rules/enforce-single-object-param
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

interface AudioRecorderUIProps {
  state: 'idle' | 'recording' | 'recorded';
  disabled?: boolean;
  idleLabel: string;
  maxDurationLabel: string;
  stopLabel: string;
  recordedLabel: string;
  elapsedSeconds: number;
  audioUrl: string | null;
  onToggleRecording: () => void;
  onRemove: () => void;
}

const AudioRecorderUI = ({
  state,
  disabled,
  idleLabel,
  maxDurationLabel,
  stopLabel,
  recordedLabel,
  elapsedSeconds,
  audioUrl,
  onToggleRecording,
  onRemove,
}: AudioRecorderUIProps) => {
  if (state === 'idle') {
    return (
      <button
        type='button'
        aria-label={idleLabel}
        disabled={disabled}
        onClick={onToggleRecording}
        className={cn(
          'flex w-full cursor-pointer items-center gap-3 rounded-[10px] border-[1.5px] border-dashed',
          'border-error bg-error/4 px-3.5 py-2.5 text-left text-inherit transition-colors',
          'hover:bg-error/8',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          'focus-visible:outline-error',
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-error/12'>
          <Icon
            icon='mdi:microphone-outline'
            className='text-[1.25rem] text-error'
          />
        </div>
        <p className='flex-1 text-sm font-medium text-[var(--mui-palette-text-primary)]'>
          {idleLabel}
        </p>
        <span className='text-xs text-[var(--mui-palette-text-secondary)]'>
          {maxDurationLabel}
        </span>
      </button>
    );
  }

  if (state === 'recording') {
    return (
      <div className='flex items-center gap-3 rounded-[10px] border-[1.5px] border-error bg-error/8 px-3.5 py-3'>
        <button
          type='button'
          aria-label={stopLabel}
          onClick={onToggleRecording}
          className={cn(
            'flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full',
            'text-error transition-opacity hover:opacity-75',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
            'focus-visible:outline-error'
          )}
        >
          <Icon icon='mdi:stop-circle' className='text-[28px]' />
        </button>

        <div className='flex flex-1 items-center gap-[3px]'>
          {Array.from({length: WAVEFORM_BARS}, (_, i) => (
            <div
              key={i}
              className='w-[3px] rounded-full bg-error'
              style={{
                animation: 'audio-waveform 0.8s ease-in-out infinite',
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>

        <span className='shrink-0 text-xs font-semibold text-error'>
          {formatTime(elapsedSeconds)} /{' '}
          {formatTime(MAX_AUDIO_RECORDING_SECONDS)}
        </span>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-1.5 px-1'>
        <Icon
          icon='mdi:microphone'
          className='text-[1.15rem] text-[var(--mui-palette-primary-main)]'
        />
        <p
          className={cn(
            'flex-1 text-sm font-medium',
            'text-[var(--mui-palette-primary-main)]'
          )}
        >
          {recordedLabel}
        </p>
        <button
          type='button'
          disabled={disabled}
          onClick={onRemove}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-full',
            'transition-colors hover:bg-[var(--mui-palette-action-hover)]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
            'focus-visible:outline-[var(--mui-palette-primary-main)]',
            disabled && 'pointer-events-none opacity-50'
          )}
        >
          <Icon icon='mdi:close' className='text-base' />
        </button>
      </div>
      {audioUrl && <CustomAudioPlayer src={audioUrl} />}
    </div>
  );
};

export default AudioRecorderUI;
