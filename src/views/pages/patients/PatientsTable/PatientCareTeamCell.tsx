'use client';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import useTranslation from '@/shared/hooks/useTranslation';
import {PatientCareTeamCellProps} from '@/shared/interfaces/patient';
import {buildPatientCareTeam} from '@/shared/utils/patientUtils';

/**
 * Everyone on the patient's care team, names only, with the roles on hover.
 * Same builder as the detail page's care team card.
 */
const PatientCareTeamCell = ({patient}: PatientCareTeamCellProps) => {
  const {t} = useTranslation();

  const assigned = buildPatientCareTeam({patient, t});

  if (assigned.length === 0) {
    return (
      <Typography noWrap variant='body' sx={{color: 'text.secondary'}}>
        {t('patients.table.careTeamNone')}
      </Typography>
    );
  }

  const names = Array.from(new Set(assigned.map((member) => member.name)));

  return (
    <Tooltip
      title={
        <Box className='flex flex-col'>
          {assigned.map(({role, name}, index) => (
            <span key={`${role}-${index}`}>{`${role}: ${name}`}</span>
          ))}
        </Box>
      }
    >
      <Typography noWrap variant='body' sx={{color: 'text.secondary'}}>
        {names.join(', ')}
      </Typography>
    </Tooltip>
  );
};

export default PatientCareTeamCell;
