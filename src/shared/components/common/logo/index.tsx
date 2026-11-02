import Image from 'next/image';

import {LogoProps} from '@/shared/interfaces/common';
import {cn} from '@/shared/utils/tailwindUtils';

// The brand image has white lettering, so it is only for dark surfaces. Light
// surfaces keep the icon and text version.
export default function Logo({className, onDark = false}: LogoProps) {
  if (onDark) {
    return (
      <Image
        src='/images/logo-light.png'
        alt='PreventaTri'
        width={3840}
        height={1432}
        priority
        className={cn('-my-3 h-auto w-44', className)}
      />
    );
  }

  return (
    <Image
      src='/images/logo-dark.png'
      alt='PreventaTri'
      width={3840}
      height={1432}
      priority
      className={cn('-my-3 h-auto w-44', className)}
    />
  );
}
