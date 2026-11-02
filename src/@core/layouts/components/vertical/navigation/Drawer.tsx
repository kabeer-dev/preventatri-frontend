'use client';

import {styled, Theme} from '@mui/material/styles';
import MuiSwipeableDrawer, {
  SwipeableDrawerProps,
} from '@mui/material/SwipeableDrawer';

import {DrawerProps} from '@/@core/layouts/types';

const SwipeableDrawer = styled(MuiSwipeableDrawer)<SwipeableDrawerProps>({
  overflowX: 'hidden',
  transition: 'width .25s ease-in-out',
  '& ul': {
    listStyle: 'none',
  },
  '& .MuiListItem-gutters': {
    paddingLeft: 4,
    paddingRight: 4,
  },
  '& .MuiDrawer-paper': {
    left: 'unset',
    right: 'unset',
    overflowX: 'hidden',
    transition: 'width .25s ease-in-out, box-shadow .25s ease-in-out',
  },
});

const Drawer = ({
  hidden,
  children,
  navHover,
  navWidth,
  settings,
  navVisible,
  setNavHover,
  navMenuProps,
  setNavVisible,
  collapsedNavWidth,
  navigationBorderWidth,
}: DrawerProps) => {
  const {navCollapsed} = settings;

  let flag = true;

  // Drawer Props for Mobile & Tablet screens
  const MobileDrawerProps = {
    open: navVisible,
    onOpen: () => setNavVisible(true),
    onClose: () => setNavVisible(false),
    ModalProps: {
      keepMounted: true, // Better open performance on mobile.
    },
  };

  // Drawer Props for Laptop & Desktop screens
  const DesktopDrawerProps = {
    open: true,
    onOpen: () => null,
    onClose: () => null,
    onMouseEnter: () => {
      // Declared flag to resolve first time flicker issue while trying to collapse the menu
      if (flag || navCollapsed) {
        setNavHover(true);
        flag = false;
      }
    },
    onMouseLeave: () => {
      if (navCollapsed) {
        setNavHover(false);
      }
    },
  };

  let userNavMenuStyle = {};
  let userNavMenuPaperStyle = {};
  if (navMenuProps && (navMenuProps as {sx?: object}).sx) {
    userNavMenuStyle = (navMenuProps as {sx?: object}).sx || {};
  }

  // Reads slotProps.paper rather than PaperProps: the component's own styling
  // moved under slotProps for v9, and leaving the consumer escape hatch on the
  // removed key would make it a dead string lookup that still type-checks.
  if (
    navMenuProps &&
    (navMenuProps as {slotProps?: {paper?: {sx?: object}}}).slotProps?.paper?.sx
  ) {
    userNavMenuPaperStyle =
      (navMenuProps as {slotProps?: {paper?: {sx?: object}}}).slotProps?.paper
        ?.sx || {};
  }

  return (
    <SwipeableDrawer
      className='layout-vertical-nav'
      variant={hidden ? 'temporary' : 'permanent'}
      {...(hidden ? {...MobileDrawerProps} : {...DesktopDrawerProps})}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: 'customColors.shell',
            color: 'customColors.shellText',
            width: navCollapsed && !navHover ? collapsedNavWidth : navWidth,
            ...(!hidden && navCollapsed && navHover ? {boxShadow: 10} : {}),
            borderRight: (theme: Theme) =>
              navigationBorderWidth === 0
                ? 0
                : `${navigationBorderWidth}px solid ${theme.palette.customColors.shellRaised}`,
            ...userNavMenuPaperStyle,
          },
        },
      }}
      sx={{
        width: navCollapsed ? collapsedNavWidth : navWidth,
        ...userNavMenuStyle,
      }}
    >
      {children}
    </SwipeableDrawer>
  );
};

export default Drawer;
