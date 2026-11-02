'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import CustomAvatar from '@/@core/components/mui/avatar';
import {getInitials} from '@/@core/utils/userUtils';
import HhaCoordinatorPickerModal from '@/shared/components/common/hhaSync/HhaCoordinatorPickerModal';
import {useModal} from '@/shared/hooks/modals/useModal';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {PatientHhaCoordinatorsProps} from '@/shared/interfaces/patientDetails';
import {getFullName} from '@/shared/utils/general';

const KEY = 'patients.details.careTeam';

// The HHAeXchange coordinators who are not the case manager here: shown for
// reference only, with the admin's way to choose a different one.
const PatientHhaCoordinators = ({patient}: PatientHhaCoordinatorsProps) => {
  const {t} = useTranslation();
  const {isAdmin} = useUserRole();
  const {isModalOpen, openModal, closeModal} = useModal();

  const coordinators = patient.hhaCoordinators || [];
  const others = coordinators.filter(({isCaseManager}) => !isCaseManager);

  if (coordinators.length < 2) return null;

  return (
    <>
      {others.map(({slot, name}) => (
        <Box key={slot} className='flex items-center gap-3'>
          <CustomAvatar
            skin='light'
            color='secondary'
            sx={{width: 34, height: 34, fontSize: '0.75rem', flex: 'none'}}
          >
            {getInitials({name})}
          </CustomAvatar>
          <Box className='min-w-0'>
            <Typography noWrap variant='bodyStrong'>
              {name}
            </Typography>
            <Typography variant='small' sx={{color: 'text.disabled'}}>
              {t(`${KEY}.hhaCoordinator`)}
            </Typography>
          </Box>
        </Box>
      ))}

      {isAdmin && (
        <Button size='small' variant='outlined' onClick={openModal}>
          {t(`${KEY}.changeCaseManager`)}
        </Button>
      )}

      <HhaCoordinatorPickerModal
        key={isModalOpen ? patient.id : 'closed'}
        target={{
          patientId: patient.id,
          name: getFullName({
            firstName: patient.firstName,
            lastName: patient.lastName,
          }),
          coordinators,
        }}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default PatientHhaCoordinators;
