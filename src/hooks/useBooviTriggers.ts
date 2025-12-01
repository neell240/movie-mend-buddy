import { useEffect } from 'react';
import { useBooviPersonality } from '@/contexts/BooviPersonalityContext';

export const useBooviTriggers = () => {
  const { trigger } = useBooviPersonality();

  // App initialization trigger
  useEffect(() => {
    trigger('app_open');
  }, [trigger]);

  // Watchlist triggers
  const onWatchlistAdd = () => trigger('watchlist_add');
  const onWatchlistRemove = () => trigger('watchlist_remove');

  // Search triggers
  const onSearchStart = () => trigger('search_start');
  const onSearchEmpty = () => trigger('search_empty');
  const onSearchSuccess = () => trigger('search_success');

  // Rating triggers
  const onRatingHigh = () => trigger('rating_high');
  const onRatingLow = () => trigger('rating_low');

  // Other triggers
  const onTrailerClick = () => trigger('trailer_click');
  const onLogin = () => trigger('login');
  const onLogout = () => trigger('logout');
  const onError = () => trigger('error');
  const onAchievement = (message: string) => trigger('achievement', { message });

  return {
    onWatchlistAdd,
    onWatchlistRemove,
    onSearchStart,
    onSearchEmpty,
    onSearchSuccess,
    onRatingHigh,
    onRatingLow,
    onTrailerClick,
    onLogin,
    onLogout,
    onError,
    onAchievement,
  };
};

