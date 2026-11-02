'use client';

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {usePathname} from 'next/navigation';

import Icon from '@/@core/components/icon';
import {controlHeight} from '@/@core/theme/spacing';
import Link from '@/shared/components/common/localeLink';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import useUnreadNotificationsCount from '@/shared/hooks/useUnreadNotificationsCount';
import {isPathActive} from '@/shared/utils/routeUtils';

const TABS = [
  {
    key: 'today',
    icon: 'mdi:calendar-today-outline',
    path: DASHBOARD_ROUTES.home(),
  },
  {
    key: 'patients',
    icon: 'mdi:account-group-outline',
    path: DASHBOARD_ROUTES.patients.all(),
  },
  {key: 'activity', icon: 'mdi:pulse', path: DASHBOARD_ROUTES.activity.all()},
  {
    key: 'notifications',
    icon: 'mdi:bell-outline',
    path: DASHBOARD_ROUTES.notifications.all(),
  },
  {key: 'me', icon: 'mdi:account-outline', path: DASHBOARD_ROUTES.me.all()},
];

/** The phone's only navigation: five tabs fixed to the bottom edge. */
const CaregiverBottomTabs = () => {
  const {t} = useTranslation();
  const pathname = usePathname();
  const unreadCount = useUnreadNotificationsCount();

  return (
    <Box
      component='nav'
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.appBar + 1,
        display: 'grid',
        gridTemplateColumns: `repeat(${TABS.length}, 1fr)`,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({key, icon, path}) => {
        const isActive = isPathActive({
          currentPath: pathname,
          targetPath: path,
        });

        return (
          <Box
            key={key}
            component={Link}
            href={path}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              minWidth: 0,
              textDecoration: 'none',
              minHeight: controlHeight.xl,
              py: 2,
              color: isActive ? 'primary.main' : 'text.disabled',
            }}
          >
            <Badge
              color='error'
              badgeContent={unreadCount}
              max={99}
              invisible={key !== 'notifications' || unreadCount === 0}
              sx={{
                '& .MuiBadge-badge': {
                  minWidth: 16,
                  height: 16,
                  padding: '0 4px',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                },
              }}
            >
              <Icon icon={icon} fontSize={22} />
            </Badge>
            <Typography
              noWrap
              component='span'
              sx={{
                maxWidth: '100%',
                fontSize: '0.6875rem',
                fontWeight: isActive ? 700 : 600,
              }}
            >
              {t(`caregiverPortal.nav.${key}`)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default CaregiverBottomTabs;
