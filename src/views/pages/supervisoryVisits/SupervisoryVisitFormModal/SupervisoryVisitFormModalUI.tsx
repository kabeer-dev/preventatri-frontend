'use client';

import Box from '@mui/material/Box';

import RHFAsyncAutocompleteField from '@/shared/components/common/inputs/RHFAsyncAutocompleteField';
import RHFAutocompleteField from '@/shared/components/common/inputs/RHFAutocompleteField';
import RHFSegmentedField from '@/shared/components/common/inputs/RHFSegmentedField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {FormDrawer} from '@/shared/components/common/modals';
import {
  SUPERVISORY_VISIT_FORM_ID,
  SUPERVISORY_VISIT_TYPE,
} from '@/shared/constants/supervisoryVisits';
import useTranslation from '@/shared/hooks/useTranslation';
import {SupervisoryVisitFormModalUIProps} from '@/shared/interfaces/supervisoryVisit';

import SupervisoryVisitChecklistField from './SupervisoryVisitChecklistField';
import SupervisoryVisitScheduleFields from './SupervisoryVisitScheduleFields';

const SupervisoryVisitFormModalUI = ({
  isOpen,
  onClose,
  onSubmit,
  control,
  isDirty,
  isLoading = false,
  isEditMode = false,
  patientPicker,
  assigneeOptions,
  caregiverOptions,
  checklistSeedTemplate,
  isPatientFieldDisabled = false,
  isCareTeamDisabled = false,
  isCareTeamLoading = false,
  showVisitTypeOther = false,
}: SupervisoryVisitFormModalUIProps) => {
  const {t} = useTranslation();

  const visitTypeOptions = Object.values(SUPERVISORY_VISIT_TYPE).map(
    ({value, labelKey}) => ({value, label: t(labelKey)})
  );

  const careTeamEmptyKey = isCareTeamDisabled
    ? 'supervisoryVisits.create.selectPatientFirst'
    : 'supervisoryVisits.create.noAssignees';

  return (
    <FormDrawer
      title={t(
        isEditMode
          ? 'supervisoryVisits.create.editTitle'
          : 'supervisoryVisits.create.title'
      )}
      subtitle={t('supervisoryVisits.create.drawerSubtitle')}
      isOpen={isOpen}
      onClose={onClose}
      formId={SUPERVISORY_VISIT_FORM_ID}
      isDirty={isDirty}
      isLoading={isLoading}
      isEditMode={isEditMode}
      submitLabel={t(
        isEditMode
          ? 'supervisoryVisits.create.save'
          : 'supervisoryVisits.create.submit'
      )}
    >
      <form id={SUPERVISORY_VISIT_FORM_ID} onSubmit={onSubmit} className='pt-2'>
        <Box className='grid grid-cols-1 gap-4'>
          <RHFAsyncAutocompleteField
            name='patientId'
            control={control}
            label={t('supervisoryVisits.create.patient')}
            placeholder={t('supervisoryVisits.create.patientPlaceholder')}
            source={patientPicker}
            loadingText={t('common.loading')}
            noOptionsText={t('supervisoryVisits.create.noMatchingPatients')}
            disabled={isPatientFieldDisabled || isLoading}
          />

          <RHFSegmentedField
            name='visitType'
            control={control}
            label={t('supervisoryVisits.create.visitType')}
            options={visitTypeOptions}
            disabled={isLoading}
          />

          {showVisitTypeOther && (
            <RHFTextField
              name='visitTypeOther'
              control={control}
              label={t('supervisoryVisits.create.visitTypeOther')}
              placeholder={t(
                'supervisoryVisits.create.visitTypeOtherPlaceholder'
              )}
              disabled={isLoading}
            />
          )}

          <RHFAutocompleteField
            name='assigneeUserOrganizationId'
            control={control}
            label={t('supervisoryVisits.create.assignTo')}
            placeholder={t('supervisoryVisits.create.assignToPlaceholder')}
            options={assigneeOptions}
            loading={isCareTeamLoading}
            loadingText={t('common.loading')}
            noOptionsText={t(careTeamEmptyKey)}
            disabled={isCareTeamDisabled || isLoading}
          />

          <RHFAutocompleteField
            name='caregiverUserOrganizationIds'
            control={control}
            multiple
            label={`${t('supervisoryVisits.create.caregivers')} · ${t('supervisoryVisits.create.caregiversHint')}`}
            placeholder={t('supervisoryVisits.create.caregiversPlaceholder')}
            options={caregiverOptions}
            loading={isCareTeamLoading}
            loadingText={t('common.loading')}
            noOptionsText={t(
              isCareTeamDisabled
                ? 'supervisoryVisits.create.selectPatientFirst'
                : 'supervisoryVisits.create.noCaregivers'
            )}
            disabled={isCareTeamDisabled || isLoading}
          />

          <SupervisoryVisitChecklistField
            control={control}
            name='checklistTemplateId'
            enabled={isOpen}
            seedTemplate={checklistSeedTemplate}
            disabled={isLoading}
          />

          <SupervisoryVisitScheduleFields
            control={control}
            names={{
              date: 'scheduledDate',
              startTime: 'startTime',
              endTime: 'endTime',
            }}
            labels={{
              date: t('supervisoryVisits.create.date'),
              startTime: t('supervisoryVisits.create.startTime'),
              endTime: t('supervisoryVisits.create.endTime'),
            }}
            disabled={isLoading}
          />

          <RHFTextField
            name='description'
            control={control}
            label={t('supervisoryVisits.create.description')}
            placeholder={t('supervisoryVisits.create.descriptionPlaceholder')}
            multiline
            rows={3}
            disabled={isLoading}
          />
        </Box>
      </form>
    </FormDrawer>
  );
};

export default SupervisoryVisitFormModalUI;
