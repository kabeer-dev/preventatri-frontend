'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {radius} from '@/@core/theme/spacing';
import {SLA_BREACH_CARD_SIZES} from '@/shared/constants/flag';
import {SEVERITY_LEVELS} from '@/shared/constants/severity';
import useActiveFlagAccent from '@/shared/hooks/useActiveFlagAccent';
import useTranslation from '@/shared/hooks/useTranslation';
import {SLABreachCardProps} from '@/shared/interfaces/flag';
import {formatDurationLabel} from '@/shared/utils/dateUtils';

export default function SLABreachCard({
  flagType,
  symptom,
  secondsRemaining,
  onDispatch,
  isAccepted = false,
}: SLABreachCardProps) {
  const {t} = useTranslation();

  const {severity, color, tint, ink, edge} = useActiveFlagAccent({flagType});

  const isInfinite = secondsRemaining === null;

  const durationText = formatDurationLabel({
    seconds: secondsRemaining,
    labels: {
      hour: t('patients.details.slaBreachCard.hour'),
      hours: t('patients.details.slaBreachCard.hours'),
      minute: t('patients.details.slaBreachCard.minute'),
      minutes: t('patients.details.slaBreachCard.minutes'),
      noExpiry: t('patients.details.slaBreachCard.noExpiry'),
    },
  });

  return (
    <Card
      component='section'
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: 4,
        rowGap: 3,
        px: 5,
        py: 4,
        backgroundColor: tint,
        border: '1px solid',
        borderColor: edge,
        boxShadow: 'none',
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: SLA_BREACH_CARD_SIZES.iconTile,
          height: SLA_BREACH_CARD_SIZES.iconTile,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: `${radius.sm}px`,
          backgroundColor: edge,
          color: ink,
        }}
      >
        <Icon
          icon='mdi:timer-off-outline'
          fontSize={SLA_BREACH_CARD_SIZES.icon}
        />
      </Box>

      <Box sx={{flex: 1, minWidth: 0}}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            columnGap: 2.5,
          }}
        >
          <Typography variant='h3' component='h2'>
            {isAccepted
              ? t('patients.details.slaBreachCard.acceptedTitle')
              : t('patients.details.slaBreachCard.title')}
          </Typography>
          {!isAccepted && (
            <Typography variant='mono' sx={{color: ink, fontWeight: 600}}>
              {isInfinite
                ? durationText
                : `${durationText} ${t('patients.details.slaBreachCard.timeRemaining')}`}
            </Typography>
          )}
        </Box>

        <Typography variant='body' component='p' color='text.secondary'>
          <Box component='span' sx={{color: ink, fontWeight: 600}}>
            {t(SEVERITY_LEVELS[severity].labelKey)}
          </Box>
          {symptom && ` · ${symptom}`}
        </Typography>
      </Box>

      <Button
        variant='contained'
        color={color}
        onClick={onDispatch}
        sx={{flexShrink: 0, width: {xs: '100%', sm: 'auto'}}}
      >
        {t('patients.details.slaBreachCard.resolveButton')}
      </Button>
    </Card>
  );
}
