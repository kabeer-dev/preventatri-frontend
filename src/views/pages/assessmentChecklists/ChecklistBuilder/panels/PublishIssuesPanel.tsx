'use client';

import {Icon} from '@iconify/react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';

import {CHECKLIST_BUILDER_ICONS} from '@/shared/constants/checklistBuilder';
import useTranslation from '@/shared/hooks/useTranslation';
import {PublishIssuesPanelProps} from '@/shared/interfaces/checklistBuilder';

const PublishIssuesPanel = ({issues}: PublishIssuesPanelProps) => {
  const {t} = useTranslation();

  if (issues.length === 0) {
    return (
      <Alert severity='success'>
        {t('assessmentChecklists.builder.readyToPublish')}
      </Alert>
    );
  }

  return (
    <Alert
      severity='error'
      icon={<Icon icon={CHECKLIST_BUILDER_ICONS.warning} />}
    >
      <AlertTitle>{t('assessmentChecklists.builder.cannotPublish')}</AlertTitle>
      <Box component='ul' sx={{m: 0, pl: 4}}>
        {issues.map((issue) => (
          <li key={issue}>{issue}</li>
        ))}
      </Box>
    </Alert>
  );
};

export default PublishIssuesPanel;
