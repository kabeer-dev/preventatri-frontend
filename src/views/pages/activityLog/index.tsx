'use client';

import Box from '@mui/material/Box';

import SegmentedTabs from '@/shared/components/common/inputs/SegmentedTabs';
import {
  ACTIVITY_LOG_VIEW,
  ACTIVITY_LOG_VIEW_PARAM,
} from '@/shared/constants/activityLog';
import {ACTIVITY_LOG_VIEW_TABS} from '@/shared/constants/listToolbarTabs';
import {useListTabs} from '@/shared/hooks/useListTabs';
import useTranslation from '@/shared/hooks/useTranslation';

import AuditLogView from './AuditLogView';
import SystemLogsView from './SystemLogsView';

// Two readings of what happened in the organization: the audit trail of what
// users did, and the system logs of what the system notified them about. Only
// the selected one is mounted, so only it fetches.
const ActivityLogPage = () => {
  const {t} = useTranslation();

  const {tabs} = useListTabs({
    urlKey: ACTIVITY_LOG_VIEW_PARAM,
    ariaLabel: t('activityLog.views.ariaLabel'),
    options: ACTIVITY_LOG_VIEW_TABS,
    defaultValue: ACTIVITY_LOG_VIEW.audit,
  });

  return (
    <Box className='flex flex-col gap-3.5'>
      <Box>
        <SegmentedTabs {...tabs} flat />
      </Box>

      {tabs.value === ACTIVITY_LOG_VIEW.system ? (
        <SystemLogsView />
      ) : (
        <AuditLogView />
      )}
    </Box>
  );
};

export default ActivityLogPage;
