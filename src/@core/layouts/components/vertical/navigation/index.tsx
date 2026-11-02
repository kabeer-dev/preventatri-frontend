'use client';

import {useEffect, useRef, useState} from 'react';

import Box, {BoxProps} from '@mui/material/Box';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';

import {NavigationProps} from '@/@core/layouts/types';
import {layout} from '@/@core/theme/spacing';
import {hexToRGBA} from '@/@core/utils/hex-to-rgba';
import themeConfig from '@/configs/themeConfig';

import Drawer from './Drawer';
import VerticalNavHeader from './VerticalNavHeader';
import VerticalNavItems from './VerticalNavItems';
import VerticalNavProfile from './VerticalNavProfile';

const StyledBoxForShadow = styled(Box)<BoxProps>(({theme}) => ({
  top: layout.sidebarHeaderHeight - 4,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  height: theme.mixins.toolbar.minHeight,
  transition: 'opacity .15s ease-in-out',
  background: `linear-gradient(${theme.palette.customColors.shell} ${
    theme.direction === 'rtl' ? '95%' : '5%'
  },${hexToRGBA({hexCode: theme.palette.customColors.shell, opacity: 0.85})} 30%,${hexToRGBA(
    {
      hexCode: theme.palette.customColors.shell,
      opacity: 0.5,
    }
  )} 65%,${hexToRGBA({
    hexCode: theme.palette.customColors.shell,
    opacity: 0.3,
  })} 75%,transparent)`,
  '&.scrolled': {
    opacity: 1,
  },
}));

const Navigation = (props: NavigationProps) => {
  const {
    hidden,
    settings,
    afterNavMenuContent,
    beforeNavMenuContent,
    navMenuContent: userNavMenuContent,
    navListSx,
    saveSettings,
  } = props;

  // States
  const [navHover, setNavHover] = useState<boolean>(false);
  const [groupActive, setGroupActive] = useState<string[]>([]);

  // Ref
  const shadowRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
    },
    []
  );

  const revealScrollbar = () => {
    const element = scrollRef.current;

    if (!element) return;

    element.classList.add('scrolling');

    if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);

    scrollIdleTimer.current = setTimeout(
      () => element.classList.remove('scrolling'),
      800
    );
  };

  // Var
  const {
    afterVerticalNavMenuContentPosition,
    beforeVerticalNavMenuContentPosition,
  } = themeConfig as {
    afterVerticalNavMenuContentPosition?: string;
    beforeVerticalNavMenuContentPosition?: string;
  };

  const navProps = hidden
    ? {...props, settings: {...settings, navCollapsed: false}}
    : props;

  const navMenuContentProps = {
    ...navProps,
    navHover,
    groupActive,
    setGroupActive,
  };

  // Scroll Menu
  const scrollMenu = (container: HTMLElement) => {
    revealScrollbar();

    if (
      beforeVerticalNavMenuContentPosition === 'static' ||
      !beforeNavMenuContent
    ) {
      if (shadowRef.current && container.scrollTop > 0) {
        if (!shadowRef.current.classList.contains('scrolled')) {
          shadowRef.current.classList.add('scrolled');
        }
      } else if (shadowRef.current) {
        shadowRef.current.classList.remove('scrolled');
      }
    }
  };

  return (
    <Drawer {...navProps} navHover={navHover} setNavHover={setNavHover}>
      <VerticalNavHeader
        {...navProps}
        navHover={navHover}
        saveSettings={saveSettings}
      />
      {beforeNavMenuContent && beforeVerticalNavMenuContentPosition === 'fixed'
        ? beforeNavMenuContent(navMenuContentProps)
        : null}
      {(beforeVerticalNavMenuContentPosition === 'static' ||
        !beforeNavMenuContent) && <StyledBoxForShadow ref={shadowRef} />}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          flexGrow: 1,
        }}
      >
        <Box
          ref={scrollRef}
          onScroll={(e) => scrollMenu(e.currentTarget)}
          sx={{
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'thin',
            scrollbarColor: 'transparent transparent',
            '&.scrolling': {
              scrollbarColor: (theme) =>
                `${theme.palette.customColors.shellRaised} transparent`,
            },
            '&::-webkit-scrollbar': {
              width: 6,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'transparent',
              borderRadius: '3px',
              transition: 'background-color .3s ease-in-out',
            },
            '&.scrolling::-webkit-scrollbar-thumb': {
              backgroundColor: 'customColors.shellRaised',
            },
            '&.scrolling::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'customColors.shellMuted',
            },
          }}
        >
          {beforeNavMenuContent &&
          beforeVerticalNavMenuContentPosition === 'static'
            ? beforeNavMenuContent(navMenuContentProps)
            : null}
          {userNavMenuContent ? (
            userNavMenuContent(navMenuContentProps)
          ) : (
            <List
              className='nav-items'
              sx={{pt: 0, pb: 4, '& > :first-of-type': {mt: '0'}, ...navListSx}}
            >
              <VerticalNavItems
                navHover={navHover}
                groupActive={groupActive}
                setGroupActive={setGroupActive}
                {...navProps}
              />
            </List>
          )}
          {afterNavMenuContent &&
          afterVerticalNavMenuContentPosition === 'static'
            ? afterNavMenuContent(navMenuContentProps)
            : null}
        </Box>
      </Box>
      {afterNavMenuContent && afterVerticalNavMenuContentPosition === 'fixed'
        ? afterNavMenuContent(navMenuContentProps)
        : null}
      <VerticalNavProfile navHover={navHover} settings={props.settings} />
    </Drawer>
  );
};

export default Navigation;
