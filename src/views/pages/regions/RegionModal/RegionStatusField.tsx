'use client';

import Box from '@mui/material/Box';
import {Controller} from 'react-hook-form';

import FieldLabel from '@/shared/components/common/inputs/FieldLabel';
import SegmentedTabs from '@/shared/components/common/inputs/SegmentedTabs';
import {ACTIVE_STATUS, ACTIVE_STATUS_OPTIONS} from '@/shared/constants/common';
import useTranslation from '@/shared/hooks/useTranslation';
import {RegionStatusFieldProps} from '@/shared/interfaces/region';

const RegionStatusField = ({
  control,
  disabled = false,
}: RegionStatusFieldProps) => {
  const {t} = useTranslation();

  return (
    <Controller
      name='isActive'
      control={control}
      render={({field}) => (
        <Box className='flex flex-col'>
          <FieldLabel>{t('region.status')}</FieldLabel>
          <SegmentedTabs
            fullWidth
            disabled={disabled}
            ariaLabel={t('region.status')}
            options={[...ACTIVE_STATUS_OPTIONS]}
            value={
              field.value
                ? ACTIVE_STATUS.active.value
                : ACTIVE_STATUS.inactive.value
            }
            onChange={({value}) =>
              field.onChange(value === ACTIVE_STATUS.active.value)
            }
          />
        </Box>
      )}
    />
  );
};

export default RegionStatusField;
