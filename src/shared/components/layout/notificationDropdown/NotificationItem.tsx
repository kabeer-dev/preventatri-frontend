'use client';

import {KeyboardEvent} from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import Link from '@/shared/components/common/localeLink';
import {NotificationItemProps} from '@/shared/interfaces/notification';
import {getNotificationRowState} from '@/shared/utils/notificationsUtils';

import NotificationLeadingBadge from './NotificationLeadingBadge';

const NotificationItem = ({notification, onClick}: NotificationItemProps) => {
  const {title, description, isRead} = notification;

  // A targeted item navigates declaratively via next/link (the app's
  // locale-aware Link), so it renders as a native <a>.
  const {
    href,
    timeLabel: relativeTime,
    isClickable,
    handleClick,
  } = getNotificationRowState({notification, onClick});

  // A non-navigable interactive row is a <div role="button"> and needs explicit
  // keyboard activation; a navigable row is a native <a> that already has it.
  const asButton = isClickable && !href;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (asButton && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleClick();
    }
  };

  const rowSx = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 3,
    pl: 2,
    pr: 4,
    py: 2.5,
    textDecoration: 'none',
    color: 'inherit',
    backgroundColor: isRead ? 'transparent' : 'action.hover',
    cursor: isClickable ? 'pointer' : 'default',
  } as const;

  const rowContent = (
    <>
      <NotificationLeadingBadge
        notification={notification}
        showUnreadDot={!isRead}
      />
      <Box sx={{flex: 1, overflow: 'hidden'}}>
        <Typography
          variant='subtitle2'
          sx={{
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>
        {description && (
          <Tooltip title={description} placement='top' arrow enterDelay={400}>
            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {description}
            </Typography>
          </Tooltip>
        )}
        <Typography
          variant='caption'
          sx={{
            color: 'text.disabled',
          }}
        >
          {relativeTime}
        </Typography>
      </Box>
    </>
  );

  return (
    <>
      {href ? (
        <Box component={Link} href={href} onClick={handleClick} sx={rowSx}>
          {rowContent}
        </Box>
      ) : (
        <Box
          onClick={handleClick}
          onKeyDown={asButton ? handleKeyDown : undefined}
          role={asButton ? 'button' : undefined}
          tabIndex={asButton ? 0 : undefined}
          sx={rowSx}
        >
          {rowContent}
        </Box>
      )}
      <Divider sx={{my: 0}} />
    </>
  );
};

export default NotificationItem;
