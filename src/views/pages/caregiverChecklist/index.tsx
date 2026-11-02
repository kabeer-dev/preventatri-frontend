'use client';

import useUserRole from '@/shared/hooks/useUserRole';
import CaregiverChecklistPage from '@/views/pages/caregiverChecklist/CaregiverChecklistPage';
import SubmissionChecklistPage from '@/views/pages/checklist/SubmissionChecklistPage';

interface Props {
  submissionId: string;
}

/**
 * The checklist route is shared with the case manager, who still gets the old
 * one page form. Only the caregiver gets the new runner.
 */
const ChecklistRoute = ({submissionId}: Props) => {
  const {isCaregiver} = useUserRole();

  if (isCaregiver) {
    return <CaregiverChecklistPage submissionId={submissionId} />;
  }

  return <SubmissionChecklistPage submissionId={submissionId} />;
};

export default ChecklistRoute;
