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
  languages: [],
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
    // Global platforms
    { id: 8, name: 'Netflix', regions: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'JP', 'IN', 'BR', 'MX', 'KR', 'NL', 'SE', 'NO', 'DK', 'FI', 'PL', 'TR', 'AR', 'CL', 'CO', 'PE', 'SG', 'TH', 'MY', 'PH', 'ID', 'VN', 'ZA', 'NG', 'EG', 'SA', 'AE', 'IL', 'GR', 'PT', 'CZ', 'HU', 'RO'] },
    { id: 9, name: 'Amazon Prime Video', regions: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'JP', 'IN', 'BR', 'MX', 'NL', 'SE', 'NO', 'DK', 'FI', 'PL', 'TR', 'AR', 'SG', 'AE', 'SA'] },
    { id: 337, name: 'Disney+', regions: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'JP', 'IN', 'BR', 'MX', 'KR', 'NL', 'SE', 'NO', 'DK', 'FI', 'PL', 'TR', 'AR', 'CL', 'SG'] },
    { id: 350, name: 'Apple TV+', regions: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'JP', 'IN', 'BR', 'MX', 'KR', 'NL', 'SE', 'NO', 'DK', 'FI', 'PL', 'TR', 'AR', 'SG', 'AE'] },
    
    // US platforms
    { id: 384, name: 'HBO Max', regions: ['US', 'ES', 'MX', 'BR', 'AR'] },
    { id: 15, name: 'Hulu', regions: ['US', 'JP'] },
    { id: 531, name: 'Paramount+', regions: ['US', 'UK', 'CA', 'AU', 'IT', 'DE', 'FR', 'KR'] },
    { id: 43, name: 'Starz', regions: ['US'] },
    { id: 389, name: 'Peacock', regions: ['US'] },
    
    // Indian platforms
    { id: 122, name: 'Disney+ Hotstar', regions: ['IN'] },
    { id: 220, name: 'JioCinema', regions: ['IN'] },
    { id: 232, name: 'Zee5', regions: ['IN'] },
    { id: 237, name: 'SonyLIV', regions: ['IN'] },
    
    // UK platforms
    { id: 39, name: 'NOW', regions: ['UK', 'IT', 'DE'] },
    { id: 38, name: 'BBC iPlayer', regions: ['UK'] },
    { id: 41, name: 'ITV', regions: ['UK'] },
    
    // European platforms
    { id: 381, name: 'Canal+', regions: ['FR', 'PL'] },
    { id: 307, name: 'Movistar Plus+', regions: ['ES'] },
    { id: 109, name: 'MyCanal', regions: ['FR'] },
    { id: 305, name: 'RTL+', regions: ['DE'] },
    { id: 372, name: 'Joyn', regions: ['DE'] },
    { id: 40, name: 'Sky Go', regions: ['UK', 'DE', 'IT'] },
    { id: 76, name: 'Videoland', regions: ['NL'] },
    { id: 553, name: 'Viaplay', regions: ['SE', 'NO', 'DK', 'FI', 'NL', 'PL'] },
    
    // Japanese platforms
    { id: 84, name: 'U-NEXT', regions: ['JP'] },
    { id: 444, name: 'dTV', regions: ['JP'] },
    { id: 185, name: 'Abema TV', regions: ['JP'] },
    
    // Korean platforms
    { id: 356, name: 'Wavve', regions: ['KR'] },
    { id: 97, name: 'Watcha', regions: ['KR'] },
    { id: 624, name: 'TVING', regions: ['KR'] },
    
    // Chinese platforms
    { id: 7, name: 'iQIYI', regions: ['CN', 'TH', 'MY', 'SG'] },
    { id: 554, name: 'Tencent Video', regions: ['CN'] },
    { id: 138, name: 'Youku', regions: ['CN'] },
    
    // Latin American platforms
    { id: 619, name: 'Globoplay', regions: ['BR'] },
    { id: 167, name: 'Claro Video', regions: ['MX', 'BR', 'AR', 'CL', 'CO', 'PE'] },
    { id: 339, name: 'Blim TV', regions: ['MX'] },
    { id: 444, name: 'HBO Max', regions: ['BR', 'AR', 'MX', 'CL', 'CO'] },
    
    // Australian platforms
    { id: 21, name: 'Stan', regions: ['AU'] },
    { id: 385, name: 'Binge', regions: ['AU'] },
    { id: 134, name: 'Foxtel Now', regions: ['AU'] },
    
    // Canadian platforms
    { id: 230, name: 'Crave', regions: ['CA'] },
    
    // Asian platforms
    { id: 158, name: 'Viu', regions: ['HK', 'SG', 'MY', 'TH', 'ID', 'PH', 'IN'] },
    { id: 223, name: 'Rakuten Viki', regions: ['US', 'UK', 'CA', 'AU', 'SG', 'MY', 'PH'] },
    { id: 315, name: 'WeTV', regions: ['CN', 'TH', 'ID', 'PH'] },
    
    // Middle Eastern & African platforms
    { id: 551, name: 'Shahid', regions: ['SA', 'AE', 'EG'] },
    { id: 207, name: 'OSN+', regions: ['AE', 'SA'] },
    { id: 1899, name: 'Showmax', regions: ['ZA', 'NG'] },
  ]
};

export const REGIONS = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
  { code: 'CN', name: 'China' },
  { code: 'TH', name: 'Thailand' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'PH', name: 'Philippines' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'TR', name: 'Turkey' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'EG', name: 'Egypt' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'IL', name: 'Israel' },
  { code: 'GR', name: 'Greece' },
  { code: 'PT', name: 'Portugal' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'RO', name: 'Romania' },
  { code: 'HK', name: 'Hong Kong' },
];

export const getPlatformsForRegion = (region: string) => {
  return STREAMING_PLATFORMS.all.filter(platform => 
    platform.regions.includes(region)
  );
};
