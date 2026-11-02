'use client';

import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import UserPresenceDot from '@/@core/layouts/components/shared-components/UserPresenceDot';
import {UserMenuProps} from '@/@core/layouts/types';
import {DEFAULT_LOGO} from '@/shared/constants/general';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useUserRole from '@/shared/hooks/useUserRole';
import {userMutations} from '@/shared/reactQuery';
import {getSystemRoleLabel, getUserDisplayName} from '@/shared/utils/general';

const itemStyles = {
  py: 2,
  px: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  color: 'inherit',
  textDecoration: 'none',
  '& svg': {
    mr: 2,
    fontSize: '1.375rem',
    color: 'inherit',
  },
};

const UserMenu = ({
  anchorEl,
  onClose,
  anchorOrigin,
  transformOrigin,
}: UserMenuProps) => {
  const router = useLocaleRouter();
  const {currentUser: user} = useGetLoggedInUser();
  const {isCaregiver} = useUserRole();
  const {useSignOutMutation} = userMutations();
  const {mutate: executeSignOutMutation} = useSignOutMutation();

  const displayName = getUserDisplayName({user});

  const menuItems = [
    {
      icon: 'mdi:cog-outline',
      label: 'Settings',
      color: 'text.primary',
      onClick: () => {
        onClose();

        // The caregiver's settings are her Me screen.
        router.push({
          url: isCaregiver
            ? DASHBOARD_ROUTES.me.all()
            : DASHBOARD_ROUTES.settings.all(),
        });
      },
    },
    {
      icon: 'mdi:logout-variant',
      label: 'Logout',
      color: 'error.main',
      onClick: () => {
        onClose();
        executeSignOutMutation({});
      },
    },
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      sx={{
        '& .MuiMenu-paper': {
          width: 230,
          ...(transformOrigin.vertical === 'bottom' ? {mb: 2} : {mt: 4}),
        },
        '& .MuiList-root': {pb: 0},
      }}
    >
      <Box sx={{pt: 2, pb: 3, px: 4}}>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Badge
            overlap='circular'
            badgeContent={<UserPresenceDot />}
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
          >
            <Avatar
              alt={displayName}
              src={user?.profileImage?.url || DEFAULT_LOGO}
              sx={{width: '2.5rem', height: '2.5rem'}}
            />
          </Badge>
          <Box
            sx={{
              display: 'flex',
              ml: 3,
              minWidth: 0,
              alignItems: 'flex-start',
              flexDirection: 'column',
            }}
          >
            <Typography noWrap sx={{fontWeight: 600, maxWidth: '100%'}}>
              {displayName}
            </Typography>
            <Typography
              variant='body2'
              sx={{fontSize: '0.8rem', color: 'text.disabled'}}
            >
              {getSystemRoleLabel({
                role: user?.currentActiveOrganization?.role,
              }) || 'User'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {menuItems.map(({icon, label, color, onClick}) => (
        <Box key={label}>
          <Divider sx={{my: '0 !important'}} />
          <MenuItem onClick={onClick} sx={{color}}>
            <Box sx={itemStyles}>
              <Icon icon={icon} />
              {label}
            </Box>
          </MenuItem>
        </Box>
      ))}
    </Menu>
  );
};

export default UserMenu;
