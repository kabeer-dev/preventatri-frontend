import Box from '@mui/material/Box';

import Icon from '@/@core/components/icon';
import {AuthIconBadgeProps} from '@/shared/interfaces/auth';
import {cn} from '@/shared/utils/tailwindUtils';

const TONE_CLASSES = {
  brand: 'bg-brand-tint text-brand',
  success: 'bg-severity-stable-bg text-severity-stable-fg',
  critical: 'bg-severity-critical-bg text-severity-critical-fg',
} as const;

const SIZE_CLASSES = {
  md: 'size-10',
  lg: 'size-11',
} as const;

const ICON_FONT_SIZES = {
  md: 20,
  lg: 21,
} as const;

export default function AuthIconBadge({
  icon,
  tone = 'brand',
  size = 'md',
}: AuthIconBadgeProps) {
  return (
    <Box
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center rounded-lg',
        TONE_CLASSES[tone],
        SIZE_CLASSES[size]
      )}
    >
      <Icon icon={icon} fontSize={ICON_FONT_SIZES[size]} />
    </Box>
  );
}
