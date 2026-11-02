import Collapse from '@mui/material/Collapse';

import {ChevronDownIcon, ChevronRightIcon} from '@/shared/components/icons';
import {NotificationGroupRowProps} from '@/shared/interfaces/notification';
import {summarizeNotificationCluster} from '@/shared/utils/notificationsUtils';

import NotificationRow from './NotificationRow';

const NotificationGroupRow = ({
  items,
  isExpanded,
  onToggle,
  onItemClick,
  showRecipient,
  viewerId,
}: NotificationGroupRowProps) => {
  const {sortedItems, latest, hasUnread, timeLabel} =
    summarizeNotificationCluster({items});

  return (
    <div className='border-rule border-t first:border-t-0'>
      <button
        type='button'
        onClick={onToggle}
        aria-expanded={isExpanded}
        className='flex w-full cursor-pointer items-start justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-(--mui-palette-action-hover)'
      >
        <div className='flex min-w-0 items-start gap-2'>
          {isExpanded ? (
            <ChevronDownIcon size={14} className='mt-1 shrink-0 fill-current' />
          ) : (
            <ChevronRightIcon
              size={14}
              className='mt-1 shrink-0 fill-current'
            />
          )}

          <div className='min-w-0'>
            <p
              className={`text-ink text-sm ${hasUnread ? 'font-bold' : 'font-medium'}`}
            >
              {latest.title}
              <span className='text-ink-subtle ml-2 text-xs font-medium'>
                {items.length}
              </span>
            </p>
            {latest.description && (
              <p className='text-ink-muted mt-0.5 text-xs'>
                {latest.description}
              </p>
            )}
          </div>
        </div>

        <span className='text-ink-subtle shrink-0 text-xs whitespace-nowrap'>
          {timeLabel}
        </span>
      </button>

      <Collapse in={isExpanded} unmountOnExit>
        <div className='border-rule border-t pl-6'>
          {sortedItems.map((item) => (
            <NotificationRow
              key={item.id}
              notification={item}
              onClick={onItemClick}
              showRecipient={showRecipient}
              viewerId={viewerId}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default NotificationGroupRow;
