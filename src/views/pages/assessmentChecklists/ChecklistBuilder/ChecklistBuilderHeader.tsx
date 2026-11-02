'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import RecordHeading from '@/shared/components/common/headers/RecordHeading';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {ChecklistBuilderHeaderProps} from '@/shared/interfaces/checklistBuilder';

const ChecklistBuilderHeader = ({
  template,
  title,
  isDirty,
  hasIssues,
  isSaving,
  isPublishing,
  isDeleting,
  onSave,
  onPublish,
  onDelete,
}: ChecklistBuilderHeaderProps) => {
  const {t} = useTranslation();
  const isBusy = isSaving || isPublishing || isDeleting;

  return (
    <>
      <TopBarSlot side='left'>
        <RecordHeading
          crumb={t('assessmentChecklists.backToList')}
          crumbHref={DASHBOARD_ROUTES.assessmentChecklists.all()}
          name={title.trim() || template.title}
        />
      </TopBarSlot>

      <TopBarSlot side='right'>
        <Box className='flex items-center gap-2'>
          <Button
            variant='text'
            color='error'
            disabled={isBusy}
            onClick={onDelete}
          >
            {t('assessmentChecklists.builder.actions.delete')}
          </Button>
          <Button
            variant='outlined'
            disabled={isBusy || !isDirty}
            onClick={onSave}
          >
            {t('assessmentChecklists.builder.actions.save')}
          </Button>
          <Button
            variant='contained'
            disabled={isBusy || hasIssues}
            onClick={onPublish}
          >
            {t('assessmentChecklists.builder.actions.publish')}
          </Button>
        </Box>
      </TopBarSlot>
    </>
  );
};

export default ChecklistBuilderHeader;
