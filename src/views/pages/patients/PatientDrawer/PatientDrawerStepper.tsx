'use client';

import {Fragment} from 'react';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {PATIENT_DRAWER_STEP_ORDER} from '@/shared/constants/patients';
import useTranslation from '@/shared/hooks/useTranslation';
import {PatientDrawerStepperProps} from '@/shared/interfaces/patient';
import {cn} from '@/shared/utils/tailwindUtils';

const PatientDrawerStepper = ({
  activeStep,
  canOpenCareTeam,
  onStepChange,
}: PatientDrawerStepperProps) => {
  const {t} = useTranslation();

  const activeIndex = PATIENT_DRAWER_STEP_ORDER.indexOf(activeStep);

  return (
    <Box
      component='nav'
      aria-label={t('patients.drawerSteps.label')}
      className='flex items-center gap-3 px-5 py-3'
    >
      {PATIENT_DRAWER_STEP_ORDER.map((step, index) => {
        const isActive = index === activeIndex;
        const isDone = index < activeIndex;
        const isReachable = !isActive && (isDone || canOpenCareTeam);

        return (
          <Fragment key={step}>
            {index > 0 && (
              <Box
                aria-hidden
                className={cn(
                  'h-px min-w-6 flex-auto',
                  isDone || isActive ? 'bg-brand-edge' : 'bg-rule'
                )}
              />
            )}

            <ButtonBase
              type='button'
              disabled={!isReachable}
              disableRipple
              onClick={() => onStepChange({step})}
              aria-current={isActive ? 'step' : undefined}
              className='focus-visible:outline-brand gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2'
            >
              <Box
                component='span'
                className={cn(
                  'grid size-6 place-items-center rounded-full',
                  isActive && 'bg-brand text-white',
                  isDone && 'bg-brand-tint text-brand',
                  !isActive && !isDone && 'bg-segment-track text-ink-soft'
                )}
              >
                {isDone ? (
                  <Icon icon='mdi:check' fontSize={14} aria-hidden />
                ) : (
                  <Typography variant='eyebrow' component='span'>
                    {index + 1}
                  </Typography>
                )}
              </Box>
              <Typography
                variant={isActive ? 'bodyStrong' : 'body2'}
                component='span'
                className={isActive || isDone ? 'text-ink' : 'text-ink-soft'}
              >
                {t(`patients.drawerSteps.${step}`)}
              </Typography>
            </ButtonBase>
          </Fragment>
        );
      })}
    </Box>
  );
};

export default PatientDrawerStepper;
