'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import CustomChip from '@/@core/components/mui/chip';
import EscalationSettingsSkeleton from '@/shared/components/common/skeletons/EscalationSettingsSkeleton';
import {useEscalationPolicyEditor} from '@/shared/hooks/useEscalationPolicyEditor';
import useTranslation from '@/shared/hooks/useTranslation';
import {formatEscalationMinutes} from '@/shared/utils/escalationPolicyUtils';

import EscalationFlagTabs from './EscalationFlagTabs';
import EscalationStepRow from './EscalationStepRow';
import {stepColumnsSx, stepRowGridSx} from './styles';

const EscalationSettingsCard = () => {
  const {t} = useTranslation();

  const {
    isLoading,
    hasPolicy,
    flag,
    setFlag,
    flagTabs,
    steps,
    totalMinutes,
    unusedTypes,
    isDirty,
    isValid,
    isPending,
    draggingId,
    setDraggingId,
    handleTypeChange,
    handleChannelsChange,
    handleTtlValueChange,
    handleTtlUnitChange,
    handleRemoveStep,
    handleAddStep,
    handleMoveStep,
    handleDiscard,
    handleSave,
  } = useEscalationPolicyEditor();

  if (isLoading) {
    return <EscalationSettingsSkeleton />;
  }

  const flagLabel = t(`escalationSettings.flagNames.${flag}`);

  return (
    <>
      <Stack sx={{mb: 4}}>
        <Typography variant='h5'>{t('escalationSettings.heading')}</Typography>
        <Typography variant='body2' sx={{color: 'text.secondary'}}>
          {t('escalationSettings.subheading')}
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <EscalationFlagTabs
          value={flag}
          tabs={flagTabs}
          onChange={(value) => {
            setDraggingId(null);
            setFlag(value);
          }}
        />

        {hasPolicy ? (
          <Stack spacing={2}>
            <Box className='flex flex-wrap items-start justify-between gap-2'>
              <Box className='min-w-0'>
                <Typography variant='subtitle1' sx={{fontWeight: 700}}>
                  {t('escalationSettings.stepsHeading', {flag: flagLabel})}
                </Typography>
                <Typography variant='body2' sx={{color: 'text.secondary'}}>
                  {t('escalationSettings.stepsSubheading')}
                </Typography>
              </Box>
              <Box className='flex gap-1.5'>
                <CustomChip
                  skin='light'
                  size='small'
                  color='secondary'
                  label={t('escalationSettings.stepCount', {
                    count: steps.length,
                  })}
                />
                <CustomChip
                  skin='light'
                  size='small'
                  color='primary'
                  label={t('escalationSettings.total', {
                    duration: formatEscalationMinutes({
                      minutes: totalMinutes,
                      t,
                    }),
                  })}
                />
              </Box>
            </Box>

            <Box
              aria-hidden
              className='hidden md:grid'
              sx={{...stepRowGridSx, px: '13px'}}
            >
              <span />
              <span />
              <Box sx={stepColumnsSx}>
                {['whoIsNotified', 'notifyVia', 'deadline'].map((column) => (
                  <Typography
                    key={column}
                    variant='caption'
                    sx={{
                      fontWeight: 600,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      letterSpacing: 0.4,
                    }}
                  >
                    {t(`escalationSettings.columns.${column}`)}
                  </Typography>
                ))}
              </Box>
            </Box>

            <Stack
              spacing={1.5}
              onDragOver={(event) => {
                if (draggingId) event.preventDefault();
              }}
            >
              {steps.map((step, index) => (
                <EscalationStepRow
                  key={step.id}
                  step={step}
                  index={index}
                  nextStep={steps[index + 1] ?? null}
                  typeOptions={[step.type, ...unusedTypes]}
                  isDragging={draggingId === step.id}
                  disabled={isPending}
                  onTypeChange={handleTypeChange}
                  onChannelsChange={handleChannelsChange}
                  onTtlValueChange={handleTtlValueChange}
                  onTtlUnitChange={handleTtlUnitChange}
                  onRemove={handleRemoveStep}
                  onMove={handleMoveStep}
                  onDragStart={(id) => setDraggingId(id)}
                  onDragOver={({index: toIndex, isLowerHalf}) => {
                    const fromIndex = steps.findIndex(
                      ({id}) => id === draggingId
                    );

                    // Swap only once the cursor passes the row's middle, so
                    // rows of different heights don't flip back and forth.
                    const hasCrossed =
                      toIndex > fromIndex ? isLowerHalf : !isLowerHalf;

                    if (draggingId && fromIndex >= 0 && hasCrossed)
                      handleMoveStep({id: draggingId, toIndex});
                  }}
                  onDragEnd={() => setDraggingId(null)}
                />
              ))}
            </Stack>

            {unusedTypes.length > 0 && (
              <Box>
                <Button
                  variant='outlined'
                  size='small'
                  disabled={isPending}
                  startIcon={<Icon icon='mdi:plus' fontSize={16} />}
                  onClick={handleAddStep}
                  className='w-auto'
                >
                  {t('escalationSettings.addStep')}
                </Button>
              </Box>
            )}

            <Box className='flex flex-wrap items-center justify-end gap-2'>
              {isDirty && !isValid && (
                <Typography
                  variant='caption'
                  sx={{color: 'error.main', mr: 'auto'}}
                >
                  {t('escalationSettings.invalidHint')}
                </Typography>
              )}
              {isDirty && (
                <Button
                  variant='text'
                  disabled={isPending}
                  onClick={handleDiscard}
                  className='w-auto'
                >
                  {t('escalationSettings.discard')}
                </Button>
              )}
              <Button
                variant='contained'
                disabled={!isDirty || !isValid || isPending}
                onClick={handleSave}
                className='w-auto'
              >
                {t('escalationSettings.save')}
              </Button>
            </Box>
          </Stack>
        ) : (
          <Typography variant='body2' sx={{color: 'text.secondary', py: 4}}>
            {t('escalationSettings.empty')}
          </Typography>
        )}
      </Stack>
    </>
  );
};

export default EscalationSettingsCard;
