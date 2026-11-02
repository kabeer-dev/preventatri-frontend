'use client';

import Box, {BoxProps} from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {styled, useTheme} from '@mui/material/styles';

import Icon from '@/@core/components/icon';
import {NavHeaderProps} from '@/@core/layouts/types';
import {layout} from '@/@core/theme/spacing';
import Link from '@/shared/components/common/localeLink';
import Logo from '@/shared/components/common/logo';

const MenuHeaderWrapper = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2.75),
  paddingTop: theme.spacing(1.5),
  paddingRight: theme.spacing(2.5),
  paddingBottom: 0,
  justifyContent: 'space-between',
  transition: 'padding .25s ease-in-out',
  minHeight: layout.sidebarHeaderHeight,
}));

const LinkStyled = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
});

const VerticalNavHeader = ({
  hidden,
  navHover,
  settings,
  saveSettings,
  collapsedNavWidth,
  toggleNavVisibility,
  navigationBorderWidth,
  menuLockedIcon: userMenuLockedIcon,
  navMenuBranding: userNavMenuBranding,
  menuUnlockedIcon: userMenuUnlockedIcon,
}: NavHeaderProps) => {
  const theme = useTheme();
  const {direction, navCollapsed} = settings;

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userNavMenuBranding) {
        return 0;
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 40) / 8;
      }
    } else {
      return 2.5;
    }
  };

  const svgRotationDeg = () => {
    if (navCollapsed) {
      if (direction === 'rtl') {
        return navHover ? 0 : 180;
      } else {
        return navHover ? 180 : 0;
      }
    } else {
      return direction === 'rtl' ? 180 : 0;
    }
  };

  return (
    <MenuHeaderWrapper
      className={`nav-header ${navCollapsed && !navHover ? 'justify-center' : ''}`}
      sx={{pl: menuHeaderPaddingLeft()}}
    >
      {userNavMenuBranding ? (
        userNavMenuBranding({navHover, settings})
      ) : navCollapsed && !navHover ? null : (
        <LinkStyled href='/dashboard'>
          <Logo onDark />
        </LinkStyled>
      )}

      {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{
            p: 0,
            color: 'customColors.shellText',
            backgroundColor: 'transparent !important',
          }}
        >
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      ) : userMenuLockedIcon === null &&
        userMenuUnlockedIcon === null ? null : (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() => saveSettings({navCollapsed: !navCollapsed})}
          sx={{
            p: 0,
            color: 'customColors.shellText',
            backgroundColor: 'transparent !important',
          }}
        >
          {userMenuLockedIcon && userMenuUnlockedIcon ? (
            navCollapsed ? (
              userMenuUnlockedIcon
            ) : (
              userMenuLockedIcon
            )
          ) : (
            <Box
              fill='none'
              component='svg'
              viewBox='0 0 22 22'
              xmlns='http://www.w3.org/2000/svg'
              sx={{
                width: 22,
                height: 22,
                transform: `rotate(${svgRotationDeg()}deg)`,
                transition: 'transform .25s ease-in-out .35s',
              }}
            >
              <path
                fill={theme.palette.customColors.shellText}
                d='M11.4854 4.88844C11.0082 4.41121 10.2344 4.41121 9.75716 4.88844L4.51029 10.1353C4.03299 10.6126 4.03299 11.3865 4.51029 11.8638L9.75716 17.1107C10.2344 17.5879 11.0082 17.5879 11.4854 17.1107C11.9626 16.6334 11.9626 15.8597 11.4854 15.3824L7.96674 11.8638C7.48943 11.3865 7.48943 10.6126 7.96674 10.1353L11.4854 6.61667C11.9626 6.13943 11.9626 5.36568 11.4854 4.88844Z'
              />
              <path
                fill={theme.palette.customColors.shellMuted}
                d='M15.8683 4.88844L10.6214 10.1353C10.1441 10.6126 10.1441 11.3865 10.6214 11.8638L15.8683 17.1107C16.3455 17.5879 17.1193 17.5879 17.5965 17.1107C18.0737 16.6334 18.0737 15.8597 17.5965 15.3824L14.0779 11.8638C13.6005 11.3865 13.6005 10.6126 14.0779 10.1353L17.5965 6.61667C18.0737 6.13943 18.0737 5.36568 17.5965 4.88844C17.1193 4.41121 16.3455 4.41121 15.8683 4.88844Z'
              />
            </Box>
          )}
        </IconButton>
      )}
    </MenuHeaderWrapper>
  );
};

export default VerticalNavHeader;
