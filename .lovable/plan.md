# Ram Navami Seasonal Experience

## Overview

Add a Ram Navami seasonal mode (active around March 26 -- March 28, covering the typical Ram Navami period) with a first-open welcome screen, a saffron/cream theme, and a curated Ramayana content section on the home page.

## Files to Create

### 1. `src/assets/boovi-ramnavami.png`

Copy the uploaded Boovi kurta image into the project assets.

### 2. `src/components/ramnavami/RamNavamiWelcome.tsx`

First-open-only overlay (similar pattern to `ValentineWelcome`):

- Saffron-to-cream gradient background (`#F4C27A` to `#FFF6E8`)
- Boovi (kurta version) fades + scales in center with subtle gold glow behind
- Greeting text fades in: "Happy Ram Navami 🙏 / Wishing you and your family peace and happiness."
- Optional line: "Would you like something meaningful to watch today?"
- 3-4 second duration, auto-dismiss, tap to skip
- Uses `localStorage` key `moviemend_ramnavami_welcome_2026` to show only once
- No bounce, no flashy effects -- only fade and scale

### 3. `src/components/ramnavami/RamNavamiHeroBanner.tsx`

Hero section for the home page:

- Saffron/cream card with rounded corners (16-20px)
- Boovi kurta image (medium-large, centered/left) with warm gold glow
- Title: "Ram Navami 🪔" with saffron accent
- Subtitle: "Wishing you peace and happiness"
- Clean, minimal layout

### 4. `src/components/ramnavami/RamNavamiMovies.tsx`

Curated Ramayana content section:

- Section title: "Stories of Ramayana" with 🪔 icon
- Hardcoded list of Ramayana titles:
  - Ramayana: The Legend of Prince Rama (1993) -- ⭐ 8.1 -- "Animated epic of Lord Rama's journey"
  - Ramayan (1987, Ramanand Sagar) -- ⭐ 9.1 -- "The iconic television retelling"
- Card design: cream background (`#FFF6E8`), rounded corners, subtle shadow, dark brown text
- Each card shows title, year, IMDb rating, one-line description (max 10 words)
- Clicking a card navigates to TMDB movie details if available

## Files to Modify

### 5. `src/hooks/useChristmasMode.ts`

- Add `'ramnavami'` to the `SeasonalMode` type
- Add detection logic: active March 25 -- April 6 (covers the typical period)
- Add `isRamNavami` computed value to the hook return

### 6. `src/components/christmas/ChristmasWrapper.tsx`

- Import and apply `theme-ramnavami` class to body when Ram Navami mode is active
- No particle effects (no hearts, no snow) -- just the theme class

### 7. `src/index.css`

- Add `.theme-ramnavami` class with saffron/cream palette overrides:
  - Background: `#F4C27A` to `#FFF6E8` gradient
  - Card backgrounds: warm cream
  - Text: dark brown / off-white
  - Accent: soft gold (`#E6B65C`)

### 8. `src/App.tsx`

- Import `RamNavamiWelcome` and render it conditionally based on `isRamNavami` from the seasonal context (similar to how Valentine welcome was wired)

### 9. `src/pages/Index.tsx`

- Import `RamNavamiHeroBanner` and `RamNavamiMovies`
- When `isRamNavami` is true:
  - Show `RamNavamiHeroBanner` instead of `WinterHeroBanner`
  - Show `RamNavamiMovies` section before the regular "Popular Movies" section
  - Keep all other sections (PersonalizedRecommendations, etc.) intact below
- Header shows 🪔 icon next to "MovieMend" during Ram Navami

## Technical Details

- const isRamNavami =
    (month === 2 && day >= 25 && day <= 28); // March
- Welcome animation uses `framer-motion` with fade + scale only
- No new dependencies needed
- Auto-expires after April 6 with no leftover UI