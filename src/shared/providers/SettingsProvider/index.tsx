'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import themeConfig from '@/configs/themeConfig';
import {initializeRUM} from '@/instrumentation';
import {NodeChildrenProps} from '@/shared/interfaces/common';

export interface Settings {
  mode: 'light' | 'dark';
  skin: 'default' | 'bordered';
  appBar: 'fixed' | 'static' | 'hidden';
  navCollapsed: boolean;
  navHidden: boolean;
  direction: 'ltr' | 'rtl';
}

interface SettingsContextType {
  settings: Settings;
  saveSettings: (updatedSettings: Partial<Settings>) => void;
}

initializeRUM();

const initialSettings: Settings = {
  mode: themeConfig.mode as 'light' | 'dark',
  skin: themeConfig.skin,
  appBar: themeConfig.appBar,
  navCollapsed: themeConfig.navCollapsed,
  navHidden: themeConfig.navHidden,
  direction: themeConfig.direction,
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export default function SettingsProvider({children}: NodeChildrenProps) {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  useEffect(() => {
    const restoreSettings = () => {
      try {
        const storedSettings = window.localStorage.getItem('settings');

        if (storedSettings) {
          setSettings({...initialSettings, ...JSON.parse(storedSettings)});
        }
      } catch (err) {
        console.error('Failed to load settings from local storage:', err);
      }
    };
    restoreSettings();
  }, []);

  const saveSettings = useCallback((updatedSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const newSettings = {...prev, ...updatedSettings};
      try {
        window.localStorage.setItem('settings', JSON.stringify(newSettings));
      } catch (err) {
        console.error('Failed to save settings to local storage:', err);
      }

      return newSettings;
    });
  }, []);

  const contextValue = useMemo(
    () => ({settings, saveSettings}),
    [settings, saveSettings]
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
}
