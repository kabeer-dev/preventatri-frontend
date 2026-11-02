'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import RHFAsyncAutocompleteField from '@/shared/components/common/inputs/RHFAsyncAutocompleteField';
import useTranslation from '@/shared/hooks/useTranslation';
import {NurseRegionFieldsProps} from '@/shared/interfaces/nurse';

const NurseRegionFields = ({
  control,
  primaryRegionSource,
  secondaryRegionSource,
  primaryRegionIds,
  secondaryRegionIds,
  isHhaManaged,
  isPrimaryRegionHhaManaged,
}: NurseRegionFieldsProps) => {
  const {t} = useTranslation();

  return (
    <>
      <Box className='flex flex-col gap-1 sm:col-span-2'>
        <RHFAsyncAutocompleteField
          name='primaryRegionIds'
          control={control}
          label={t('nurse.primaryRegions')}
          multiple
          source={primaryRegionSource}
          hiddenValues={secondaryRegionIds}
          disabled={isPrimaryRegionHhaManaged}
        />

        {isHhaManaged && (
          <Typography variant='small' className='text-ink-soft'>
            {isPrimaryRegionHhaManaged
              ? t('nurse.sync.primaryRegionManagedHint')
              : t('nurse.sync.primaryRegionUnresolvedHint')}
          </Typography>
        )}
      </Box>

      <Box className='sm:col-span-2'>
        <RHFAsyncAutocompleteField
          name='secondaryRegionIds'
          control={control}
          label={t('nurse.secondaryRegions')}
          multiple
          source={secondaryRegionSource}
          hiddenValues={primaryRegionIds}
        />
      </Box>
    </>
  );
};

export default NurseRegionFields;
