'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import {Control} from 'react-hook-form';

import SectionHeading from '@/shared/components/common/headers/SectionHeading';
import RHFDateField from '@/shared/components/common/inputs/RHFDateField';
import RHFSelectField from '@/shared/components/common/inputs/RHFSelectField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {FormDrawer} from '@/shared/components/common/modals';
import useTranslation from '@/shared/hooks/useTranslation';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {CaseManagerAssignedPatient} from '@/shared/interfaces/caseManager';
import {
  CaseManagerFormPayload,
  CaseManagerFormValues,
} from '@/shared/types/caseManager';

import CaseManagerAssignmentFields from './CaseManagerAssignmentFields';

interface SelectOption {
  readonly label: string;
  readonly value: string;
}

interface CaseManagerModalUIProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  control: Control<CaseManagerFormPayload, unknown, CaseManagerFormValues>;
  isLoading?: boolean;
  isEditMode?: boolean;
  isDirty?: boolean;
  regionSource: AsyncSelectSource;
  patientOptions: SelectOption[];
  hasRegionsSelected: boolean;
  statusOptions: readonly SelectOption[];
  hhaPatients: CaseManagerAssignedPatient[];
  contactMethodOptions: readonly SelectOption[];
  languageOptions: readonly SelectOption[];
  isHhaManaged?: boolean;
  canEditEmail?: boolean;

  // Supplied when the form is hosted inside the unified invite modal.
  embedded?: boolean;
  formId?: string;
}

const CaseManagerModalUI = ({
  isOpen,
  onClose,
  onSubmit,
  control,
  isLoading = false,
  regionSource,
  patientOptions,
  hasRegionsSelected,
  hhaPatients,
  isEditMode = false,
  isDirty = false,
  statusOptions,
  contactMethodOptions,
  languageOptions,
  isHhaManaged = false,
  canEditEmail = false,
  embedded = false,
  formId = 'case-manager-form',
}: CaseManagerModalUIProps) => {
  const {t} = useTranslation();

  const form = (
    <form id={formId} onSubmit={onSubmit}>
      {isHhaManaged && (
        <Alert severity='info' className='mb-4'>
          {t('caseManager.sync.managedBanner')}
        </Alert>
      )}

      {canEditEmail && (
        <Alert severity='warning' className='mb-4'>
          {t('caseManager.sync.placeholderEmailBanner')}
        </Alert>
      )}

      {/* Personal Information Section */}
      <Box className='mb-6'>
        <Box className='mb-4'>
          <SectionHeading title={t('caseManager.personalInfo')} />
        </Box>

        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <RHFTextField
            name='firstName'
            control={control}
            placeholder={t('caseManager.firstNamePlaceholder')}
            label={t('caseManager.firstName')}
            disabled={isHhaManaged}
          />

          <RHFTextField
            name='lastName'
            control={control}
            placeholder={t('caseManager.lastNamePlaceholder')}
            label={t('caseManager.lastName')}
            disabled={isHhaManaged}
          />

          <RHFTextField
            name='email'
            control={control}
            placeholder={t('caseManager.emailPlaceholder')}
            type='email'
            label={t('caseManager.email')}
            disabled={isEditMode && !canEditEmail}
          />

          <RHFTextField
            name='phoneNo'
            control={control}
            placeholder={t('caseManager.phoneNoPlaceholder')}
            label={t('caseManager.phoneNo')}
            type='phone'
          />
        </Box>
      </Box>

      {/* Assignment & Status Section */}
      <Box className='mb-6'>
        <Box className='mb-4'>
          <SectionHeading title={t('caseManager.assignmentAccess')} />
        </Box>

        <CaseManagerAssignmentFields
          control={control}
          regionSource={regionSource}
          patientOptions={patientOptions}
          hasRegionsSelected={hasRegionsSelected}
          statusOptions={statusOptions}
          hhaPatients={hhaPatients}
          isHhaManaged={isHhaManaged}
        />
      </Box>

      {/* Professional Details Section */}
      <Box>
        <Box className='mb-4'>
          <SectionHeading title={t('caseManager.professionalDetails')} />
        </Box>

        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <RHFTextField
            name='title'
            control={control}
            placeholder={t('caseManager.titlePlaceholder')}
            label={t('caseManager.title')}
          />

          <RHFSelectField
            name='preferredContactMethod'
            control={control}
            label={t('caseManager.preferredContactMethod')}
            options={[...contactMethodOptions]}
            clearable
          />

          <RHFSelectField
            name='language'
            control={control}
            label={t('caseManager.languagePreference')}
            options={[...languageOptions]}
            clearable
          />

          <RHFDateField
            name='startDate'
            control={control}
            label={t('caseManager.startDate')}
            clearable
          />
        </Box>

        <Box className='mt-4'>
          <RHFTextField
            name='notes'
            control={control}
            placeholder={t('caseManager.notesPlaceholder')}
            label={t('caseManager.notes')}
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
        isEditMode
          ? t('caseManager.editModalTitle')
          : t('caseManager.modalTitle')
      }
      subtitle={t('caseManager.drawerSubtitle')}
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

export default CaseManagerModalUI;
