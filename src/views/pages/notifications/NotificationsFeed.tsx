'use client';

import {useMemo, useState} from 'react';

import CircularProgress from '@mui/material/CircularProgress';

import SkeletonRow from '@/shared/components/common/skeletons/SkeletonRow';
import {
  NOTIFICATION_TABS,
  NOTIFICATION_TYPE_CONFIG,
  NOTIFICATION_TYPE_ORDER,
} from '@/shared/constants/notificationTypes';
import {NOTIFICATION_SKELETON} from '@/shared/constants/skeletons';
import useExpandedClusters from '@/shared/hooks/useExpandedClusters';
import {
  NotificationsFeedProps,
  NotificationTypeFilter,
} from '@/shared/interfaces/notification';
import {groupNotificationsByTypeAndCluster} from '@/shared/utils/notificationsUtils';

import NotificationDateRangeFilter from './NotificationDateRangeFilter';
import NotificationGroupRow from './NotificationGroupRow';
import NotificationRow from './NotificationRow';

// The notifications list itself: type tabs and the date range, then the
// notifications sectioned by type with bursts collapsed into clusters. The
// notifications page feeds it the viewer's own list; the system logs feed it
// every user's, with each row naming its recipient.
const NotificationsFeed = ({
  notifications,
  summary,
  isLoading,
  isFetchingNextPage,
  sentinelRef,
  dateRange,
  onDateRangeChange,
  onItemClick,
  showRecipient,
  viewerId,
}: NotificationsFeedProps) => {
  const [activeTab, setActiveTab] = useState<NotificationTypeFilter>('all');

  const {isClusterExpanded, toggleCluster} = useExpandedClusters();

  const groups = useMemo(
    () =>
      groupNotificationsByTypeAndCluster({
        notifications,
        types: NOTIFICATION_TYPE_ORDER.filter(
          (type) => activeTab === 'all' || activeTab === type
        ),
      }),
    [notifications, activeTab]
  );

  return (
    <>
      <div className='border-rule flex flex-wrap items-center justify-between gap-2 border-b px-5'>
        <div role='tablist' className='flex gap-5'>
          {NOTIFICATION_TABS.map((tab) => {
            const isActive = tab.value === activeTab;

            return (
              <button
                key={tab.value}
                type='button'
                role='tab'
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.value)}
                className={`-mb-px cursor-pointer border-b-2 py-3 text-sm ${
                  isActive
                    ? 'border-ink text-ink font-bold'
                    : 'text-ink-muted hover:text-ink border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className='flex items-center gap-3 py-2'>
          <NotificationDateRangeFilter
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onChange={onDateRangeChange}
          />

          <span className='text-ink-subtle text-xs whitespace-nowrap'>
            {summary}
          </span>
        </div>
      </div>

      {isLoading ? (
        Array.from({length: NOTIFICATION_SKELETON.rows}, (_, index) => (
          <div
            key={index}
            className='border-rule border-t px-5 py-3.5 first:border-t-0'
          >
            <SkeletonRow lines={NOTIFICATION_SKELETON.lines} trailing='text' />
          </div>
        ))
      ) : groups.length === 0 ? (
        <p className='text-ink-muted py-10 text-center text-sm'>
          No notifications yet
        </p>
      ) : (
        groups.map((group) => {
          const config = NOTIFICATION_TYPE_CONFIG[group.type];

          return (
            <section key={group.type}>
              <div className='border-rule flex items-baseline gap-2 border-b px-5 pt-4 pb-2'>
                <span
                  className={`text-[11px] font-bold tracking-wider uppercase ${config.labelClassName}`}
                >
                  {config.label}
                </span>
                <span className='text-ink-subtle text-xs'>{config.hint}</span>
              </div>

              {group.clusters.map((cluster) =>
                cluster.items.length > 1 ? (
                  <NotificationGroupRow
                    key={cluster.key}
                    items={cluster.items}
                    isExpanded={isClusterExpanded(cluster.key)}
                    onToggle={() => toggleCluster(cluster.key)}
                    onItemClick={onItemClick}
                    showRecipient={showRecipient}
                    viewerId={viewerId}
                  />
                ) : (
                  <NotificationRow
                    key={cluster.items[0].id}
                    notification={cluster.items[0]}
                    onClick={onItemClick}
                    showRecipient={showRecipient}
                    viewerId={viewerId}
                  />
                )
              )}
            </section>
          );
        })
      )}

      <div ref={sentinelRef} />

      {isFetchingNextPage && (
        <div className='border-rule flex justify-center border-t py-3'>
          <CircularProgress size={20} />
        </div>
      )}
    </>
  );
};

export default NotificationsFeed;
