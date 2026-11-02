'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {radius} from '@/@core/theme/spacing';
import {ESCALATION_STEP_OPTIONS} from '@/shared/constants/settings';
import useTranslation from '@/shared/hooks/useTranslation';
import {EscalationStepRowProps} from '@/shared/interfaces/settings';
import {EscalationStepType} from '@/shared/types/settings';
import {
  formatEscalationMinutes,
  getDraftStepMinutes,
  isAdminStep,
} from '@/shared/utils/escalationPolicyUtils';

import EscalationChannelsSelect from './EscalationChannelsSelect';
import EscalationDeadlineField from './EscalationDeadlineField';
import EscalationFallbackRow from './EscalationFallbackRow';
import EscalationNoResponse from './EscalationNoResponse';
import EscalationStepHandle from './EscalationStepHandle';
import EscalationTypeSelect from './EscalationTypeSelect';
import {stepColumnsSx, stepRowGridSx} from './styles';

const getStepOption = (type: EscalationStepType) =>
  ESCALATION_STEP_OPTIONS.find(({value}) => value === type);

const EscalationStepRow = ({
  step,
  index,
  nextStep,
  typeOptions,
  isDragging,
  disabled,
  onTypeChange,
  onChannelsChange,
  onTtlValueChange,
  onTtlUnitChange,
  onRemove,
  onMove,
  onDragStart,
  onDragOver,
  onDragEnd,
}: EscalationStepRowProps) => {
  const {t} = useTranslation();

  // Only the handle starts a drag, so selecting text in a field doesn't.
  const [isHandleHeld, setIsHandleHeld] = useState(false);

  const isAdmin = isAdminStep({step});
  const option = getStepOption(step.type);

  const channelsLabel = step.channels
    .map((channel) => t(`escalationSettings.channels.${channel}`))
    .join(' + ');
  const minutes = getDraftStepMinutes({step});

  const deadlineLabel =
    minutes === null ? 'N/A' : formatEscalationMinutes({minutes, t});

  return (
    <Box
      draggable={isHandleHeld && !isAdmin && !disabled}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';

        // Firefox won't start a drag without data.
        event.dataTransfer.setData('text/plain', step.id);
        onDragStart(step.id);
      }}
      onDragOver={(event) => {
        event.preventDefault();

        const rect = event.currentTarget.getBoundingClientRect();

        onDragOver({
          index,
          isLowerHalf: event.clientY > rect.top + rect.height / 2,
        });
      }}
      onDragEnd={() => {
        setIsHandleHeld(false);
        onDragEnd();
      }}
      sx={{
        border: 1,
        borderColor: isDragging ? 'primary.main' : 'divider',
        borderRadius: `${radius.md}px`,
        bgcolor: 'background.paper',
        opacity: isDragging ? 0.6 : 1,
        overflow: 'hidden',
      }}
    >
      <Box className='p-3' sx={stepRowGridSx}>
        <EscalationStepHandle
          step={step}
          index={index}
          isAdmin={isAdmin}
          disabled={disabled}
          onHandleHeldChange={setIsHandleHeld}
          onMove={onMove}
        />

        <Box
          className='mt-1 flex h-6 w-6 items-center justify-center'
          sx={{
            borderRadius: `${radius.full}px`,
            bgcolor: 'customColors.brandTint',
            color: 'primary.main',
          }}
        >
          <Typography variant='caption' sx={{fontWeight: 700}}>
            {index + 1}
          </Typography>
        </Box>

        <Box className='flex min-w-0 flex-col gap-2'>
          <Box sx={stepColumnsSx}>
            <EscalationTypeSelect
              step={step}
              typeOptions={typeOptions}
              disabled={disabled || isAdmin}
              onTypeChange={onTypeChange}
            />

            <EscalationChannelsSelect
              value={step.channels}
              disabled={disabled || isAdmin}
              onChange={(channels) => onChannelsChange({id: step.id, channels})}
            />

            {isAdmin ? (
              <Typography variant='body2' sx={{color: 'text.secondary'}}>
                {t('escalationSettings.noDeadline')}
              </Typography>
            ) : (
              <EscalationDeadlineField
                step={step}
                disabled={disabled}
                onTtlValueChange={onTtlValueChange}
                onTtlUnitChange={onTtlUnitChange}
              />
            )}

            {isAdmin ? (
              <Box />
            ) : (
              <IconButton
                size='small'
                disabled={disabled}
                aria-label={t('escalationSettings.removeStepAriaLabel', {
                  step: index + 1,
                })}
                onClick={() => onRemove({id: step.id})}
                sx={{color: 'error.main', justifySelf: 'start'}}
              >
                <Icon icon='mdi:delete-outline' fontSize={20} />
              </IconButton>
            )}
          </Box>

          {option?.fallbackKey && (
            <EscalationFallbackRow
              fallbackKey={option.fallbackKey}
              channelsLabel={channelsLabel}
              deadlineLabel={deadlineLabel}
            />
          )}
        </Box>
      </Box>

      <EscalationNoResponse index={index} nextStep={nextStep} />
    </Box>
  );
};

export default EscalationStepRow;
