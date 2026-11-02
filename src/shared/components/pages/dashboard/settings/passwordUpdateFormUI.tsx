'use client';

import MuiButton from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import RHFPasswordField from '@/shared/components/common/inputs/RHFPasswordField';
import useTranslation from '@/shared/hooks/useTranslation';
import {PasswordUpdateFormUIProps} from '@/shared/interfaces/settings';

const PasswordUpdateFormUI = ({
  control,
  onSubmit,
  isDirty,
  isPending,
}: PasswordUpdateFormUIProps) => {
  const {t} = useTranslation();

  const lastChangedDate = '4 Mar 2026';

  return (
    <form onSubmit={onSubmit}>
      <Typography variant='h5' sx={{mb: 1}}>
        {t('settings.passwordDetailsHeading')}
      </Typography>
      <Typography variant='body2' sx={{color: 'text.secondary', mb: 6}}>
        {t('settings.passwordRequirements')}
      </Typography>
      <Grid container spacing={6}>
        <Grid size={{xs: 12}}>
          <RHFPasswordField
            name='currentPassword'
            control={control}
            label={t('auth.currentPassword')}
            placeholder={t('auth.currentPasswordPlaceholder')}
          />
        </Grid>
        <Grid size={{xs: 12}}>
          <RHFPasswordField
            name='newPassword'
            control={control}
            label={t('auth.newPassword')}
            placeholder={t('auth.newPasswordPlaceholder')}
            showPolicyChecklist
          />
        </Grid>
        <Grid size={{xs: 12}}>
          <RHFPasswordField
            name='confirmPassword'
            control={control}
            label={t('auth.confirmPassword')}
            placeholder={t('auth.confirmPasswordPlaceholder')}
          />
        </Grid>
        <Grid
          size={{xs: 12}}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='body2' sx={{color: 'text.secondary'}}>
            {t('settings.passwordLastChanged', {date: lastChangedDate})}
          </Typography>
          <MuiButton
            variant='contained'
            type='submit'
            disabled={!isDirty || isPending}
            className='w-auto'
          >
            {t('settings.updateButtonText')}
          </MuiButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default PasswordUpdateFormUI;
