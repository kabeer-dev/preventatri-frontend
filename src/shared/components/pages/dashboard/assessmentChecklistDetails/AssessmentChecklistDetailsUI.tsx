'use client';

import {useState} from 'react';

import Grid from '@mui/material/Grid';

import {ConfirmationModal} from '@/shared/components/common/modals/ConfirmationModal';
import {ASSESSMENT_CHECKLIST_STATUS} from '@/shared/constants/assessmentChecklists';
import useTranslation from '@/shared/hooks/useTranslation';
import {AssessmentChecklistDetailsUIProps} from '@/shared/interfaces/assessmentChecklistDetails';
import {assessmentMutations} from '@/shared/reactQuery';
import NewChecklistModal from '@/views/pages/assessmentChecklists/NewChecklistModal';

import AssessmentChecklistDetailsHeader from './AssessmentChecklistDetailsHeader';
import AssessmentChecklistQuestionsCard from './AssessmentChecklistQuestionsCard';
import AssessmentChecklistUsagePanel from './AssessmentChecklistUsagePanel';

export default function AssessmentChecklistDetailsUI({
  checklist,
  usage,
}: AssessmentChecklistDetailsUIProps) {
  const {t} = useTranslation();
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isCopyOpen, setIsCopyOpen] = useState(false);

  const {useUpdateAssessmentTemplateStatusMutation} = assessmentMutations();

  const {mutate: updateStatus, isPending: isArchiving} =
    useUpdateAssessmentTemplateStatusMutation();

  const handleArchive = () => {
    setIsArchiveOpen(false);
    updateStatus({
      params: {id: checklist.id},
      payload: {status: ASSESSMENT_CHECKLIST_STATUS.ARCHIVED.value},
    });
  };

  return (
    <>
      <AssessmentChecklistDetailsHeader
        checklist={checklist}
        isArchiving={isArchiving}
        onArchive={() => setIsArchiveOpen(true)}
        onCopy={() => setIsCopyOpen(true)}
      />

      <Grid container spacing={4}>
        <Grid size={{xs: 12, md: usage ? 8 : 12}}>
          <AssessmentChecklistQuestionsCard checklist={checklist} />
        </Grid>

        {usage && (
          <Grid size={{xs: 12, md: 4}}>
            <AssessmentChecklistUsagePanel
              usage={usage}
              type={checklist.type}
            />
          </Grid>
        )}
      </Grid>

      <ConfirmationModal
        isOpen={isArchiveOpen}
        title={t('assessmentChecklists.detail.confirmArchive.title')}
        content={t('assessmentChecklists.detail.confirmArchive.message')}
        confirmLabel={t('assessmentChecklists.detail.confirmArchive.confirm')}
        onConfirm={handleArchive}
        onCancel={() => setIsArchiveOpen(false)}
      />

      <NewChecklistModal
        isOpen={isCopyOpen}
        onClose={() => setIsCopyOpen(false)}
        initialValues={{type: checklist.type, sourceTemplateId: checklist.id}}
      />
    </>
  );
}
