'use client';

import {createContext, useCallback, useContext, useMemo, useState} from 'react';

import {NodeChildrenProps} from '@/shared/interfaces/common';
import {
  TopBarContainers,
  TopBarContextValue,
  TopBarSide,
} from '@/shared/interfaces/layout';

const TopBarContext = createContext<TopBarContextValue | null>(null);

const TopBarProvider = ({children}: NodeChildrenProps) => {
  const [containers, setContainers] = useState<TopBarContainers>({
    left: null,
    right: null,
  });

  const setContainer = useCallback(
    ({side, element}: {side: TopBarSide; element: HTMLElement | null}) => {
      setContainers((current) =>
        current[side] === element ? current : {...current, [side]: element}
      );
    },
    []
  );

  const value = useMemo(
    () => ({containers, setContainer}),
    [containers, setContainer]
  );

  return (
    <TopBarContext.Provider value={value}>{children}</TopBarContext.Provider>
  );
};

export const useTopBar = () => {
  const context = useContext(TopBarContext);

  if (!context) {
    throw new Error('useTopBar must be used inside TopBarProvider');
  }

  return context;
};

export default TopBarProvider;
