'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import RecordHeading from '@/shared/components/common/headers/RecordHeading';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {ASSESSMENT_CHECKLIST_STATUS} from '@/shared/constants/assessmentChecklists';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {AssessmentChecklistDetailsHeaderProps} from '@/shared/interfaces/assessmentChecklistDetails';

const AssessmentChecklistDetailsHeader = ({
  checklist,
  isArchiving,
  onArchive,
  onCopy,
}: AssessmentChecklistDetailsHeaderProps) => {
  const {t} = useTranslation();

  const isActive =
    checklist.status === ASSESSMENT_CHECKLIST_STATUS.ACTIVE.value;

  return (
    <>
      <TopBarSlot side='left'>
        <RecordHeading
          crumb={t('assessmentChecklists.backToList')}
          crumbHref={DASHBOARD_ROUTES.assessmentChecklists.all()}
          name={checklist.title}
        />
      </TopBarSlot>

      <TopBarSlot side='right'>
        <Box className='flex items-center gap-2'>
          <Button variant='outlined' onClick={onCopy}>
            {t('assessmentChecklists.detail.actions.useAsStart')}
          </Button>
          {isActive && (
            <Button
              variant='contained'
              color='error'
              disabled={isArchiving}
              onClick={onArchive}
            >
              {t('assessmentChecklists.detail.actions.archive')}
            </Button>
          )}
        </Box>
      </TopBarSlot>
    </>
  );
};

export default AssessmentChecklistDetailsHeader;
