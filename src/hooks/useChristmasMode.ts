import { useState, useEffect, useCallback, createContext, useContext, createElement } from 'react';
import type { ReactNode } from 'react';
import { safeJsonParse } from '@/lib/safeJsonParse';

type SeasonalMode = 'normal' | 'christmas' | 'newyear' | 'valentine' | 'ramnavami';

interface SeasonalSettings {
  snowfall: boolean;
  hearts: boolean;
}

const SEASONAL_SETTINGS_KEY = 'moviemend_seasonal';

// Get current seasonal mode based on date (automatic, no user control)
const getSeasonalMode = (): SeasonalMode => {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed (11 = December, 0 = January, 1 = February)
  const day = now.getDate();
  
  // New Year mode: Jan 1 - Jan 7
  if (month === 0 && day >= 1 && day <= 7) {
    return 'newyear';
  }
  
  // Valentine's Day mode: Feb 7 - Feb 14 (Rose Day through Valentine's Day)
  if (month === 1 && day >= 7 && day <= 14) {
    return 'valentine';
  }

  // Ram Navami mode: March 25 - March 28
  if (month === 2 && day >= 25 && day <= 28) {
    return 'ramnavami';
  }
  
  // Winter theme (wine-red/gold colors): January and February (excluding Valentine's week)
  if (month === 0 || (month === 1 && day < 7)) {
    return 'christmas';
  }
  
  return 'normal';
};

// Check days until Christmas (Dec 25)
const getDaysUntilChristmas = (): number => {
  const now = new Date();
  const year = now.getMonth() === 11 ? now.getFullYear() : now.getFullYear();
  const christmas = new Date(year, 11, 25); // Dec 25
  const diff = christmas.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// Check days until Valentine's Day (Feb 14)
const getDaysUntilValentine = (): number => {
  const now = new Date();
  const year = now.getMonth() <= 1 ? now.getFullYear() : now.getFullYear() + 1;
  const valentine = new Date(year, 1, 14); // Feb 14
  const diff = valentine.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// Check if it's Christmas Day
const isChristmasDay = (): boolean => {
  const now = new Date();
  return now.getMonth() === 11 && now.getDate() === 25;
};

// Check if it's Valentine's Day
const isValentineDay = (): boolean => {
  const now = new Date();
  return now.getMonth() === 1 && now.getDate() === 14;
};

const defaultSettings: SeasonalSettings = {
  // Disable by default (prevents extra animation load on fragile devices)
  snowfall: false,
  hearts: true,
};

export const useSeasonalMode = () => {
  const [settings, setSettings] = useState<SeasonalSettings>(() => {
    const stored = localStorage.getItem(SEASONAL_SETTINGS_KEY);
    return safeJsonParse(stored, defaultSettings, {
      storageKey: SEASONAL_SETTINGS_KEY,
      clearOnError: true,
    });
  });

  const [mode, setMode] = useState<SeasonalMode>(getSeasonalMode);

  // Check mode on mount and update periodically
  useEffect(() => {
    const checkMode = () => {
      const newMode = getSeasonalMode();
      if (newMode !== mode) {
        setMode(newMode);
      }
    };

    // Check every minute for date changes
    const interval = setInterval(checkMode, 60000);
    return () => clearInterval(interval);
  }, [mode]);

  const updateSettings = useCallback((updates: Partial<SeasonalSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      localStorage.setItem(SEASONAL_SETTINGS_KEY, JSON.stringify(newSettings));
      return newSettings;
    });
  }, []);

  const toggleSnowfall = useCallback((snowfall: boolean) => {
    updateSettings({ snowfall });
  }, [updateSettings]);

  const toggleHearts = useCallback((hearts: boolean) => {
    updateSettings({ hearts });
  }, [updateSettings]);

  // Computed values
  const isChristmas = mode === 'christmas';
  const isNewYear = mode === 'newyear';
  const isValentine = mode === 'valentine';
  const isRamNavami = mode === 'ramnavami';
  const showSnowfall = isChristmas && settings.snowfall;
  const showHearts = isValentine && settings.hearts;
  const daysUntilChristmas = getDaysUntilChristmas();
  const daysUntilValentine = getDaysUntilValentine();

  return {
    mode,
    settings,
    isChristmas,
    isNewYear,
    isValentine,
    isRamNavami,
    isChristmasDay: isChristmasDay(),
    isValentineDay: isValentineDay(),
    showSnowfall,
    showHearts,
    daysUntilChristmas,
    daysUntilValentine,
    toggleSnowfall,
    toggleHearts,
  };
};

type SeasonalContextType = ReturnType<typeof useSeasonalMode>;

const SeasonalContext = createContext<SeasonalContextType | null>(null);

export function SeasonalProvider({ children }: { children: ReactNode }) {
  const seasonal = useSeasonalMode();
  return createElement(SeasonalContext.Provider, { value: seasonal }, children);
}

export const useSeasonal = () => {
  const context = useContext(SeasonalContext);
  if (!context) {
    throw new Error('useSeasonal must be used within a SeasonalProvider');
  }
  return context;
};

// Legacy exports for compatibility
export const useChristmas = useSeasonal;
export const ChristmasProvider = SeasonalProvider;
export const useChristmasMode = useSeasonalMode;
