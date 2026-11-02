'use client';

import {ElementType} from 'react';

import Box, {BoxProps} from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import ListItemButton, {
  ListItemButtonProps,
} from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import {styled} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {usePathname} from 'next/navigation';

import NavItemIcon from '@/@core/layouts/components/vertical/navigation/NavItemIcon';
import {NavLinkProps} from '@/@core/layouts/types';
import {
  getNavItemIconSx,
  getNavItemPadding,
  getNavItemTextSx,
  getNavItemTitleProps,
  isNavLinkActive,
} from '@/@core/layouts/utils';
import {radius} from '@/@core/theme/spacing';
import themeConfig from '@/configs/themeConfig';
import Link from '@/shared/components/common/localeLink';
import {normalizePath} from '@/shared/utils/routeUtils';

const MenuNavLink = styled(ListItemButton)<
  ListItemButtonProps & {
    component?: ElementType;
    href?: string;
    target?: '_blank';
  }
>(({theme}) => ({
  width: '100%',
  borderRadius: radius.md,
  transition:
    'padding-left .25s ease-in-out, background-color .25s ease-in-out',
  '& .MuiTypography-root': {
    color: theme.palette.customColors.shellText,
  },
  '&&:hover': {
    backgroundColor: theme.palette.customColors.shellRaised,
  },
  '&&.Mui-focusVisible': {
    backgroundColor: theme.palette.customColors.shellRaised,
    outline: `2px solid ${theme.palette.customColors.shellText}`,
    outlineOffset: -2,
  },
  '&.active': {
    '&, &:hover': {
      backgroundColor: theme.palette.customColors.shellActive,
      '&.Mui-focusVisible': {
        backgroundColor: theme.palette.customColors.shellActive,
      },
    },
    '& .MuiTypography-root': {
      fontWeight: 600,
      color: `${theme.palette.common.white} !important`,
    },
    '& .MuiListItemIcon-root': {
      color: `${theme.palette.common.white} !important`,
    },
  },
}));

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>(({theme}) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && {overflow: 'hidden'}),
}));

const VerticalNavLink = ({
  item,
  parent,
  navHover,
  settings,
  navVisible,
  isSubToSub,
  toggleNavVisibility,
}: NavLinkProps) => {
  const pathname = usePathname();
  const {navCollapsed} = settings;

  const icon = parent && !item.icon ? 'mdi:circle-outline' : item.icon;
  const pathWithoutLocale = normalizePath({path: pathname});

  const navItemPadding = getNavItemPadding({
    navCollapsed,
    navHover: navHover || false,
  });

  const isActive = isNavLinkActive({item, currentPath: pathWithoutLocale});

  return (
    <ListItem
      disablePadding
      className='nav-link'
      sx={{
        mt: 0.75,
        transition: 'padding .25s ease-in-out',
        px: (theme) =>
          parent
            ? '0 !important'
            : `${theme.spacing(navCollapsed && !navHover ? 2 : 3)} !important`,
        ...(item.disabled && {opacity: 0.5, pointerEvents: 'none'}),
      }}
    >
      {/* An item without a path is an action: a button, never a link to "/". */}
      <MenuNavLink
        {...(item.path === undefined
          ? {}
          : {
              component: Link,
              href: `${item.path}`,
              ...(item.openInNewTab ? {target: '_blank'} : null),
            })}
        {...(item.disabled && {tabIndex: -1})}
        className={isActive ? 'active' : ''}
        onClick={() => {
          item.onClick?.();
          if (navVisible) {
            toggleNavVisibility();
          }
        }}
        sx={{
          py: 2.25,
          ...(item.disabled ? {pointerEvents: 'none'} : {cursor: 'pointer'}),
          ...navItemPadding,
          ...(item.isDanger && {
            color: 'customColors.shellDangerText',
            '& .MuiTypography-root': {color: 'customColors.shellDangerText'},
            '& .MuiListItemIcon-root': {color: 'customColors.shellDangerText'},
          }),
        }}
      >
        {isSubToSub ? null : (
          <ListItemIcon
            sx={getNavItemIconSx({
              parent,
              navCollapsed,
              navHover: navHover || false,
              hasCustomIcon: Boolean(item.icon),
            })}
          >
            <NavItemIcon icon={icon} />
          </ListItemIcon>
        )}

        <MenuItemTextMetaWrapper
          sx={getNavItemTextSx({
            navCollapsed,
            navHover: navHover || false,
            isIndented: Boolean(isSubToSub),
          })}
        >
          <Typography
            {...getNavItemTitleProps({
              navCollapsed,
              navHover: navHover || false,
            })}
          >
            {item.title}
          </Typography>
          {item.badgeContent ? (
            <Chip
              size='small'
              label={item.badgeContent}
              color={item.badgeColor || 'primary'}
              sx={{
                '& .MuiChip-label': {
                  px: 2.5,
                  lineHeight: 1.385,
                  textTransform: 'capitalize',
                },
              }}
            />
          ) : null}
        </MenuItemTextMetaWrapper>
      </MenuNavLink>
    </ListItem>
  );
};

export default VerticalNavLink;
