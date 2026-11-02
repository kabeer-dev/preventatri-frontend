'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import CustomAvatar from '@/@core/components/mui/avatar';
import {getInitials} from '@/@core/utils/userUtils';
import Link from '@/shared/components/common/localeLink';
import WorkItemPatientContacts from '@/shared/components/common/WorkItemPatientContacts';
import {DETAIL_IDENTITY_SEPARATOR} from '@/shared/constants/common';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {WorkItemPatientCardProps} from '@/shared/interfaces/workItem';
import {getAgeInYears} from '@/shared/utils/dateUtils';
import {getFullName} from '@/shared/utils/general';
import {getAlertTypeLabelKey} from '@/shared/utils/workItemUtils';

// The patient a work item is for, with the alert it came from when there is one.
const WorkItemPatientCard = ({
  patientId,
  patient,
  alert,
  title,
  openPatientLabel,
}: WorkItemPatientCardProps) => {
  const {t} = useTranslation();

  const name = getFullName({
    firstName: patient?.firstName,
    lastName: patient?.lastName,
    lastFirst: true,
  });

  const identity = [
    getAgeInYears({dob: patient?.dateOfBirth ?? undefined}),
    patient?.gender,
    patient?.county?.name,
  ]
    .filter(Boolean)
    .join(DETAIL_IDENTITY_SEPARATOR);

  return (
    <Card elevation={6}>
      <CardContent className='p-4'>
        <Typography
          variant='caption'
          className='mb-3 block font-bold uppercase'
          sx={{color: 'text.secondary', letterSpacing: 0.6}}
        >
          {title}
        </Typography>

        <Box className='flex items-center gap-3'>
          <CustomAvatar skin='light' color='error' sx={{width: 40, height: 40}}>
            {getInitials({name})}
          </CustomAvatar>
          <Box className='min-w-0'>
            <Typography noWrap variant='bodyStrong'>
              {name}
            </Typography>
            <Typography noWrap variant='small' sx={{color: 'text.disabled'}}>
              {identity}
            </Typography>
          </Box>
        </Box>

        <WorkItemPatientContacts patient={patient} />

        {alert && (
          <Box
            component={Link}
            href={DASHBOARD_ROUTES.emergencyFlags.single({id: alert.id})}
            sx={{
              mt: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderRadius: 1,
              px: 3,
              py: 2,
              bgcolor: 'action.hover',
              color: 'text.primary',
              textDecoration: 'none',
            }}
          >
            <Icon
              icon='mdi:alert'
              fontSize={16}
              color='var(--mui-palette-error-main)'
            />
            <Typography noWrap variant='small' sx={{fontWeight: 600}}>
              {t(getAlertTypeLabelKey({alert}))} · {alert.description}
            </Typography>
          </Box>
        )}

        <Typography
          component={Link}
          href={DASHBOARD_ROUTES.patients.single({id: patientId})}
          variant='small'
          sx={{display: 'block', mt: 3, fontWeight: 600, color: 'primary.main'}}
        >
          {openPatientLabel}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WorkItemPatientCard;
