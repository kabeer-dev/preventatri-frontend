'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import CustomAvatar from '@/@core/components/mui/avatar';
import {getInitials} from '@/@core/utils/userUtils';
import useTranslation from '@/shared/hooks/useTranslation';
import {PatientCareTeamCardProps} from '@/shared/interfaces/patientDetails';

import PatientHhaCoordinators from './PatientHhaCoordinators';

const PatientCareTeamCard = ({members, patient}: PatientCareTeamCardProps) => {
  const {t} = useTranslation();

  return (
    <Card>
      <CardContent className='flex flex-col gap-3.5'>
        <Typography
          variant='eyebrow'
          component='h2'
          sx={{color: 'text.disabled'}}
        >
          {t('patients.details.careTeam.title')}
        </Typography>

        {members.length === 0 && (
          <Typography variant='small' sx={{color: 'text.disabled'}}>
            {t('patients.details.careTeam.unassigned')}
          </Typography>
        )}

        {members.map(({role, name}, index) => (
          <Box key={`${role}-${index}`} className='flex items-center gap-3'>
            <CustomAvatar
              skin='light'
              color='primary'
              sx={{width: 34, height: 34, fontSize: '0.75rem', flex: 'none'}}
            >
              {getInitials({name})}
            </CustomAvatar>
            <Box className='min-w-0'>
              <Typography noWrap variant='bodyStrong'>
                {name}
              </Typography>
              <Typography noWrap variant='small' sx={{color: 'text.disabled'}}>
                {role}
              </Typography>
            </Box>
          </Box>
        ))}

        {patient && <PatientHhaCoordinators patient={patient} />}
      </CardContent>
    </Card>
  );
};

export default PatientCareTeamCard;
