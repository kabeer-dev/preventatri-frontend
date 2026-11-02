'use client';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import {ChevronDownIcon, ChevronRightIcon} from '@/shared/components/icons';
import {NotificationGroupItemProps} from '@/shared/interfaces/notification';
import {summarizeNotificationCluster} from '@/shared/utils/notificationsUtils';

import NotificationItem from './NotificationItem';
import NotificationLeadingBadge from './NotificationLeadingBadge';

// A cluster of related notifications (same document type, same time window),
// mirroring the notifications page: the summary row shows the latest one plus
// the count and toggles the list; each notification inside stays clickable.
const NotificationGroupItem = ({
  items,
  isExpanded,
  onToggle,
  onItemClick,
}: NotificationGroupItemProps) => {
  const {sortedItems, latest, hasUnread, timeLabel} =
    summarizeNotificationCluster({items});

  return (
    <>
      <Box
        component='button'
        type='button'
        onClick={onToggle}
        aria-expanded={isExpanded}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 3,
          width: '100%',
          pl: 2,
          pr: 4,
          py: 2.5,
          border: 0,
          font: 'inherit',
          textAlign: 'left',
          color: 'inherit',
          cursor: 'pointer',
          backgroundColor: hasUnread ? 'action.hover' : 'transparent',
        }}
      >
        <NotificationLeadingBadge
          notification={latest}
          showUnreadDot={hasUnread}
        />
        <Box sx={{flex: 1, overflow: 'hidden'}}>
          <Box sx={{display: 'flex', alignItems: 'baseline', gap: 1.5}}>
            <Typography
              variant='subtitle2'
              sx={{
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {latest.title}
            </Typography>
            <Typography
              variant='caption'
              sx={{color: 'text.secondary', flexShrink: 0}}
            >
              {items.length}
            </Typography>
          </Box>
          {latest.description && (
            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {latest.description}
            </Typography>
          )}
          <Typography variant='caption' sx={{color: 'text.disabled'}}>
            {timeLabel}
          </Typography>
        </Box>
        <Box sx={{flexShrink: 0, mt: 0.5, color: 'text.secondary'}}>
          {isExpanded ? (
            <ChevronDownIcon size={14} className='fill-current' />
          ) : (
            <ChevronRightIcon size={14} className='fill-current' />
          )}
        </Box>
      </Box>
      <Divider sx={{my: 0}} />

      <Collapse in={isExpanded} unmountOnExit>
        <Box sx={{pl: 4}}>
          {sortedItems.map((item) => (
            <NotificationItem
              key={item.id}
              notification={item}
              onClick={onItemClick}
            />
          ))}
        </Box>
      </Collapse>
    </>
  );
};

export default NotificationGroupItem;
