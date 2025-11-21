import { useState, useEffect } from 'react';

export type BooviState = 'celebrating' | 'sympathetic' | 'excited' | 'focused' | 'idle';

export const useBooviState = (content: string, isLoading: boolean): BooviState => {
  const [state, setState] = useState<BooviState>('idle');

  useEffect(() => {
    if (isLoading) {
      setState('focused');
      return;
    }

    const lowerContent = content.toLowerCase();

    // Celebrating indicators
    if (
      /popcorn up|found a blockbuster|grab your (popcorn|3d glasses)|action!|blockbuster/i.test(content) ||
      /🍿|🎬|✨|🎉/.test(content)
    ) {
      setState('celebrating');
    }
    // Sympathetic indicators
    else if (
      /aww|sorry|no (reels|results)|didn't find|try (again|different)/i.test(content) ||
      /😔|💔/.test(content)
    ) {
      setState('sympathetic');
    }
    // Excited indicators (high ratings, must-watch)
    else if (
      /imdb \d+\.\d+|\*\*imdb|must-watch|top-tier|whoa|incredible|amazing/i.test(content) ||
      /⚡|🔥|⭐/.test(content)
    ) {
      setState('excited');
    }
    // Focused indicators (searching, processing)
    else if (
      /(gliding|scanning|searching|rolling|zooming|rewinding) through/i.test(content) ||
      /hold tight|one moment|just a sec/i.test(content)
    ) {
      setState('focused');
    }
    // Default to idle for general conversation
    else {
      setState('idle');
    }
  }, [content, isLoading]);

  return state;
};
