'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import {Controller, Control} from 'react-hook-form';

import CustomAvatar from '@/@core/components/mui/avatar';
import {controlHeight, radius} from '@/@core/theme/spacing';
import {getInitials} from '@/@core/utils/userUtils';
import CardRow from '@/shared/components/common/CardRow';
import EmptyLine from '@/shared/components/common/EmptyLine';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverPatientOption} from '@/shared/interfaces/patient';
import {
  CaregiverRedFlagInput,
  CaregiverRedFlagValues,
} from '@/shared/types/redFlag';

interface Props {
  control: Control<CaregiverRedFlagInput, unknown, CaregiverRedFlagValues>;
  patients: CaregiverPatientOption[];
  selectedPatient: CaregiverPatientOption | null;
}

/**
 * The phone's patient field: the chosen patient as a row, with "Change"
 * opening the rest of the caregiver's patients underneath it.
 */
const PatientPicker = ({control, patients, selectedPatient}: Props) => {
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Controller
      name='patientId'
      control={control}
      render={({field: {value, onChange}}) => {
        const isListOpen = isOpen || !value;

        return (
          <Box>
            {selectedPatient && (
              <ButtonBase
                onClick={() => setIsOpen((current) => !current)}
                sx={{
                  width: '100%',
                  gap: 3,
                  px: 3.5,
                  minHeight: 60,
                  justifyContent: 'flex-start',
                  borderRadius: `${radius.md}px`,
                  border: '1.5px solid',
                  borderColor: 'divider',
                }}
              >
                <CustomAvatar
                  skin='light'
                  sx={{
                    width: 38,
                    height: 38,
                    flex: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                  }}
                >
                  {getInitials({name: selectedPatient.name})}
                </CustomAvatar>

                <Typography
                  noWrap
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    textAlign: 'left',
                    fontSize: '0.96875rem',
                    fontWeight: 600,
                  }}
                >
                  {selectedPatient.name}
                </Typography>

                <Typography
                  component='span'
                  sx={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'primary.main',
                    flex: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t('caregiverRedFlag.change')}
                </Typography>
              </ButtonBase>
            )}

            {isListOpen && (
              <Box
                sx={{
                  mt: selectedPatient ? 2 : 0,
                  borderRadius: `${radius.md}px`,
                  border: '1.5px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                }}
              >
                {patients.length === 0 && (
                  <EmptyLine
                    text={t('caregiverPortal.patients.empty')}
                    sx={{px: 3.5, py: 3}}
                  />
                )}

                {patients.map((patient, index) => (
                  <CardRow
                    key={patient.id}
                    isFirst={index === 0}
                    minHeight={controlHeight.xl}
                    tone={patient.id === value ? 'selected' : 'default'}
                    onClick={() => {
                      onChange(patient.id);
                      setIsOpen(false);
                    }}
                  >
                    <Typography
                      noWrap
                      sx={{fontSize: '0.9375rem', fontWeight: 600}}
                    >
                      {patient.name}
                    </Typography>
                  </CardRow>
                ))}
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};

export default PatientPicker;
