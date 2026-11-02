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
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {NurseFormPayload, NurseFormValues} from '@/shared/types/nurse';

import NurseRegionFields from './NurseRegionFields';

interface SelectOption {
  readonly label: string;
  readonly value: string;
}

interface NurseModalUIProps {
  embedded?: boolean;
  formId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  control: Control<NurseFormPayload, unknown, NurseFormValues>;
  isLoading?: boolean;
  isEditMode?: boolean;
  isDirty?: boolean;
  primaryRegionSource: AsyncSelectSource;
  secondaryRegionSource: AsyncSelectSource;
  primaryRegionIds: string[];
  secondaryRegionIds: string[];
  statusOptions: readonly SelectOption[];
  roleOptions: readonly SelectOption[];
  licenseStateOptions: readonly SelectOption[];
  contactMethodOptions: readonly SelectOption[];
  isHhaManaged?: boolean;
  isPrimaryRegionHhaManaged?: boolean;
  canEditEmail?: boolean;
}

const NurseModalUI = ({
  embedded = false,
  formId = 'nurse-form',
  isOpen,
  onClose,
  onSubmit,
  control,
  isLoading = false,
  primaryRegionSource,
  secondaryRegionSource,
  primaryRegionIds,
  secondaryRegionIds,
  isEditMode = false,
  isDirty = false,
  statusOptions,
  roleOptions,
  licenseStateOptions,
  contactMethodOptions,
  isHhaManaged = false,
  isPrimaryRegionHhaManaged = false,
  canEditEmail = false,
}: NurseModalUIProps) => {
  const {t} = useTranslation();

  const form = (
    <form id={formId} onSubmit={onSubmit}>
      {isHhaManaged && (
        <Alert severity='info' className='mb-4'>
          {t('nurse.sync.managedBanner')}
        </Alert>
      )}

      {canEditEmail && (
        <Alert severity='warning' className='mb-4'>
          {t('nurse.sync.placeholderEmailBanner')}
        </Alert>
      )}

      {/* Personal Information Section */}
      <Box className='mb-6'>
        <Box className='mb-4'>
          <SectionHeading title={t('nurse.personalInfo')} />
        </Box>

        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <RHFTextField
            name='firstName'
            control={control}
            placeholder={t('nurse.firstNamePlaceholder')}
            label={t('nurse.firstName')}
            disabled={isHhaManaged}
          />

          <RHFTextField
            name='lastName'
            control={control}
            placeholder={t('nurse.lastNamePlaceholder')}
            label={t('nurse.lastName')}
            disabled={isHhaManaged}
          />

          <RHFTextField
            name='email'
            control={control}
            placeholder={t('nurse.emailPlaceholder')}
            type='email'
            label={t('nurse.email')}
            disabled={isEditMode && !canEditEmail}
          />

          <RHFTextField
            name='phoneNo'
            control={control}
            placeholder={t('nurse.phoneNoPlaceholder')}
            label={t('nurse.phoneNo')}
            type='phone'
            disabled={isHhaManaged}
          />
        </Box>
      </Box>

      {/* Address Section */}
      <Box className='mb-6'>
        <Box className='mb-4'>
          <SectionHeading title={t('nurse.addressInfo')} />
        </Box>

        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Box className='sm:col-span-2'>
            <RHFTextField
              name='address'
              control={control}
              placeholder={t('nurse.addressPlaceholder')}
              label={t('nurse.address')}
              disabled={isHhaManaged}
            />
          </Box>

          <RHFTextField
            name='city'
            control={control}
            placeholder={t('nurse.cityPlaceholder')}
            label={t('nurse.city')}
            disabled={isHhaManaged}
          />

          <RHFTextField
            name='state'
            control={control}
            placeholder={t('nurse.statePlaceholder')}
            label={t('nurse.state')}
            disabled={isHhaManaged}
          />

          <RHFTextField
            name='zipCode'
            control={control}
            placeholder={t('nurse.zipCodePlaceholder')}
            label={t('nurse.zipCode')}
            disabled={isHhaManaged}
          />
        </Box>
      </Box>

      {/* Professional Information Section */}
      <Box className='mb-6'>
        <Box className='mb-4'>
          <SectionHeading title={t('nurse.professionalInfo')} />
        </Box>

        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <RHFSelectField
            name='professionalRole'
            control={control}
            label={t('nurse.professionalRole')}
            options={[...roleOptions]}
            disabled={isHhaManaged}
          />

          <RHFTextField
            name='licenseNumber'
            control={control}
            placeholder={t('nurse.licenseNumberPlaceholder')}
            label={t('nurse.licenseNumber')}
            disabled={isHhaManaged}
          />

          <RHFSelectField
            name='licenseState'
            control={control}
            label={t('nurse.licenseState')}
            options={[...licenseStateOptions]}
          />

          <RHFDateField
            name='licenseExpirationDate'
            control={control}
            label={t('nurse.licenseExpirationDate')}
          />

          <RHFTextField
            name='npi'
            control={control}
            placeholder={t('nurse.npiPlaceholder')}
            label={t('nurse.npi')}
            type='number'
            disabled={isHhaManaged}
          />
        </Box>
      </Box>

      {/* Assignment & Status Section */}
      <Box>
        <Box className='mb-4'>
          <SectionHeading title={t('nurse.assignmentStatus')} />
        </Box>

        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <NurseRegionFields
            control={control}
            primaryRegionSource={primaryRegionSource}
            secondaryRegionSource={secondaryRegionSource}
            primaryRegionIds={primaryRegionIds}
            secondaryRegionIds={secondaryRegionIds}
            isHhaManaged={isHhaManaged}
            isPrimaryRegionHhaManaged={isPrimaryRegionHhaManaged}
          />

          <RHFSelectField
            name='status'
            control={control}
            label={t('nurse.nurseStatus')}
            options={[...statusOptions]}
            disabled={isHhaManaged}
          />

          <RHFSelectField
            name='preferredContactMethod'
            control={control}
            label={t('nurse.preferredContactMethod')}
            options={[...contactMethodOptions]}
            clearable
          />

          <RHFDateField
            name='joiningDate'
            control={control}
            label={t('nurse.joiningDate')}
            clearable
          />

          <Box className='flex items-center'>
            <RHFSwitchField
              name='onCallIndicator'
              control={control}
              label={t('nurse.onCallIndicator')}
            />
          </Box>
        </Box>

        <Box className='mt-4'>
          <RHFTextField
            name='notes'
            control={control}
            placeholder={t('nurse.notesPlaceholder')}
            label={t('nurse.notes')}
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
      title={isEditMode ? t('nurse.editModalTitle') : t('nurse.modalTitle')}
      subtitle={t('nurse.drawerSubtitle')}
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

export default NurseModalUI;
