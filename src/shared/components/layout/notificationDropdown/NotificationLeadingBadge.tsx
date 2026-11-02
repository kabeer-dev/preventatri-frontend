import Box from '@mui/material/Box';

import Icon from '@/@core/components/icon';
import CustomAvatar from '@/@core/components/mui/avatar';
import {NotificationLeadingBadgeProps} from '@/shared/interfaces/notification';
import {getNotificationIcon} from '@/shared/utils/notificationsUtils';

// Leading cluster: unread dot + document-type icon badge. The 8px dot slot is
// always present (dot only when unread) so read and unread rows keep the
// icon/text in the same position.
const NotificationLeadingBadge = ({
  notification,
  showUnreadDot,
}: NotificationLeadingBadgeProps) => {
  const {icon, color} = getNotificationIcon(notification);

  return (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0}}>
      <Box sx={{width: 8, ml: 1, display: 'flex', justifyContent: 'center'}}>
        {showUnreadDot && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
            }}
          />
        )}
      </Box>
      <CustomAvatar skin='light' color={color} sx={{width: 34, height: 34}}>
        <Icon icon={icon} fontSize='1.125rem' />
      </CustomAvatar>
    </Box>
  );
};

export default NotificationLeadingBadge;
