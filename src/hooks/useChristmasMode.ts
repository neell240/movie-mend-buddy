import { useState, useEffect, useCallback, createContext, useContext, createElement } from 'react';
import type { ReactNode } from 'react';

interface ChristmasSettings {
  enabled: boolean;
  snowfall: boolean;
  festiveColors: boolean;
}

const CHRISTMAS_SETTINGS_KEY = 'moviemend_christmas';

const isChristmasSeason = (): boolean => {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  return month === 11 || (month === 0 && day === 1);
};

const shouldAutoEnable = (): boolean => {
  const now = new Date();
  return now.getMonth() === 11;
};

const defaultSettings: ChristmasSettings = {
  enabled: shouldAutoEnable(),
  snowfall: true,
  festiveColors: true,
};

export const useChristmasMode = () => {
  const [settings, setSettings] = useState<ChristmasSettings>(() => {
    const stored = localStorage.getItem(CHRISTMAS_SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (!isChristmasSeason()) {
        return { ...parsed, enabled: false };
      }
      return parsed;
    }
    return defaultSettings;
  });

  const updateSettings = useCallback((updates: Partial<ChristmasSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      localStorage.setItem(CHRISTMAS_SETTINGS_KEY, JSON.stringify(newSettings));
      return newSettings;
    });
  }, []);

  useEffect(() => {
    if (!isChristmasSeason() && settings.enabled) {
      updateSettings({ enabled: false });
    }
  }, [settings.enabled, updateSettings]);

  const toggleChristmasMode = useCallback((enabled: boolean) => {
    updateSettings({ enabled });
  }, [updateSettings]);

  const toggleSnowfall = useCallback((snowfall: boolean) => {
    updateSettings({ snowfall });
  }, [updateSettings]);

  const toggleFestiveColors = useCallback((festiveColors: boolean) => {
    updateSettings({ festiveColors });
  }, [updateSettings]);

  const isActive = settings.enabled && isChristmasSeason();
  const showSnowfall = isActive && settings.snowfall;
  const showFestiveColors = isActive && settings.festiveColors;

  return {
    settings,
    isActive,
    showSnowfall,
    showFestiveColors,
    isChristmasSeason: isChristmasSeason(),
    toggleChristmasMode,
    toggleSnowfall,
    toggleFestiveColors,
    updateSettings,
  };
};

type ChristmasContextType = ReturnType<typeof useChristmasMode>;

const ChristmasContext = createContext<ChristmasContextType | null>(null);

export function ChristmasProvider({ children }: { children: ReactNode }) {
  const christmas = useChristmasMode();
  return createElement(ChristmasContext.Provider, { value: christmas }, children);
}

export const useChristmas = () => {
  const context = useContext(ChristmasContext);
  if (!context) {
    throw new Error('useChristmas must be used within a ChristmasProvider');
  }
  return context;
};
