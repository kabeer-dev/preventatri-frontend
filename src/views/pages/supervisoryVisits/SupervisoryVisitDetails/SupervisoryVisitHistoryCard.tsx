'use client';

import {useMemo} from 'react';

import ActivityTimeline from '@/shared/components/common/ActivityTimeline';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {SupervisoryVisitHistoryCardProps} from '@/shared/interfaces/supervisoryVisit';
import {mapVisitEventToTimelineEntry} from '@/shared/utils/supervisoryVisitUtils';

const SupervisoryVisitHistoryCard = ({
  events,
}: SupervisoryVisitHistoryCardProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();

  const entries = useMemo(
    () => events.map((event) => mapVisitEventToTimelineEntry({event, t, zone})),
    [events, t, zone]
  );

  return (
    <ActivityTimeline
      title={t('supervisoryVisits.detail.history')}
      entries={entries}
      emptyMessage={t('supervisoryVisits.detail.historyEmpty')}
    />
  );
};

export default SupervisoryVisitHistoryCard;
