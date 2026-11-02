'use client';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import SegmentedTabs from '@/shared/components/common/inputs/SegmentedTabs';
import {
  CAREGIVER_ACTIVITY_KINDS,
  CAREGIVER_ACTIVITY_RANGES,
  CAREGIVER_ALL_PATIENTS,
} from '@/shared/constants/caregiver';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverPatientOption} from '@/shared/interfaces/patient';

interface Props {
  kind: string;
  patient: string;
  range: number;
  patients: CaregiverPatientOption[];
  onKindChange: ({value}: {value: string}) => void;
  onPatientChange: ({value}: {value: string}) => void;
  onRangeChange: ({value}: {value: number}) => void;
}

const SELECT_SX = {
  minWidth: 160,
  '& .MuiSelect-select': {py: 2, fontSize: '0.8125rem'},
};

/** The one filter row: what kind, whose, and how far back. */
const ActivityFilters = ({
  kind,
  patient,
  range,
  patients,
  onKindChange,
  onPatientChange,
  onRangeChange,
}: Props) => {
  const {t} = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 3,
        mt: 4,
      }}
    >
      <SegmentedTabs
        flat
        value={kind}
        ariaLabel={t('caregiverActivity.filter.kind')}
        options={Object.values(CAREGIVER_ACTIVITY_KINDS).map((value) => ({
          value,
          label: t(`caregiverActivity.kind.${value}`),
        }))}
        onChange={onKindChange}
      />

      <Select
        value={patient}
        onChange={(event) =>
          onPatientChange({value: String(event.target.value)})
        }
        inputProps={{'aria-label': t('caregiverActivity.filter.patient')}}
        sx={{...SELECT_SX, ml: {md: 'auto'}}}
      >
        <MenuItem value={CAREGIVER_ALL_PATIENTS}>
          {t('caregiverActivity.allPatients')}
        </MenuItem>

        {patients.map(({id, name}) => (
          <MenuItem key={id} value={id}>
            {name}
          </MenuItem>
        ))}
      </Select>

      <Select
        value={range}
        onChange={(event) => onRangeChange({value: Number(event.target.value)})}
        inputProps={{'aria-label': t('caregiverActivity.filter.range')}}
        sx={SELECT_SX}
      >
        {Object.values(CAREGIVER_ACTIVITY_RANGES).map((days) => (
          <MenuItem key={days} value={days}>
            {t('caregiverActivity.lastDays', {count: days})}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default ActivityFilters;
