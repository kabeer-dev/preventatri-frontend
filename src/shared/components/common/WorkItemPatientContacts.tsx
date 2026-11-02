'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {DETAIL_EMPTY_VALUE} from '@/shared/constants/common';
import useTranslation from '@/shared/hooks/useTranslation';
import {WorkItemPatientContactsProps} from '@/shared/interfaces/workItem';

const WorkItemPatientContacts = ({patient}: WorkItemPatientContactsProps) => {
  const {t} = useTranslation();

  const contacts = [
    {
      icon: 'mdi:phone-outline',
      label: t('patients.details.phone'),
      value: patient?.phoneNo,
    },
    {
      icon: 'mdi:email-outline',
      label: t('patients.details.email'),
      value: patient?.email,
    },
  ];

  return (
    <Box className='mt-4 flex flex-col gap-2'>
      {contacts.map(({icon, label, value}) => (
        <Box
          key={label}
          className='flex items-center gap-3'
          sx={{borderRadius: 1, px: 3, py: 2, bgcolor: 'action.hover'}}
        >
          <Icon
            icon={icon}
            fontSize={16}
            color='var(--mui-palette-text-secondary)'
          />
          <Box className='min-w-0'>
            <Typography
              variant='small'
              component='div'
              sx={{color: 'text.secondary'}}
            >
              {label}
            </Typography>
            <Typography
              variant='small'
              component='div'
              sx={{fontWeight: 600, overflowWrap: 'anywhere'}}
            >
              {value || DETAIL_EMPTY_VALUE}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default WorkItemPatientContacts;
