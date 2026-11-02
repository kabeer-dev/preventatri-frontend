'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {UserGridCell} from '@/shared/components/common/table/UserGridCell';
import useTranslation from '@/shared/hooks/useTranslation';
import {SupervisoryVisitCardProps} from '@/shared/interfaces/supervisoryVisit';
import {getRoleLabel} from '@/shared/utils/workItemUtils';

// Who was (or will be) present besides the nurse.
const SupervisoryVisitCaregiversCard = ({visit}: SupervisoryVisitCardProps) => {
  const {t} = useTranslation();
  const caregivers = visit.caregivers || [];

  return (
    <Card elevation={6}>
      <CardContent className='p-4'>
        <Typography
          variant='caption'
          className='mb-3 block font-bold uppercase'
          sx={{color: 'text.secondary', letterSpacing: 0.6}}
        >
          {t('supervisoryVisits.detail.caregiversPresent')}
        </Typography>

        {caregivers.length === 0 ? (
          <Typography variant='body2' sx={{color: 'text.disabled'}}>
            {t('supervisoryVisits.detail.noCaregivers')}
          </Typography>
        ) : (
          <Stack spacing={2}>
            {caregivers.map((caregiver) => (
              <UserGridCell
                key={caregiver.userOrgId}
                firstName={caregiver.user?.firstName ?? ''}
                lastName={caregiver.user?.lastName ?? ''}
                meta={getRoleLabel({role: caregiver.role})}
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default SupervisoryVisitCaregiversCard;
