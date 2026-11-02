'use client';

import {createPortal} from 'react-dom';

import {TopBarSlotProps} from '@/shared/interfaces/layout';
import {useTopBar} from '@/shared/providers/TopBarProvider';

const TopBarSlot = ({side = 'left', children}: TopBarSlotProps) => {
  const {containers} = useTopBar();
  const container = containers[side];

  if (!container) return null;

  return createPortal(children, container);
};

export default TopBarSlot;
