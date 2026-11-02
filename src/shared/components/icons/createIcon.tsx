// shared/components/icons/createIcon.tsx
import {DEFAULT_ICON_SIZE} from '@/shared/constants/common';
import {IconProps} from '@/shared/interfaces/common';
import {cn} from '@/shared/utils/tailwindUtils';

export function createIcon(
  SvgComponent: React.FC<React.SVGProps<SVGSVGElement>>
) {
  return function Icon({
    size = DEFAULT_ICON_SIZE,
    className,

    // Dropped so it never reaches the <svg> when the icon is used as an MUI slot.
    ownerState: _ownerState,
    ...rest
  }: IconProps) {
    return (
      <SvgComponent
        width={size}
        height={size}
        className={cn('fill-black', className)}
        {...rest}
      />
    );
  };
}
