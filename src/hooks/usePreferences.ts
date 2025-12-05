import { useState } from 'react';

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

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferencesState(prev => {
      const newPreferences = { ...prev, ...updates };
      // Save synchronously to ensure it persists before navigation
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPreferences));
      return newPreferences;
    });
  };

  return { preferences, updatePreferences };
};

// TMDB watch provider IDs by region and platform
export const STREAMING_PLATFORMS: Record<string, { id: number; name: string; regions: string[] }[]> = {
  all: [
    // Global platforms (available in most regions)
    { id: 8, name: 'Netflix', regions: ['US', 'UK', 'CA', 'AU', 'NZ', 'DE', 'FR', 'ES', 'IT', 'JP', 'IN', 'BR', 'MX', 'KR', 'NL', 'SE', 'NO', 'DK', 'FI', 'PL', 'TR', 'AR', 'CL', 'CO', 'PE', 'SG', 'TH', 'MY', 'PH', 'ID', 'VN', 'ZA', 'NG', 'EG', 'SA', 'AE', 'IL', 'GR', 'PT', 'CZ', 'HU', 'RO', 'BG', 'HR', 'RS', 'SI', 'SK', 'LT', 'LV', 'EE', 'IS', 'IE', 'AT', 'CH', 'BE', 'LU', 'UA', 'KE', 'GH', 'TZ', 'UG', 'MA', 'DZ', 'TN'] },
    { id: 9, name: 'Amazon Prime Video', regions: ['US', 'UK', 'CA', 'AU', 'NZ', 'DE', 'FR', 'ES', 'IT', 'JP', 'IN', 'BR', 'MX', 'NL', 'SE', 'NO', 'DK', 'FI', 'PL', 'TR', 'AR', 'SG', 'AE', 'SA', 'AT', 'CH', 'BE', 'IE', 'PT', 'GR'] },
    { id: 337, name: 'Disney+', regions: ['US', 'UK', 'CA', 'AU', 'NZ', 'DE', 'FR', 'ES', 'IT', 'JP', 'IN', 'BR', 'MX', 'KR', 'NL', 'SE', 'NO', 'DK', 'FI', 'PL', 'TR', 'AR', 'CL', 'SG', 'AT', 'CH', 'BE', 'IE', 'PT', 'GR', 'IS', 'CZ', 'HU', 'RO'] },
    { id: 350, name: 'Apple TV+', regions: ['US', 'UK', 'CA', 'AU', 'NZ', 'DE', 'FR', 'ES', 'IT', 'JP', 'IN', 'BR', 'MX', 'KR', 'NL', 'SE', 'NO', 'DK', 'FI', 'PL', 'TR', 'AR', 'SG', 'AE', 'AT', 'CH', 'BE', 'IE', 'PT', 'GR', 'IS', 'CZ', 'HU', 'RO', 'ZA', 'SA'] },
    
    // US platforms
    { id: 384, name: 'HBO Max', regions: ['US', 'ES', 'MX', 'BR', 'AR', 'CL', 'CO'] },
    { id: 15, name: 'Hulu', regions: ['US', 'JP'] },
    { id: 531, name: 'Paramount+', regions: ['US', 'UK', 'CA', 'AU', 'IT', 'DE', 'FR', 'KR', 'AT', 'CH', 'IE'] },
    { id: 43, name: 'Starz', regions: ['US'] },
    { id: 389, name: 'Peacock', regions: ['US', 'UK', 'IE'] },
    
    // Indian platforms
    { id: 122, name: 'Disney+ Hotstar', regions: ['IN'] },
    { id: 220, name: 'JioCinema', regions: ['IN'] },
    { id: 232, name: 'Zee5', regions: ['IN'] },
    { id: 237, name: 'SonyLIV', regions: ['IN'] },
    { id: 166, name: 'Voot', regions: ['IN'] },
    { id: 578, name: 'Aha', regions: ['IN'] },
    
    // UK & Ireland platforms
    { id: 39, name: 'NOW', regions: ['UK', 'IT', 'DE', 'IE'] },
    { id: 38, name: 'BBC iPlayer', regions: ['UK'] },
    { id: 41, name: 'ITV', regions: ['UK'] },
    { id: 103, name: 'All 4', regions: ['UK'] },
    { id: 613, name: 'RTÉ Player', regions: ['IE'] },
    
    // German platforms
    { id: 305, name: 'RTL+', regions: ['DE'] },
    { id: 372, name: 'Joyn', regions: ['DE'] },
    { id: 178, name: 'ZDF', regions: ['DE'] },
    { id: 308, name: 'MagentaTV', regions: ['DE'] },
    
    // French platforms
    { id: 381, name: 'Canal+', regions: ['FR', 'PL'] },
    { id: 109, name: 'MyCanal', regions: ['FR'] },
    { id: 56, name: 'OCS', regions: ['FR'] },
    { id: 1771, name: 'Molotov TV', regions: ['FR'] },
    
    // Spanish platforms
    { id: 307, name: 'Movistar Plus+', regions: ['ES'] },
    { id: 149, name: 'Filmin', regions: ['ES', 'PT'] },
    { id: 167, name: 'ATRESplayer', regions: ['ES'] },
    
    // Italian platforms
    { id: 40, name: 'Sky Go', regions: ['UK', 'DE', 'IT', 'AT'] },
    { id: 210, name: 'Infinity+', regions: ['IT'] },
    { id: 109, name: 'RaiPlay', regions: ['IT'] },
    { id: 1796, name: 'Mediaset Infinity', regions: ['IT'] },
    
    // Netherlands & Belgium platforms
    { id: 76, name: 'Videoland', regions: ['NL'] },
    { id: 146, name: 'NPO Plus', regions: ['NL'] },
    { id: 393, name: 'VRT MAX', regions: ['BE'] },
    { id: 545, name: 'Streamz', regions: ['BE', 'NL'] },
    
    // Nordic platforms
    { id: 553, name: 'Viaplay', regions: ['SE', 'NO', 'DK', 'FI', 'IS', 'NL', 'PL', 'LT', 'LV', 'EE'] },
    { id: 388, name: 'SVT Play', regions: ['SE'] },
    { id: 76, name: 'TV4 Play', regions: ['SE'] },
    { id: 503, name: 'Viki', regions: ['NO'] },
    { id: 318, name: 'C More', regions: ['SE', 'NO', 'DK', 'FI'] },
    { id: 413, name: 'NRK TV', regions: ['NO'] },
    { id: 418, name: 'DR TV', regions: ['DK'] },
    { id: 414, name: 'YLE Areena', regions: ['FI'] },
    { id: 387, name: 'RÚV', regions: ['IS'] },
    
    // Eastern European platforms
    { id: 530, name: 'Voyo', regions: ['CZ', 'SK', 'RO', 'BG', 'SI', 'HR'] },
    { id: 531, name: 'CANAL+ Poland', regions: ['PL'] },
    { id: 545, name: 'Player', regions: ['PL'] },
    { id: 1773, name: 'TVP VOD', regions: ['PL'] },
    { id: 569, name: 'HBO Max', regions: ['HR', 'RS', 'SI', 'MK', 'BA', 'ME'] },
    { id: 1853, name: 'Pickbox NOW', regions: ['RS', 'HR', 'SI', 'BA', 'ME', 'MK'] },
    
    // Swiss & Austrian platforms
    { id: 1759, name: 'blue TV', regions: ['CH'] },
    { id: 531, name: 'Swisscom TV', regions: ['CH'] },
    { id: 409, name: 'SRF', regions: ['CH'] },
    { id: 315, name: 'ORF TVthek', regions: ['AT'] },
    
    // Japanese platforms
    { id: 84, name: 'U-NEXT', regions: ['JP'] },
    { id: 444, name: 'dTV', regions: ['JP'] },
    { id: 185, name: 'Abema TV', regions: ['JP'] },
    { id: 562, name: 'DMM TV', regions: ['JP'] },
    { id: 551, name: 'FOD', regions: ['JP'] },
    { id: 444, name: 'Telasa', regions: ['JP'] },
    
    // Korean platforms
    { id: 356, name: 'Wavve', regions: ['KR'] },
    { id: 97, name: 'Watcha', regions: ['KR'] },
    { id: 624, name: 'TVING', regions: ['KR'] },
    { id: 1899, name: 'Coupang Play', regions: ['KR'] },
    
    // Chinese platforms
    { id: 7, name: 'iQIYI', regions: ['CN', 'TH', 'MY', 'SG'] },
    { id: 554, name: 'Tencent Video', regions: ['CN'] },
    { id: 138, name: 'Youku', regions: ['CN'] },
    { id: 125, name: 'Bilibili', regions: ['CN'] },
    
    // Southeast Asian platforms
    { id: 158, name: 'Viu', regions: ['HK', 'SG', 'MY', 'TH', 'ID', 'PH', 'IN', 'MY'] },
    { id: 223, name: 'Rakuten Viki', regions: ['US', 'UK', 'CA', 'AU', 'SG', 'MY', 'PH'] },
    { id: 315, name: 'WeTV', regions: ['CN', 'TH', 'ID', 'PH', 'VN'] },
    { id: 1796, name: 'CATCHPLAY+', regions: ['TW', 'SG', 'ID'] },
    { id: 1899, name: 'meWATCH', regions: ['SG'] },
    { id: 283, name: 'Vidio', regions: ['ID'] },
    { id: 1771, name: 'iflix', regions: ['MY', 'TH', 'PH', 'ID'] },
    { id: 1853, name: 'Viu', regions: ['TH', 'MY', 'SG', 'PH', 'ID'] },
    { id: 1759, name: 'Bstation', regions: ['ID'] },
    { id: 531, name: 'iWantTFC', regions: ['PH'] },
    { id: 545, name: 'GMA Now', regions: ['PH'] },
    { id: 569, name: 'AIS PLAY', regions: ['TH'] },
    { id: 1773, name: 'True ID', regions: ['TH'] },
    { id: 1853, name: 'FPT Play', regions: ['VN'] },
    
    // Latin American platforms
    { id: 619, name: 'Globoplay', regions: ['BR'] },
    { id: 167, name: 'Claro Video', regions: ['MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'EC', 'GT', 'HN', 'NI', 'CR', 'PA', 'SV', 'DO', 'PR'] },
    { id: 339, name: 'Blim TV', regions: ['MX'] },
    { id: 531, name: 'Star+', regions: ['BR', 'AR', 'MX', 'CL', 'CO', 'PE', 'EC', 'UY', 'PY', 'BO', 'VE'] },
    { id: 1771, name: 'ViX', regions: ['MX', 'US'] },
    { id: 569, name: 'Paramount+', regions: ['AR', 'CL', 'CO', 'PE', 'BR', 'MX'] },
    { id: 1853, name: 'Flow', regions: ['AR', 'UY'] },
    
    // Australian & New Zealand platforms
    { id: 21, name: 'Stan', regions: ['AU'] },
    { id: 385, name: 'Binge', regions: ['AU'] },
    { id: 134, name: 'Foxtel Now', regions: ['AU'] },
    { id: 146, name: 'ABC iview', regions: ['AU'] },
    { id: 109, name: 'SBS On Demand', regions: ['AU'] },
    { id: 546, name: 'TVNZ+', regions: ['NZ'] },
    { id: 395, name: 'ThreeNow', regions: ['NZ'] },
    { id: 545, name: 'Neon', regions: ['NZ'] },
    
    // Canadian platforms
    { id: 230, name: 'Crave', regions: ['CA'] },
    { id: 326, name: 'CBC Gem', regions: ['CA'] },
    
    // Middle Eastern platforms
    { id: 551, name: 'Shahid', regions: ['SA', 'AE', 'EG', 'KW', 'BH', 'OM', 'QA', 'JO', 'LB', 'IQ', 'YE', 'PS', 'SY', 'LY', 'MA', 'DZ', 'TN', 'SD'] },
    { id: 207, name: 'OSN+', regions: ['AE', 'SA', 'KW', 'BH', 'OM', 'QA', 'JO', 'LB', 'EG', 'IQ'] },
    { id: 1796, name: 'TOD', regions: ['EG'] },
    { id: 1899, name: 'Watch iT', regions: ['EG'] },
    { id: 283, name: 'Starzplay', regions: ['SA', 'AE', 'BH', 'KW', 'OM', 'QA', 'EG', 'JO', 'LB', 'IQ', 'MA', 'DZ', 'TN'] },
    
    // African platforms
    { id: 1899, name: 'Showmax', regions: ['ZA', 'NG', 'KE', 'GH', 'TZ', 'UG', 'ZM', 'ZW', 'BW', 'MW', 'MZ', 'NA', 'SZ', 'LS'] },
    { id: 283, name: 'DStv Now', regions: ['ZA', 'NG', 'KE', 'GH', 'TZ', 'UG', 'ZM', 'ZW'] },
    { id: 1771, name: 'IROKO+', regions: ['NG'] },
    
    // Turkish platforms
    { id: 337, name: 'BluTV', regions: ['TR'] },
    { id: 552, name: 'Gain', regions: ['TR'] },
    { id: 305, name: 'puhutv', regions: ['TR'] },
    { id: 569, name: 'TOD', regions: ['TR'] },
    
    // Israeli platforms
    { id: 1853, name: 'yes', regions: ['IL'] },
    { id: 1759, name: 'HOT', regions: ['IL'] },
    
    // Greek & Cyprus platforms
    { id: 531, name: 'Cosmote TV', regions: ['GR', 'CY'] },
    { id: 545, name: 'Nova Go', regions: ['GR'] },
    
    // Portuguese platforms
    { id: 1771, name: 'NOS Play', regions: ['PT'] },
    { id: 1853, name: 'MEO Go', regions: ['PT'] },
  ]
};

export const REGIONS = [
  // A
  { code: 'AR', name: 'Argentina' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  // B
  { code: 'BH', name: 'Bahrain' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BG', name: 'Bulgaria' },
  // C
  { code: 'CA', name: 'Canada' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  // D
  { code: 'DK', name: 'Denmark' },
  { code: 'DO', name: 'Dominican Republic' },
  // E
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'EE', name: 'Estonia' },
  // F
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  // G
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' },
  { code: 'GT', name: 'Guatemala' },
  // H
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  // I
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  // J
  { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' },
  // K
  { code: 'KE', name: 'Kenya' },
  { code: 'KR', name: 'South Korea' },
  { code: 'KW', name: 'Kuwait' },
  // L
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  // M
  { code: 'MK', name: 'Macedonia' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MA', name: 'Morocco' },
  // N
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NO', name: 'Norway' },
  // O
  { code: 'OM', name: 'Oman' },
  // P
  { code: 'PA', name: 'Panama' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' },
  // Q
  { code: 'QA', name: 'Qatar' },
  // R
  { code: 'RO', name: 'Romania' },
  // S
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  // T
  { code: 'TW', name: 'Taiwan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  // U
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UY', name: 'Uruguay' },
  // V
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
];

export const getPlatformsForRegion = (region: string) => {
  return STREAMING_PLATFORMS.all.filter(platform => 
    platform.regions.includes(region)
  );
};
