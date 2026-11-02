'use client';

import {useEffect} from 'react';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import {usePathname} from 'next/navigation';

import Icon from '@/@core/components/icon';
import NavItemIcon from '@/@core/layouts/components/vertical/navigation/NavItemIcon';
import {NavGroup} from '@/@core/layouts/types';
import {
  getNavItemIconSx,
  getNavItemPadding,
  getNavItemTextSx,
  getNavItemTitleProps,
  hasActiveNavChild,
} from '@/@core/layouts/utils';
import {radius} from '@/@core/theme/spacing';
import {Settings} from '@/shared/providers/SettingsProvider';
import {normalizePath} from '@/shared/utils/routeUtils';

import VerticalNavItems from './VerticalNavItems';

interface Props {
  item: NavGroup;
  hidden: boolean;
  navHover: boolean;
  settings: Settings;
  navVisible?: boolean;
  parent?: boolean;
  groupActive: string[];
  collapsedNavWidth: number;
  navigationBorderWidth: number;
  toggleNavVisibility: () => void;
  setGroupActive: (value: string[] | ((prev: string[]) => string[])) => void;
}

const VerticalNavGroup = ({
  item,
  hidden,
  parent,
  navHover,
  settings,
  groupActive,
  collapsedNavWidth,
  navigationBorderWidth,
  setGroupActive,
  ...rest
}: Props) => {
  const pathname = usePathname();
  const currentPath = normalizePath({path: pathname});
  const {direction, navCollapsed} = settings;
  const navHoverEnabled = navHover || false;
  const isCollapsedRail = navCollapsed && !navHoverEnabled;

  const navItemPadding = getNavItemPadding({
    navCollapsed,
    navHover: navHoverEnabled,
  });

  const isCurrentPathInGroup = hasActiveNavChild({
    items: item.children,
    currentPath,
  });

  const isOpen = groupActive.includes(item.title);
  const shouldShowChildren = isOpen || isCurrentPathInGroup;

  useEffect(() => {
    setGroupActive((prev: string[]) => {
      if (isCurrentPathInGroup) {
        return prev.includes(item.title) ? prev : [...prev, item.title];
      }

      return prev.includes(item.title)
        ? prev.filter((title) => title !== item.title)
        : prev;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  const handleToggle = () => {
    setGroupActive((prev: string[]) =>
      prev.includes(item.title)
        ? prev.filter((title) => title !== item.title)
        : [...prev, item.title]
    );
  };

  const icon = parent && !item.icon ? 'mdi:circle-outline' : item.icon;

  return (
    <ListItem
      disablePadding
      className='nav-group'
      sx={{
        mt: 0.75,
        flexDirection: 'column',
        transition: 'padding .25s ease-in-out',
        px: (theme) =>
          parent
            ? '0 !important'
            : `${theme.spacing(navCollapsed && !navHover ? 2 : 3)} !important`,
      }}
    >
      <ListItemButton
        selected={shouldShowChildren}
        onClick={handleToggle}
        sx={{
          py: 2.25,
          width: '100%',
          borderRadius: `${radius.md}px`,
          transition:
            'padding-left .25s ease-in-out, background-color .25s ease-in-out',
          ...navItemPadding,
          '&:hover': {backgroundColor: 'customColors.shellRaised'},
          '&.Mui-selected': {
            backgroundColor: 'customColors.shellActive',
            '&:hover': {
              backgroundColor: 'customColors.shellActive',
            },
            '& .MuiTypography-root': {
              fontWeight: 600,
              color: (theme) => `${theme.palette.common.white} !important`,
            },
            '& .MuiListItemIcon-root': {
              color: (theme) => `${theme.palette.common.white} !important`,
            },
          },
          '&.Mui-selected.Mui-focusVisible': {
            backgroundColor: 'customColors.shellRaised',
            '&:hover': {
              backgroundColor: 'customColors.shellRaised',
            },
          },
          '&.Mui-focusVisible': {
            backgroundColor: 'customColors.shellRaised',
            outline: (theme) =>
              `2px solid ${theme.palette.customColors.shellText}`,
            outlineOffset: -2,
          },
        }}
      >
        <ListItemIcon
          sx={getNavItemIconSx({
            parent,
            navCollapsed,
            navHover: navHoverEnabled,
            hasCustomIcon: Boolean(item.icon),
          })}
        >
          <NavItemIcon icon={icon} />
        </ListItemIcon>

        <Box
          sx={getNavItemTextSx({
            navCollapsed,
            navHover: navHoverEnabled,
          })}
        >
          <Typography
            {...getNavItemTitleProps({
              navCollapsed,
              navHover: navHoverEnabled,
            })}
          >
            {item.title}
          </Typography>

          <Icon
            icon={
              direction === 'ltr' ? 'mdi:chevron-right' : 'mdi:chevron-left'
            }
            style={{
              transition: 'transform .25s ease-in-out',
              transform: shouldShowChildren
                ? direction === 'ltr'
                  ? 'rotate(90deg)'
                  : 'rotate(-90deg)'
                : 'none',
            }}
          />
        </Box>
      </ListItemButton>

      <Collapse
        component='ul'
        in={shouldShowChildren && !isCollapsedRail}
        sx={{
          pl: 0,
          width: '100%',
        }}
      >
        <VerticalNavItems
          {...rest}
          hidden={hidden}
          navHover={navHover}
          settings={settings}
          groupActive={groupActive}
          collapsedNavWidth={collapsedNavWidth}
          navigationBorderWidth={navigationBorderWidth}
          setGroupActive={setGroupActive}
          parent={true}
          verticalNavItems={item.children}
        />
      </Collapse>
    </ListItem>
  );
};

export default VerticalNavGroup;
