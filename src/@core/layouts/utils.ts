import {NavGroup, NavLink} from '@/@core/layouts/types';
import {layout} from '@/@core/theme/spacing';
import themeConfig from '@/configs/themeConfig';
import {isPathActive} from '@/shared/utils/routeUtils';

const getNavIconSize = ({
  parent,
  hasCustomIcon,
}: {
  parent?: boolean;
  hasCustomIcon: boolean;
}) => {
  if (!parent) {
    return layout.navIconSize;
  }

  return hasCustomIcon ? layout.navSubIconSize : layout.navBulletSize;
};

export const isNavLinkActive = ({
  item,
  currentPath,
}: {
  item: NavLink;
  currentPath: string;
}) =>
  [item.path, ...(item.activePaths ?? [])].some((targetPath) =>
    isPathActive({currentPath, targetPath})
  );

export const hasActiveNavChild = ({
  items,
  currentPath,
}: {
  items: (NavLink | NavGroup)[];
  currentPath: string;
}): boolean => {
  return items.some((child) => {
    if ('children' in child) {
      return hasActiveNavChild({items: child.children, currentPath});
    }

    return isNavLinkActive({item: child, currentPath});
  });
};

export const getNavItemPadding = ({
  navCollapsed,
  navHover,
}: {
  navCollapsed: boolean;
  navHover: boolean;
}) => {
  if (navCollapsed && !navHover) {
    return {pl: 0, pr: 0, justifyContent: 'center'};
  }

  return {pl: 3, pr: 3, justifyContent: 'flex-start'};
};

export const getNavItemIconSx = ({
  parent,
  navCollapsed,
  navHover,
  hasCustomIcon = false,
}: {
  parent?: boolean;
  navCollapsed: boolean;
  navHover: boolean;
  hasCustomIcon?: boolean;
}) => {
  const size = getNavIconSize({parent, hasCustomIcon});

  return {
    minWidth: size,
    transition: 'margin .25s ease-in-out',
    color: parent ? 'customColors.shellMuted' : 'customColors.shellText',
    ...(navCollapsed && !navHover ? {mr: 0} : {mr: 4}),
    ...(parent ? {ml: 2, mr: 4} : {}),
    '& svg': {width: size, height: size},
  };
};

export const getNavItemTextSx = ({
  navCollapsed,
  navHover,
  isIndented = false,
}: {
  navCollapsed: boolean;
  navHover: boolean;
  isIndented?: boolean;
}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && {overflow: 'hidden'}),
  ...(isIndented ? {ml: 8} : {}),
  ...(navCollapsed && !navHover
    ? {opacity: 0, width: 0, overflow: 'hidden'}
    : {opacity: 1, width: '100%'}),
});

export const getNavItemTitleProps = ({
  navCollapsed,
  navHover,
}: {
  navCollapsed: boolean;
  navHover: boolean;
}) =>
  themeConfig.menuTextTruncate ||
  (!themeConfig.menuTextTruncate && navCollapsed && !navHover)
    ? {noWrap: true}
    : {};
