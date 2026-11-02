'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Call911Banner from '@/shared/components/common/Call911Banner';
import FieldLabel from '@/shared/components/common/inputs/FieldLabel';
import RedFlagAttachmentFields from '@/shared/components/common/inputs/RedFlagAttachmentFields';
import RHFSelectField from '@/shared/components/common/inputs/RHFSelectField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {RED_FLAG_REASON_OPTIONS} from '@/shared/constants/redFlag';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverRedFlagFormState} from '@/shared/interfaces/caregiverRedFlag';

import PatientPicker from './PatientPicker';

interface Props {
  state: CaregiverRedFlagFormState;

  /** 'screen' is the phone's full screen, 'dialog' the desktop overlay. */
  variant: 'screen' | 'dialog';
}

/**
 * The one red flag form. The phone stacks it and picks the patient from a
 * list; the desktop lays the first two fields side by side and picks the
 * patient from a select. Nothing else differs, and neither does the payload.
 */
const RedFlagForm = ({state, variant}: Props) => {
  const {t} = useTranslation();

  const {
    control,
    patients,
    selectedPatient,
    isOtherReason,
    images,
    onImagesChange,
    onAudioChange,
    audioRecorderRef,
    isSubmitting,
  } = state;

  const isScreen = variant === 'screen';

  const patientOptions = patients.map(({id, name}) => ({
    label: name,
    value: id,
  }));

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 5}}>
      <Call911Banner />

      {isScreen && (
        <Typography
          sx={{
            fontSize: '0.84375rem',
            color: 'text.secondary',
            lineHeight: 1.5,
          }}
        >
          {t('caregiverRedFlag.intro')}
        </Typography>
      )}

      <Box
        sx={{
          display: 'grid',
          gap: 5,
          gridTemplateColumns: isScreen ? '1fr' : '1fr 1fr',
        }}
      >
        <Box>
          {isScreen ? (
            <>
              <FieldLabel>{t('caregiverRedFlag.patient')}</FieldLabel>

              <PatientPicker
                control={control}
                patients={patients}
                selectedPatient={selectedPatient}
              />
            </>
          ) : (
            <RHFSelectField
              name='patientId'
              control={control}
              label={t('caregiverRedFlag.patient')}
              options={patientOptions}
              disabled={isSubmitting}
            />
          )}
        </Box>

        <RHFSelectField
          name='reason'
          control={control}
          label={t('caregiverRedFlag.whatsWrong')}
          options={RED_FLAG_REASON_OPTIONS}
          disabled={isSubmitting}
        />
      </Box>

      {isOtherReason && (
        <RHFTextField
          name='otherReason'
          control={control}
          label={t('caregiverRedFlag.otherReason')}
          placeholder={t('caregiverRedFlag.otherReasonPlaceholder')}
          disabled={isSubmitting}
        />
      )}

      <RHFTextField
        name='description'
        control={control}
        label={t('caregiverRedFlag.tellMore')}
        placeholder={t('caregiverRedFlag.tellMorePlaceholder')}
        multiline
        rows={isScreen ? 4 : 3}
        disabled={isSubmitting}
      />

      <RedFlagAttachmentFields
        images={images}
        onImagesChange={onImagesChange}
        onAudioChange={onAudioChange}
        audioRecorderRef={audioRecorderRef}
        isSubmitting={isSubmitting}
        uploadText={t('caregiverRedFlag.photosPrompt')}
        browseText={t('caregiverRedFlag.browse')}
        photosLabel={t('caregiverRedFlag.photos')}
        voiceNoteLabel={t('caregiverRedFlag.voiceNote')}
      />
    </Box>
  );
};

export default RedFlagForm;
