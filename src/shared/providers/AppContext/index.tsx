'use client';

import {createContext, useContext, useState, useMemo} from 'react';

import {AppContextType, NodeChildrenProps} from '@/shared/interfaces/common';

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Component
export default function AppProvider({children}: NodeChildrenProps) {
  const [user, setUser] = useState<any>(null);

  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<boolean>(false);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      isUserAuthenticated,
      setIsUserAuthenticated,
    }),
    [user, isUserAuthenticated]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Custom Hook to use Context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}
