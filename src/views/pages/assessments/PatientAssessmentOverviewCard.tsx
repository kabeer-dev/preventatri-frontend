'use client';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import Link from '@/shared/components/common/localeLink';
import PatientInfoBanner from '@/shared/components/common/PatientInfoBanner';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {Patient} from '@/shared/interfaces/patient';

interface PatientAssessmentOverviewCardProps {
  patient: Patient;
  totalMonitoredWeeks: number;
  previousRedFlags: number;
}

const PatientAssessmentOverviewCard = ({
  patient,
  totalMonitoredWeeks,
  previousRedFlags,
}: PatientAssessmentOverviewCardProps) => {
  const {t} = useTranslation();

  return (
    <Card elevation={6}>
      <CardContent sx={{py: 5, px: 5}}>
        <PatientInfoBanner
          patient={patient}
          avatarSize={50}
          sx={{p: 0, boxShadow: 0, mb: 4}}
        />

        {/* Stats */}
        <Box sx={{display: 'flex', gap: 6, mb: 4}}>
          <Box>
            <Typography variant='h4' sx={{fontWeight: 700}}>
              {totalMonitoredWeeks}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('assessments.totalMonitoredWeeks')}
            </Typography>
          </Box>
          <Box>
            <Typography variant='h4' sx={{fontWeight: 700}}>
              {previousRedFlags}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('assessments.previousRedFlags')}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{mb: 4}} />

        {/* Emergency Section */}
        <Typography
          variant='body2'
          sx={{
            color: 'text.secondary',
            mb: 2,
          }}
        >
          {t('assessments.emergencyText')}
        </Typography>
        <Button
          component={Link}
          href={DASHBOARD_ROUTES.patients.redFlag({id: patient.id})}
          variant='outlined'
          color='error'
          fullWidth
          startIcon={<Icon icon='mdi:alert-outline' />}
          sx={{
            fontWeight: 600,
            py: 1.5,
          }}
        >
          {t('assessments.sendRedFlag')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PatientAssessmentOverviewCard;
