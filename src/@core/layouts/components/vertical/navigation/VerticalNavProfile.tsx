'use client';

import {SyntheticEvent, useState} from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import UserMenu from '@/@core/layouts/components/shared-components/UserMenu';
import {NavProfileProps} from '@/@core/layouts/types';
import {DEFAULT_LOGO} from '@/shared/constants/general';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import {getOrgRoleLabel, getUserDisplayName} from '@/shared/utils/general';

const VerticalNavProfile = ({navHover, settings}: NavProfileProps) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const {currentUser} = useGetLoggedInUser();

  const {navCollapsed} = settings;
  const isCollapsed = navCollapsed && !navHover;

  const displayName = getUserDisplayName({user: currentUser});

  return (
    <Box
      sx={{
        borderTop: (theme) =>
          `1px solid ${theme.palette.customColors.shellActive}`,
      }}
    >
      <ButtonBase
        onClick={(event: SyntheticEvent) => setAnchorEl(event.currentTarget)}
        sx={{
          width: '100%',
          px: 5,
          py: 5,
          gap: 2.5,
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          transition: 'background-color .25s ease-in-out',
          '&:hover, &.Mui-focusVisible': {
            backgroundColor: 'customColors.shellRaised',
          },
        }}
      >
        <Avatar
          alt={displayName}
          src={currentUser?.profileImage?.url || DEFAULT_LOGO}
          sx={{width: 32, height: 32, flexShrink: 0}}
        />

        {!isCollapsed && (
          <>
            <Box sx={{minWidth: 0, textAlign: 'left', flexGrow: 1}}>
              <Typography
                noWrap
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'common.white',
                }}
              >
                {displayName}
              </Typography>
              <Typography
                noWrap
                sx={{fontSize: '0.6875rem', color: 'customColors.shellMuted'}}
              >
                {getOrgRoleLabel({
                  role: currentUser?.currentActiveOrganization?.role,
                }) || 'User'}
              </Typography>
            </Box>

            <Icon
              icon='mdi:unfold-more-horizontal'
              fontSize='0.875rem'
              color='var(--mui-palette-customColors-shellMuted)'
            />
          </>
        )}
      </ButtonBase>

      <UserMenu
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        transformOrigin={{vertical: 'bottom', horizontal: 'center'}}
      />
    </Box>
  );
};

export default VerticalNavProfile;
