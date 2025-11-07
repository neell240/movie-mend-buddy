import { useState, useEffect } from 'react';

export interface UserPreferences {
  region: string;
  languages: string[];
  genres: string[];
  platforms: string[];
}

const PREFERENCES_KEY = 'moviemend_preferences';

const defaultPreferences: UserPreferences = {
  region: 'US',
  languages: ['English'],
  genres: [],
  platforms: [],
};

export const usePreferences = () => {
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    return stored ? JSON.parse(stored) : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferencesState(prev => ({ ...prev, ...updates }));
  };

  return { preferences, updatePreferences };
};

// TMDB watch provider IDs by region and platform
export const STREAMING_PLATFORMS: Record<string, { id: number; name: string; regions: string[] }[]> = {
  all: [
    { id: 8, name: 'Netflix', regions: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'JP', 'IN'] },
    { id: 9, name: 'Amazon Prime Video', regions: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'JP', 'IN'] },
    { id: 337, name: 'Disney+', regions: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'JP', 'IN'] },
    { id: 384, name: 'HBO Max', regions: ['US'] },
    { id: 15, name: 'Hulu', regions: ['US', 'JP'] },
    { id: 350, name: 'Apple TV+', regions: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'JP', 'IN'] },
    { id: 531, name: 'Paramount+', regions: ['US', 'UK', 'CA', 'AU'] },
    { id: 43, name: 'Starz', regions: ['US'] },
    { id: 389, name: 'Peacock', regions: ['US'] },
  ]
};

export const REGIONS = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' },
];

export const getPlatformsForRegion = (region: string) => {
  return STREAMING_PLATFORMS.all.filter(platform => 
    platform.regions.includes(region)
  );
};
