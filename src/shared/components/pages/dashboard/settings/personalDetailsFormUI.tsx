'use client';

import MuiButton from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import useTranslation from '@/shared/hooks/useTranslation';
import {PersonalDetailsFormUIProps} from '@/shared/interfaces/settings';

const PersonalDetailsFormUI = ({
  control,
  onSubmit,
  onReset,
  isDirty,
  isPending,
}: PersonalDetailsFormUIProps) => {
  const {t} = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={6}>
        <Grid size={{xs: 12, sm: 6}}>
          <RHFTextField
            name='firstName'
            control={control}
            label={t('settings.firstName')}
            placeholder={t('settings.firstNamePlaceholder')}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <RHFTextField
            name='lastName'
            control={control}
            label={t('settings.lastName')}
            placeholder={t('settings.lastNamePlaceholder')}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <RHFTextField
            name='email'
            control={control}
            label={t('settings.email')}
            placeholder={t('settings.emailPlaceholder')}
            type='email'
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <RHFTextField
            name='phoneNo'
            control={control}
            label={t('settings.phoneNo')}
            placeholder={t('settings.phoneNoPlaceholder')}
            type='phone'
          />
        </Grid>
        <Grid size={{xs: 12}}>
          <RHFTextField
            name='address'
            control={control}
            label={t('settings.address')}
            placeholder={t('settings.addressPlaceholder')}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <RHFTextField
            name='city'
            control={control}
            label={t('settings.city')}
            placeholder={t('settings.cityPlaceholder')}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <RHFTextField
            name='zipCode'
            control={control}
            label={t('settings.zipCode')}
            placeholder={t('settings.zipCodePlaceholder')}
          />
        </Grid>
        <Grid
          size={{xs: 12}}
          sx={{display: 'flex', justifyContent: 'flex-end'}}
        >
          <MuiButton
            variant='contained'
            type='submit'
            disabled={!isDirty || isPending}
            sx={{mr: 3}}
          >
            {t('settings.saveChanges')}
          </MuiButton>
          <MuiButton
            type='button'
            variant='outlined'
            color='secondary'
            onClick={onReset}
          >
            {t('settings.reset')}
          </MuiButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default PersonalDetailsFormUI;
