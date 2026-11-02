'use client';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import FieldLabel from '@/shared/components/common/inputs/FieldLabel';
import RHFAsyncAutocompleteField from '@/shared/components/common/inputs/RHFAsyncAutocompleteField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {FormDrawer} from '@/shared/components/common/modals';
import useTranslation from '@/shared/hooks/useTranslation';
import {RegionModalUIProps} from '@/shared/interfaces/region';

import RegionStatusField from './RegionStatusField';

const RegionModalUI = ({
  isOpen,
  onClose,
  onSubmit,
  control,
  isLoading = false,
  isEditMode = false,
  isDirty = false,
  regionCode,
  countySource,
  primaryNurseSource,
  secondaryNurseSource,
  primaryNurseIds,
  secondaryNurseIds,
}: RegionModalUIProps) => {
  const {t} = useTranslation();

  return (
    <FormDrawer
      title={isEditMode ? t('region.editModalTitle') : t('region.modalTitle')}
      subtitle={t('region.drawerSubtitle')}
      isOpen={isOpen}
      onClose={onClose}
      formId='region-form'
      isLoading={isLoading}
      isEditMode={isEditMode}
      isDirty={isDirty}
    >
      <form id='region-form' onSubmit={onSubmit}>
        <Box className='mb-6 grid grid-cols-[1fr_148px] gap-3'>
          <RHFTextField
            name='name'
            control={control}
            placeholder={t('region.namePlaceholder')}
            label={t('region.name')}
            disabled={isLoading}
          />

          <Box className='flex flex-col'>
            <FieldLabel htmlFor='region-code'>
              {t('region.code')}{' '}
              <Typography
                component='span'
                variant='small'
                sx={{color: 'customColors.inkFaint', fontWeight: 400}}
              >
                {t('region.codeDerived')}
              </Typography>
            </FieldLabel>
            <TextField
              id='region-code'
              disabled
              value={regionCode || ''}
              placeholder={t('region.codePlaceholder')}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'customColors.surfaceRaised',
                },
                '& input': {
                  fontFamily: 'var(--font-ibm-plex-mono)',
                  WebkitTextFillColor:
                    'var(--mui-palette-customColors-inkFaint)',
                },
              }}
            />
          </Box>
        </Box>

        <Box className='mb-6'>
          <RegionStatusField control={control} disabled={isLoading} />
        </Box>

        <Box className='mb-6'>
          <RHFAsyncAutocompleteField
            name='counties'
            control={control}
            label={t('region.counties')}
            placeholder={t('region.countiesPlaceholder')}
            source={countySource}
            multiple
            disabled={isLoading}
            noOptionsText={t('region.noMatchingCounties')}
          />
        </Box>

        <Box className='mb-6 grid grid-cols-2 gap-4'>
          <RHFAsyncAutocompleteField
            name='primaryNurseProfileIds'
            control={control}
            label={t('region.primaryNurse')}
            placeholder={t('region.primaryNursePlaceholder')}
            source={primaryNurseSource}
            hiddenValues={secondaryNurseIds}
            multiple
            disabled={isLoading}
            noOptionsText={t('region.noEligibleNurses')}
          />

          <RHFAsyncAutocompleteField
            name='secondaryNurseProfileIds'
            control={control}
            label={t('region.secondaryNurse')}
            placeholder={t('region.secondaryNursePlaceholder')}
            source={secondaryNurseSource}
            hiddenValues={primaryNurseIds}
            multiple
            disabled={isLoading}
            noOptionsText={t('region.noEligibleNurses')}
          />
        </Box>
      </form>
    </FormDrawer>
  );
};

export default RegionModalUI;
