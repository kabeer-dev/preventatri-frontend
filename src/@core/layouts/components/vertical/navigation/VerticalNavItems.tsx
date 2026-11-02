'use client';

import {
  NavLink,
  NavGroup,
  NavSectionTitle,
  VerticalNavItemsType,
} from '@/@core/layouts/types';
import {Settings} from '@/shared/providers/SettingsProvider';

import VerticalNavGroup from './VerticalNavGroup';
import VerticalNavLink from './VerticalNavLink';
import VerticalNavSectionTitle from './VerticalNavSectionTitle';

interface Props {
  hidden: boolean;
  parent?: boolean;
  navHover: boolean;
  settings: Settings;
  navVisible?: boolean;
  groupActive: string[];
  collapsedNavWidth: number;
  navigationBorderWidth: number;
  verticalNavItems?: VerticalNavItemsType;
  toggleNavVisibility: () => void;
  setGroupActive: (value: string[] | ((prev: string[]) => string[])) => void;
}

const resolveNavItemComponent = (
  item: NavLink | NavGroup | NavSectionTitle
): 'VerticalNavLink' | 'VerticalNavSectionTitle' | 'VerticalNavGroup' => {
  if ((item as NavSectionTitle).sectionTitle) return 'VerticalNavSectionTitle';
  if ((item as NavGroup).children) return 'VerticalNavGroup';

  return 'VerticalNavLink';
};

const VerticalNavItems = (props: Props) => {
  const {verticalNavItems, ...rest} = props;

  const RenderMenuItems = verticalNavItems?.map(
    (item: NavLink | NavGroup | NavSectionTitle, index: number) => {
      const TagName = resolveNavItemComponent(item);

      if (TagName === 'VerticalNavSectionTitle') {
        return (
          <VerticalNavSectionTitle
            key={index}
            {...rest}
            item={item as NavSectionTitle}
          />
        );
      }

      if (TagName === 'VerticalNavLink') {
        return <VerticalNavLink key={index} {...rest} item={item as NavLink} />;
      }

      return <VerticalNavGroup key={index} {...rest} item={item as NavGroup} />;
    }
  );

  return <>{RenderMenuItems}</>;
};

export default VerticalNavItems;
