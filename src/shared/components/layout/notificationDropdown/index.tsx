'use client';

import {SyntheticEvent, useCallback, useState} from 'react';

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import {layout, radius} from '@/@core/theme/spacing';
import NotificationsIcon from '@/shared/assets/icons/notifications.svg';
import {
  NOTIFICATION_TYPE_CONFIG,
  NOTIFICATION_TYPE_ORDER,
} from '@/shared/constants/notificationTypes';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useExpandedClusters from '@/shared/hooks/useExpandedClusters';
import useInfiniteScrollSentinel from '@/shared/hooks/useInfiniteScrollSentinel';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useMarkNotificationRead from '@/shared/hooks/useMarkNotificationRead';
import useTranslation from '@/shared/hooks/useTranslation';
import {NotificationItemOnClickPayload} from '@/shared/interfaces/notification';
import {notificationQueries} from '@/shared/reactQuery';
import {
  flattenNotificationPages,
  groupNotificationsByTypeAndCluster,
} from '@/shared/utils/notificationsUtils';

import NotificationGroupItem from './NotificationGroupItem';
import NotificationItem from './NotificationItem';

const NotificationDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(
    null
  );
  const {push} = useLocaleRouter();

  const {t} = useTranslation();

  const {useInfiniteNotifications} = notificationQueries();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteNotifications({});

  const markRead = useMarkNotificationRead();

  const allNotifications = flattenNotificationPages({pages: data?.pages});

  // Same grouping as the notifications page: a section per type, with related
  // notifications in the same time window collapsed into one expandable row.
  const notificationGroups = groupNotificationsByTypeAndCluster({
    notifications: allNotifications,
    types: NOTIFICATION_TYPE_ORDER,
  });

  const {isClusterExpanded, toggleCluster} = useExpandedClusters();

  // Server-provided total of unread notifications; the loaded pages are only a
  // window, so counting isRead locally would undercount once there are more
  // unread than fetched. Socket-arrived notifications overwrite it with the
  // server-computed total pushed with each event (see SocketWrapper).
  const unreadCount = data?.pages?.[0]?.unreadCount ?? 0;

  const handleOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleNotificationClick = useCallback(
    ({
      documentType,
      documentId,
      notificationId,
      isRead,
    }: NotificationItemOnClickPayload) => {
      markRead({notificationId, isRead});

      // Navigation itself is declarative (the <Link> in NotificationItem);
      // just close the dropdown when the click will navigate away.
      if (documentType && documentId) {
        handleClose();
      }
    },
    [markRead, handleClose]
  );

  const handleViewAll = useCallback(() => {
    handleClose();
    push({url: DASHBOARD_ROUTES.notifications.all()});
  }, [handleClose, push]);

  const isOpen = Boolean(anchorEl);

  const setSentinelNode = useInfiniteScrollSentinel({
    root: scrollContainer,
    enabled: isOpen && Boolean(scrollContainer),
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <>
      <IconButton
        centerRipple={false}
        onClick={handleOpen}
        sx={{
          width: layout.topBarActionSize,
          height: layout.topBarActionSize,
          color: 'text.secondary',
          borderRadius: `${radius.md}px`,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          '&:hover': {backgroundColor: 'customColors.surfaceRaised'},
          '& svg': {
            width: layout.topBarActionIconSize,
            height: layout.topBarActionIconSize,
          },
        }}
      >
        <Badge
          color='error'
          badgeContent={unreadCount}
          max={99}
          invisible={unreadCount === 0}
          sx={{
            '& .MuiBadge-badge': {
              top: -6,
              right: -6,
              minWidth: 16,
              height: 16,
              padding: '0 4px',
              fontSize: '0.625rem',
              fontWeight: 600,
              boxShadow: (theme) =>
                `0 0 0 2px ${theme.palette.background.paper}`,
            },
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        sx={{
          '& .MuiMenu-paper': {width: 380, overflow: 'hidden', mt: 1},
          '& .MuiMenu-list': {padding: 0},
        }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            cursor: 'default',
            userSelect: 'auto',
            backgroundColor: 'transparent !important',
            px: 4,
            py: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography sx={{fontWeight: 600}}>
              {t('notifications.title')}
            </Typography>
            {unreadCount > 0 && (
              <CustomChip
                skin='light'
                size='small'
                color='primary'
                label={t('notifications.unreadCount', {count: unreadCount})}
                sx={{
                  height: 20,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderRadius: '10px',
                }}
              />
            )}
          </Box>
        </MenuItem>

        <Divider sx={{my: 0}} />

        <Box
          ref={setScrollContainer}
          sx={{maxHeight: 360, overflowY: 'auto', overflowX: 'hidden'}}
        >
          {isLoading ? (
            <Box sx={{display: 'flex', justifyContent: 'center', py: 8}}>
              <CircularProgress size={20} />
            </Box>
          ) : isError ? (
            <Box sx={{py: 8, textAlign: 'center'}}>
              <Typography variant='body2' color='error'>
                {t('notifications.loadError')}
              </Typography>
            </Box>
          ) : allNotifications.length === 0 ? (
            <Box sx={{py: 8, textAlign: 'center'}}>
              <Typography
                variant='body2'
                sx={{
                  color: 'text.secondary',
                }}
              >
                {t('notifications.noNotifications')}
              </Typography>
            </Box>
          ) : (
            notificationGroups.map((group) => (
              <Box key={group.type}>
                <Box sx={{px: 4, pt: 2.5, pb: 1.5}}>
                  <span
                    className={`text-[11px] font-bold tracking-wider uppercase ${NOTIFICATION_TYPE_CONFIG[group.type].labelClassName}`}
                  >
                    {NOTIFICATION_TYPE_CONFIG[group.type].label}
                  </span>
                </Box>
                <Divider sx={{my: 0}} />
                {group.clusters.map((cluster) =>
                  cluster.items.length > 1 ? (
                    <NotificationGroupItem
                      key={cluster.key}
                      items={cluster.items}
                      isExpanded={isClusterExpanded(cluster.key)}
                      onToggle={() => toggleCluster(cluster.key)}
                      onItemClick={handleNotificationClick}
                    />
                  ) : (
                    <NotificationItem
                      key={cluster.items[0].id}
                      notification={cluster.items[0]}
                      onClick={handleNotificationClick}
                    />
                  )
                )}
              </Box>
            ))
          )}
          <div ref={setSentinelNode} />
          {isFetchingNextPage && (
            <Box sx={{display: 'flex', justifyContent: 'center', py: 2}}>
              <CircularProgress size={20} />
            </Box>
          )}
        </Box>

        <Divider sx={{my: 0}} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleViewAll}
          sx={{
            justifyContent: 'center',
            py: 3,
            cursor: 'pointer',
            backgroundColor: 'transparent !important',
          }}
        >
          <Typography variant='body2' color='primary' sx={{fontWeight: 600}}>
            {t('notifications.viewAll')}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default NotificationDropdown;
