'use client';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import {ThemeColor} from '@/@core/theme/types';
import Link from '@/shared/components/common/localeLink';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {formatDate} from '@/shared/utils/dateUtils';
import {Assessment} from '@/views/pages/assessments/types';

import {getAssessmentDateChipColor} from './utils';

interface AssessmentChecklistCardProps {
  assessment: Assessment;
  patientId: string;
}

const AssessmentChecklistCard = ({
  assessment,
  patientId,
}: AssessmentChecklistCardProps) => {
  const {t} = useTranslation();
  const isWeekly = assessment.type === 'Weekly';
  const buttonColor = isWeekly ? 'primary' : 'secondary';
  const label = t('assessments.checklistDateLabel', {type: assessment.type});

  const buttonText = t('assessments.submitChecklistButton', {
    type: assessment.type,
  });

  const chipColor: ThemeColor = getAssessmentDateChipColor({
    date: assessment.date,
  });

  const checklistHref = DASHBOARD_ROUTES.patients.checklist({id: patientId});

  return (
    <Card elevation={6} sx={{height: '100%'}}>
      <CardContent sx={{py: 4, px: 5}}>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 3}}>
          <Typography variant='body1' sx={{fontWeight: 500}}>
            {label}
          </Typography>
          <CustomChip
            label={formatDate({date: assessment.date, format: 'dd MMM yyyy'})}
            color={chipColor}
            size='small'
          />
        </Box>

        <Button
          variant='contained'
          color={buttonColor}
          fullWidth
          disabled={!assessment.isEnabled}
          startIcon={<Icon icon='mdi:clipboard-check-outline' />}
          component={assessment.isEnabled ? Link : 'button'}
          href={assessment.isEnabled ? checklistHref : undefined}
          sx={{
            fontWeight: 600,
            py: 1.5,
          }}
        >
          {buttonText}
        </Button>

        <Typography
          variant='caption'
          sx={{
            color: 'text.disabled',
            display: 'block',
            mt: 2,
          }}
        >
          {assessment.isEnabled
            ? t('assessments.checklistAvailable')
            : t('assessments.checklistNotAvailable')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AssessmentChecklistCard;
