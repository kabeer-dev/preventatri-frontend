import {ACTION_TAKEN_CHECKBOXES} from '@/shared/constants/flag';
import {FOLLOW_UP_DUE_TIME_DEFAULT} from '@/shared/constants/followUps';
import {
  SUPERVISORY_VISIT_DEFAULT_END_TIME,
  SUPERVISORY_VISIT_DEFAULT_START_TIME,
} from '@/shared/constants/supervisoryVisits';
import {ResolveEscalationPayload} from '@/shared/interfaces/flag';
import {ActionTakenFormValues} from '@/shared/types/flag';
import {combineDateAndTime} from '@/shared/utils/dateUtils';

const RESOLUTION_FILES_FIELD = 'files';

// Form values -> the resolve request body. Follow-up fields only travel when
// a follow-up was asked for; the same for the supervisory visit. Clock times
// are read in `zone` (the organization's) when given.
export const buildResolveEscalationPayload = ({
  values,
  zone,
}: {
  values: ActionTakenFormValues;
  zone?: string;
}): ResolveEscalationPayload => {
  const followUp = values.requireFollowUp;
  const visit = values.requireSupervisoryVisit;

  return {
    actions: ACTION_TAKEN_CHECKBOXES.filter(({name}) => values[name]).map(
      ({value}) => value
    ),
    notes: values.notes,
    hasFollowUp: followUp,
    followUpDate: followUp
      ? combineDateAndTime({
          date: values.followUpDate,
          time: values.followUpTime || FOLLOW_UP_DUE_TIME_DEFAULT,
          zone,
        })
      : null,
    followUpTitle: followUp ? values.followUpTitle || null : null,
    followUpDescription: followUp ? values.followUpDescription || null : null,
    followUpAssigneeUserOrganizationId: followUp
      ? values.followUpAssigneeUserOrganizationId || null
      : null,
    followUpPriority: followUp ? values.followUpPriority || null : null,
    followUpChecklistTemplateId: followUp
      ? values.followUpChecklistTemplateId || null
      : null,
    hasSupervisoryVisit: visit,
    supervisoryVisitStartAt: visit
      ? combineDateAndTime({
          date: values.supervisoryVisitDate,
          time:
            values.supervisoryVisitStartTime ||
            SUPERVISORY_VISIT_DEFAULT_START_TIME,
          zone,
        })
      : null,
    supervisoryVisitEndAt: visit
      ? combineDateAndTime({
          date: values.supervisoryVisitDate,
          time:
            values.supervisoryVisitEndTime ||
            SUPERVISORY_VISIT_DEFAULT_END_TIME,
          zone,
        })
      : null,
    supervisoryVisitAssigneeUserOrganizationId: visit
      ? values.supervisoryVisitAssigneeUserOrganizationId || null
      : null,
    supervisoryVisitChecklistTemplateId: visit
      ? values.supervisoryVisitChecklistTemplateId || null
      : null,
    supervisoryInstructions: visit ? values.visitInstructions || null : null,
  };
};

// Multipart body: every non-null scalar as a field, attachments under `files`.
export const buildResolveFormData = ({
  payload,
  files,
}: {
  payload: ResolveEscalationPayload;
  files: File[];
}): FormData => {
  const formData = new FormData();

  formData.append('actions', JSON.stringify(payload.actions));

  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'actions' || value === null || value === undefined) return;
    formData.append(key, String(value));
  });

  files.forEach((file) => formData.append(RESOLUTION_FILES_FIELD, file));

  return formData;
};
