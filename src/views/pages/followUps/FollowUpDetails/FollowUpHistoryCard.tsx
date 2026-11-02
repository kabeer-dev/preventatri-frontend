'use client';

import {useMemo} from 'react';

import ActivityTimeline from '@/shared/components/common/ActivityTimeline';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {FollowUpHistoryCardProps} from '@/shared/interfaces/followUp';
import {mapEventToTimelineEntry} from '@/shared/utils/followUpUtils';

const FollowUpHistoryCard = ({events}: FollowUpHistoryCardProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();

  const entries = useMemo(
    () => events.map((event) => mapEventToTimelineEntry({event, t, zone})),
    [events, t, zone]
  );

  return (
    <ActivityTimeline
      title={t('followUps.detail.history')}
      entries={entries}
      emptyMessage={t('followUps.detail.historyEmpty')}
    />
  );
};

export default FollowUpHistoryCard;
