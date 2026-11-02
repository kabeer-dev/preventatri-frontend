import {useMemo} from 'react';

import {
  ASSESSMENT_CHECKLIST_STATUS,
  CHECKLIST_TEMPLATE_TYPES,
} from '@/shared/constants/assessmentChecklists';
import {DROPDOWN_PAGE_SIZE} from '@/shared/constants/general';
import {PatientAssessmentOptions} from '@/shared/interfaces/patient';
import {assessmentQueries} from '@/shared/reactQuery';

const usePatientAssessmentOptions = ({
  enabled,
}: {
  enabled: boolean;
}): PatientAssessmentOptions => {
  const {useFetchAssessmentTemplatesList} = assessmentQueries();

  const templatesQuery = useFetchAssessmentTemplatesList({
    params: {
      limit: DROPDOWN_PAGE_SIZE,
      type: CHECKLIST_TEMPLATE_TYPES.PATIENT.value,
      status: ASSESSMENT_CHECKLIST_STATUS.ACTIVE.value,
    },
    enabled,
  });

  const templates = templatesQuery?.data?.templates;

  return useMemo(
    () => ({
      checklistTemplateOptions: (templates || []).map((template: any) => ({
        label: template.title,
        value: template.id,
      })),
    }),
    [templates]
  );
};

export default usePatientAssessmentOptions;
