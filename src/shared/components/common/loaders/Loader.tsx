'use client';

import LogoMark from '@/shared/assets/icons/logoMark.svg';
import useTranslation from '@/shared/hooks/useTranslation';
import {LoaderProps} from '@/shared/interfaces/common';
import {cn} from '@/shared/utils/tailwindUtils';

const Loader = ({size = 48, className}: LoaderProps) => {
  const {t} = useTranslation();

  return (
    <span
      role='status'
      aria-label={t('common.loading')}
      className={cn('text-brand relative inline-flex shrink-0', className)}
      style={{width: size, height: size}}
    >
      <LogoMark className='size-full opacity-20' />
      <LogoMark className='heartbeat-loader absolute inset-0 size-full' />
    </span>
  );
};

export default Loader;
