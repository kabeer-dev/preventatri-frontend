'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import {Control} from 'react-hook-form';

import SectionHeading from '@/shared/components/common/headers/SectionHeading';
import RHFDateField from '@/shared/components/common/inputs/RHFDateField';
import RHFSelectField from '@/shared/components/common/inputs/RHFSelectField';
import RHFSwitchField from '@/shared/components/common/inputs/RHFSwitchField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {FormDrawer} from '@/shared/components/common/modals';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  CaregiverFormPayload,
  CaregiverFormValues,
} from '@/shared/types/caregiver';

interface SelectOption {
  readonly label: string;
  readonly value: string;
}

interface CaregiverModalUIProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  control: Control<CaregiverFormPayload, unknown, CaregiverFormValues>;
  isLoading?: boolean;
  isEditMode?: boolean;
  isDirty?: boolean;
  roleOptions: readonly SelectOption[];
  statusOptions: readonly SelectOption[];
  contactMethodOptions: readonly SelectOption[];
  relationshipOptions: readonly SelectOption[];
  languageOptions: readonly SelectOption[];
  isHhaManaged?: boolean;
  canEditEmail?: boolean;

  // Supplied when the form is hosted inside the unified invite modal.
  embedded?: boolean;
  formId?: string;
}

const CaregiverModalUI = ({
  isOpen,
  onClose,
  onSubmit,
  control,
  isLoading = false,
  isEditMode = false,
  isDirty = false,
  roleOptions,
  statusOptions,
  contactMethodOptions,
  relationshipOptions,
  languageOptions,
  isHhaManaged = false,
  canEditEmail = false,
  embedded = false,
  formId = 'caregiver-form',
}: CaregiverModalUIProps) => {
  const {t} = useTranslation();

  const form = (
    <form id={formId} onSubmit={onSubmit}>
      {isHhaManaged && (
        <Alert severity='info' className='mb-4'>
          {t('caregiver.sync.managedBanner')}
        </Alert>
      )}

      {canEditEmail && (
        <Alert severity='warning' className='mb-4'>
          {t('caregiver.sync.placeholderEmailBanner')}
        </Alert>
      )}

      {/* Personal Information Section */}
      <Box className='mb-6'>
        <Box className='mb-4'>
          <SectionHeading title={t('caregiver.personalInfo')} />
        </Box>

        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <RHFTextField
            name='firstName'
            control={control}
            placeholder={t('caregiver.firstNamePlaceholder')}
            label={t('caregiver.firstName')}
            disabled={isHhaManaged}
          />

          <RHFTextField
            name='lastName'
            control={control}
            placeholder={t('caregiver.lastNamePlaceholder')}
            label={t('caregiver.lastName')}
            disabled={isHhaManaged}
          />

          <RHFTextField
            name='email'
            control={control}
            placeholder={t('caregiver.emailPlaceholder')}
            type='email'
            label={t('caregiver.email')}
            disabled={isEditMode && !canEditEmail}
          />

          <RHFTextField
            name='phoneNo'
            control={control}
            placeholder={t('caregiver.phoneNoPlaceholder')}
            label={t('caregiver.phoneNo')}
            type='phone'
            disabled={isHhaManaged}
          />
        </Box>
      </Box>

      {/* Role & Status Section */}
      <Box className='mb-6'>
        <Box className='mb-4'>
          <SectionHeading title={t('caregiver.roleStatus')} />
        </Box>

        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <RHFSelectField
            name='caregiverRole'
            control={control}
            label={t('caregiver.caregiverRole')}
            options={[...roleOptions]}
            disabled={isHhaManaged}
          />

          <RHFSelectField
            name='status'
            control={control}
            label={t('caregiver.status')}
            options={[...statusOptions]}
            disabled={isHhaManaged}
          />

          <RHFSelectField
            name='relationshipToPatient'
            control={control}
            label={t('caregiver.relationshipToPatient')}
            options={[...relationshipOptions]}
            clearable
          />
        </Box>
      </Box>

      {/* Address Section */}
      <Box className='mb-6'>
        <Box className='mb-4'>
          <SectionHeading title={t('caregiver.addressInfo')} />
        </Box>

        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Box className='sm:col-span-2'>
            <RHFTextField
              name='address'
              control={control}
              placeholder={t('caregiver.addressPlaceholder')}
              label={t('caregiver.address')}
              disabled={isHhaManaged}
            />
          </Box>

          <RHFTextField
            name='city'
            control={control}
            placeholder={t('caregiver.cityPlaceholder')}
            label={t('caregiver.city')}
            disabled={isHhaManaged}
          />

          <RHFTextField
            name='state'
            control={control}
            placeholder={t('caregiver.statePlaceholder')}
            label={t('caregiver.state')}
            disabled={isHhaManaged}
          />

          <RHFTextField
            name='zipCode'
            control={control}
            placeholder={t('caregiver.zipCodePlaceholder')}
            label={t('caregiver.zipCode')}
            disabled={isHhaManaged}
          />
        </Box>
      </Box>

      {/* Additional Information Section */}
      <Box>
        <Box className='mb-4'>
          <SectionHeading title={t('caregiver.additionalInfo')} />
        </Box>

        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <RHFSelectField
            name='preferredContactMethod'
            control={control}
            label={t('caregiver.preferredContactMethod')}
            options={[...contactMethodOptions]}
            clearable
          />

          <RHFSelectField
            name='language'
            control={control}
            label={t('caregiver.languagePreference')}
            options={[...languageOptions]}
            clearable
            disabled={isHhaManaged}
          />

          <RHFDateField
            name='startDate'
            control={control}
            label={t('caregiver.startDate')}
            clearable
            disabled={isHhaManaged}
          />

          <RHFDateField
            name='terminationDate'
            control={control}
            label={t('caregiver.terminationDate')}
            clearable
            disabled={isHhaManaged}
          />

          <Box className='flex items-center'>
            <RHFSwitchField
              name='onCallIndicator'
              control={control}
              label={t('caregiver.onCallIndicator')}
            />
          </Box>
        </Box>

        <Box className='mt-4'>
          <RHFTextField
            name='notes'
            control={control}
            placeholder={t('caregiver.notesPlaceholder')}
            label={t('caregiver.notes')}
            multiline
            rows={3}
          />
        </Box>
      </Box>
    </form>
  );

  if (embedded) return form;

  return (
    <FormDrawer
      title={
        isEditMode ? t('caregiver.editModalTitle') : t('caregiver.modalTitle')
      }
      subtitle={t('caregiver.drawerSubtitle')}
      isOpen={isOpen}
      onClose={onClose}
      formId={formId}
      isLoading={isLoading}
      isEditMode={isEditMode}
      isDirty={isDirty}
    >
      {form}
    </FormDrawer>
  );
};

export default CaregiverModalUI;
