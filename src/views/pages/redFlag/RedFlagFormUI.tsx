'use client';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {alpha, useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {Control} from 'react-hook-form';

import {layout} from '@/@core/theme/spacing';
import {AudioRecorderHandle} from '@/shared/components/common/inputs/AudioRecorder';
import RedFlagAttachmentFields from '@/shared/components/common/inputs/RedFlagAttachmentFields';
import RHFSelectField from '@/shared/components/common/inputs/RHFSelectField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import PatientInfoBanner from '@/shared/components/common/PatientInfoBanner';
import {RED_FLAG_REASON_OPTIONS} from '@/shared/constants/redFlag';
import useTranslation from '@/shared/hooks/useTranslation';
import {Patient} from '@/shared/interfaces/patient';
import {RedFlagFormInput, RedFlagFormValues} from '@/shared/types/redFlag';

interface RedFlagFormUIProps {
  patient: Patient;
  control: Control<RedFlagFormInput, unknown, RedFlagFormValues>;
  images: File[];
  onImagesChange: ({files}: {files: File[]}) => void;
  onAudioChange: ({audioBlob}: {audioBlob: Blob | null}) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
  audioRecorderRef: React.RefObject<AudioRecorderHandle | null>;
}

const RedFlagFormUI = ({
  patient,
  control,
  images,
  onImagesChange,
  onAudioChange,
  onSubmit,
  isSubmitting,
  isValid,
  audioRecorderRef,
}: RedFlagFormUIProps) => {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <Box
      className='mx-auto flex flex-col gap-3.5 pb-12'
      sx={{maxWidth: layout.formMaxWidth}}
    >
      <PatientInfoBanner
        patient={patient}
        variant='error'
        subtitle={t('redFlag.sendingFlagFor')}
        avatarSize={48}
        showContactInfo
      />

      <Box
        className='flex items-start gap-3 py-3.5 px-5 rounded-lg border'
        sx={{
          bgcolor: alpha(theme.palette.error.main, 0.06),
          borderColor: alpha(theme.palette.error.main, 0.15),
        }}
      >
        <Icon
          icon='mdi:alert-outline'
          fontSize='1.25rem'
          color={theme.palette.error.main}
          style={{marginTop: 2, flexShrink: 0}}
        />
        <Typography variant='body2' sx={{color: 'text.secondary'}}>
          {t('redFlag.urgencyNotice')}
        </Typography>
      </Box>

      <Card elevation={6} className='rounded-lg'>
        <CardContent className='py-5 px-4 sm:px-5'>
          <div className='flex items-center gap-3 mb-8'>
            <Icon
              icon='mdi:clipboard-alert-outline'
              fontSize='1.25rem'
              color={theme.palette.error.main}
            />
            <Typography variant='h6' className='font-semibold'>
              {t('redFlag.alertDetails')}
            </Typography>
          </div>

          <div className='flex flex-col gap-8'>
            <RHFSelectField
              name='reason'
              control={control}
              label={t('redFlag.selectReason')}
              options={RED_FLAG_REASON_OPTIONS}
              disabled={isSubmitting}
            />

            <RHFTextField
              name='description'
              control={control}
              label={t('redFlag.description')}
              placeholder={t('redFlag.descriptionPlaceholder')}
              multiline
              rows={4}
              disabled={isSubmitting}
            />

            <div className='flex items-center gap-3'>
              <Icon
                icon='mdi:paperclip'
                fontSize='1.15rem'
                color={theme.palette.text.secondary}
              />
              <Typography
                variant='subtitle2'
                className='font-semibold'
                sx={{color: 'text.secondary'}}
              >
                {t('redFlag.supportingEvidence')}
              </Typography>
            </div>

            <RedFlagAttachmentFields
              images={images}
              onImagesChange={onImagesChange}
              onAudioChange={onAudioChange}
              audioRecorderRef={audioRecorderRef}
              isSubmitting={isSubmitting}
              uploadText={t('redFlag.uploadImagesLabel')}
              browseText={t('redFlag.browse')}
              gap={6}
            />

            <Button
              variant='contained'
              color='error'
              size='large'
              fullWidth
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
              startIcon={<Icon icon='mdi:alert-decagram' />}
              onClick={onSubmit}
              className='font-semibold text-base mt-2'
              sx={{py: 1.75}}
            >
              {t('redFlag.submitButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RedFlagFormUI;
