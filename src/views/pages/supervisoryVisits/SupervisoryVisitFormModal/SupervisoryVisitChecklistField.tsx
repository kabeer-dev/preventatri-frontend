'use client';

import {FieldValues} from 'react-hook-form';

import RHFAsyncAutocompleteField from '@/shared/components/common/inputs/RHFAsyncAutocompleteField';
import {CHECKLIST_TEMPLATE_TYPES} from '@/shared/constants/assessmentChecklists';
import useTranslation from '@/shared/hooks/useTranslation';
import {useWorkItemChecklistOptions} from '@/shared/hooks/useWorkItemChecklistOptions';
import {SupervisoryVisitChecklistFieldProps} from '@/shared/interfaces/supervisoryVisit';

// Generic over the form so the flag-resolve form can embed it under its own
// field name.
const SupervisoryVisitChecklistField = <T extends FieldValues>({
  control,
  name,
  enabled = true,
  seedTemplate,
  disabled = false,
}: SupervisoryVisitChecklistFieldProps<T>) => {
  const {t} = useTranslation();

  const checklistSource = useWorkItemChecklistOptions({
    type: CHECKLIST_TEMPLATE_TYPES.SUPERVISORY_VISIT.value,
    enabled,
    seedTemplate,
  });

  return (
    <RHFAsyncAutocompleteField
      name={name}
      control={control}
      label={t('supervisoryVisits.create.checklist')}
      placeholder={t('supervisoryVisits.create.checklistPlaceholder')}
      source={checklistSource}
      noOptionsText={t('supervisoryVisits.create.noChecklists')}
      disabled={disabled}
    />
  );
};

export default SupervisoryVisitChecklistField;
