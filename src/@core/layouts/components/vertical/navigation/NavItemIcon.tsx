import Icon from '@/@core/components/icon';
import {NavItemIconProps} from '@/@core/layouts/types';

export default function NavItemIcon({icon}: NavItemIconProps) {
  if (!icon || typeof icon === 'string') {
    return <Icon icon={icon || 'mdi:circle-outline'} />;
  }

  const LocalIcon = icon;

  return <LocalIcon />;
}
