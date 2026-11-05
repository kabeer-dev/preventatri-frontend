'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import RHFPasswordField from '@/shared/components/common/inputs/RHFPasswordField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaCredentialsFormProps} from '@/shared/interfaces/settings';

const HhaCredentialsForm = ({
  control,
  canSubmit,
  isSaving,
  isReplacing,
  onSubmit,
  onCancel,
}: HhaCredentialsFormProps) => {
  const {t} = useTranslation();

  return (
    <form onSubmit={onSubmit} autoComplete='off'>
      <Box className='flex flex-col gap-4 px-4.5 pb-4'>
        <RHFTextField
          name='appName'
          control={control}
          label={t('hhaCredentials.appName')}
          placeholder={t('hhaCredentials.appNamePlaceholder')}
          disabled={isSaving}
        />
        <RHFPasswordField
          name='appSecret'
          control={control}
          label={t('hhaCredentials.appSecret')}
          placeholder={t('hhaCredentials.appSecretPlaceholder')}
          autoComplete='new-password'
          disabled={isSaving}
        />
        <RHFPasswordField
          name='appKey'
          control={control}
          label={t('hhaCredentials.appKey')}
          placeholder={t('hhaCredentials.appKeyPlaceholder')}
          autoComplete='new-password'
          disabled={isSaving}
        />
        <Typography variant='body2' sx={{color: 'text.secondary'}}>
          {t('hhaCredentials.formHint')}
        </Typography>
      </Box>

      <Box
        className='flex justify-end gap-2 px-4.5 py-3'
        sx={{borderTop: 1, borderColor: 'divider'}}
      >
        {isReplacing && (
          <Button
            variant='outlined'
            color='secondary'
            onClick={onCancel}
            disabled={isSaving}
            className='w-auto'
          >
            {t('hhaCredentials.cancel')}
          </Button>
        )}
        <Button
          type='submit'
          variant='contained'
          disabled={!canSubmit}
          loading={isSaving}
          className='w-auto'
        >
          {isReplacing
            ? t('hhaCredentials.saveReplacement')
            : t('hhaCredentials.connect')}
        </Button>
      </Box>
    </form>
  );
};

export default HhaCredentialsForm;
