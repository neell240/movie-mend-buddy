# 🎬 Boovi Implementation Guide

## Quick Integration Checklist

This guide shows you how to integrate Boovi triggers into your existing MovieMend components.

---

## ✅ Already Done

The following are already set up:
- ✅ `BooviPersonalityProvider` wraps the entire app (`main.tsx`)
- ✅ `FloatingBoovi` widget is active on all pages (`App.tsx`)
- ✅ Enhanced CSS animations with 20+ states
- ✅ All core components created

---

## 🔧 Components to Update

### 1. Watchlist Components

**File: `src/hooks/useWatchlist.ts` or watchlist mutation handlers**

```tsx
import { useBooviTriggers } from '@/hooks/useBooviTriggers';

function WatchlistButton({ movie }) {
  const { onWatchlistAdd, onWatchlistRemove } = useBooviTriggers();
  
  const addMutation = useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => {
      onWatchlistAdd(); // 🎬 Trigger Boovi reaction
      toast.success("Added to watchlist!");
    }
  });
  
  const removeMutation = useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: () => {
      onWatchlistRemove(); // 🎬 Trigger Boovi reaction
      toast.success("Removed from watchlist");
    }
  });
  
  // ... rest of component
}
```

---

### 2. Search Page

**File: `src/pages/Search.tsx`**

```tsx
import { useBooviTriggers } from '@/hooks/useBooviTriggers';

function Search() {
  const { onSearchStart, onSearchSuccess, onSearchEmpty } = useBooviTriggers();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    onSearchStart(); // 🎬 Boovi starts thinking
    
    const results = await searchMovies(query);
    
    if (results.length === 0) {
      onSearchEmpty(); // 🎬 Boovi is confused
    } else {
      onSearchSuccess(); // 🎬 Boovi celebrates
    }
  };
  
  // ... rest of component
}
```

---

### 3. Movie Rating Component

**File: `src/components/MovieRating.tsx` or rating handler**

```tsx
import { useBooviTriggers } from '@/hooks/useBooviTriggers';

function RatingComponent({ movieId }) {
  const { onRatingHigh, onRatingLow } = useBooviTriggers();
  
  const handleRate = async (stars: number) => {
    await saveRating(movieId, stars);
    
    if (stars >= 4) {
      onRatingHigh(); // 🎬 Boovi celebrates 5 stars!
    } else if (stars <= 2) {
      onRatingLow(); // 🎬 Boovi is sad
    }
    
    toast.success(`Rated ${stars} stars!`);
  };
  
  return <StarRating onChange={handleRate} />;
}
```

---

### 4. Movie Details - Trailer Button

**File: `src/pages/MovieDetails.tsx`**

```tsx
import { useBooviTriggers } from '@/hooks/useBooviTriggers';

function MovieDetails() {
  const { onTrailerClick } = useBooviTriggers();
  
  const handleTrailerClick = () => {
    onTrailerClick(); // 🎬 Boovi gets excited!
    window.open(trailerUrl, '_blank');
  };
  
  return (
    <button onClick={handleTrailerClick}>
      Watch Trailer
    </button>
  );
}
```

---

### 5. Authentication Pages

**File: `src/pages/Auth.tsx`**

```tsx
import { useBooviTriggers } from '@/hooks/useBooviTriggers';

function Auth() {
  const { onLogin, onError } = useBooviTriggers();
  
  const handleLogin = async (credentials) => {
    try {
      await signIn(credentials);
      onLogin(); // 🎬 Boovi celebrates login!
      navigate('/');
    } catch (error) {
      onError(); // 🎬 Boovi is shocked
      toast.error("Login failed");
    }
  };
  
  // ... rest of component
}
```

---

### 6. Error Boundaries

**File: Create `src/components/ErrorBoundary.tsx`**

```tsx
import { Component, ReactNode } from 'react';
import { useBooviPersonality } from '@/contexts/BooviPersonalityContext';

class ErrorBoundary extends Component {
  componentDidCatch(error: Error) {
    // Trigger Boovi error reaction
    const { trigger } = useBooviPersonality();
    trigger('error');
    console.error(error);
  }
  
  render() {
    return this.props.children;
  }
}
```

---

### 7. Network Status Detection

**File: `src/components/OfflineIndicator.tsx` (already exists)**

Add Boovi triggers to existing component:

```tsx
import { useBooviPersonality } from '@/contexts/BooviPersonalityContext';

function OfflineIndicator() {
  const { trigger } = useBooviPersonality();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      trigger('network_online'); // Already handled by FloatingBoovi
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      trigger('network_offline'); // Already handled by FloatingBoovi
    };
    
    // ... listeners
  }, [trigger]);
}
```

---

## 🎨 Custom Triggers

### Create Your Own Trigger

```tsx
import { useBooviPersonality } from '@/contexts/BooviPersonalityContext';

function CustomFeature() {
  const { trigger, showMessage } = useBooviPersonality();
  
  const handleCustomEvent = () => {
    // Use existing trigger
    trigger('achievement', { 
      message: "You've watched 100 movies! 🏆" 
    });
    
    // Or show a custom message
    showMessage("Custom Boovi message here!", 3000);
  };
}
```

---

## 🎯 Recommended Priority Order

Implement triggers in this order for maximum impact:

1. **High Priority** (Most visible)
   - ✅ Watchlist add/remove
   - ✅ Search interactions
   - ✅ Login/signup
   - ✅ Trailer clicks

2. **Medium Priority**
   - ✅ Movie ratings
   - ✅ Network status
   - ✅ Error handling

3. **Low Priority** (Polish)
   - ✅ Scroll events (already handled by FloatingBoovi)
   - ✅ Achievements
   - ✅ Custom interactions

---

## 🧪 Testing Your Integration

### Manual Testing Checklist

- [ ] Add a movie to watchlist → Boovi hugs popcorn
- [ ] Remove from watchlist → Boovi looks sad
- [ ] Search for movies → Boovi thinks
- [ ] Search with no results → Boovi confused
- [ ] Rate a movie 5 stars → Boovi celebrates
- [ ] Rate a movie 1 star → Boovi sad
- [ ] Click trailer → Boovi excited
- [ ] Log in → Boovi celebrates
- [ ] Trigger error → Boovi shocked
- [ ] Go offline → Boovi sad
- [ ] Come back online → Boovi celebrates
- [ ] Stay idle 10s → Boovi falls asleep
- [ ] Interact after sleep → Boovi wakes up
- [ ] Scroll to page bottom → Boovi tired
- [ ] Click on Boovi → Random fun animation

---

## 🎬 Example: Complete Watchlist Integration

Here's a complete example showing how to integrate Boovi into a watchlist button:

```tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBooviTriggers } from '@/hooks/useBooviTriggers';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';

interface WatchlistButtonProps {
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  isInWatchlist: boolean;
}

export function WatchlistButton({ 
  movieId, 
  movieTitle, 
  moviePoster,
  isInWatchlist 
}: WatchlistButtonProps) {
  const queryClient = useQueryClient();
  const { onWatchlistAdd, onWatchlistRemove } = useBooviTriggers();
  
  const addMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('watchlist')
        .insert({
          movie_id: movieId,
          movie_title: movieTitle,
          movie_poster: moviePoster,
          status: 'to_watch'
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      onWatchlistAdd(); // 🎬 Boovi reacts!
      toast.success(`Added "${movieTitle}" to your watchlist! 🍿`);
    },
    onError: (error) => {
      toast.error("Failed to add to watchlist");
      console.error(error);
    }
  });
  
  const removeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('movie_id', movieId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      onWatchlistRemove(); // 🎬 Boovi reacts!
      toast.success(`Removed "${movieTitle}" from watchlist`);
    }
  });
  
  const handleClick = () => {
    if (isInWatchlist) {
      removeMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };
  
  return (
    <Button
      variant={isInWatchlist ? "secondary" : "default"}
      size="sm"
      onClick={handleClick}
      disabled={addMutation.isPending || removeMutation.isPending}
    >
      {isInWatchlist ? (
        <>
          <BookmarkCheck className="w-4 h-4 mr-2" />
          In Watchlist
        </>
      ) : (
        <>
          <BookmarkPlus className="w-4 h-4 mr-2" />
          Add to Watchlist
        </>
      )}
    </Button>
  );
}
```

---

## 🎯 Tips for Best Results

1. **Don't Over-trigger**: Respect the 3-second cooldown between same triggers
2. **Match Context**: Use appropriate animations for each action
3. **Test User Flow**: Trigger Boovi at natural interaction points
4. **Keep Messages Fun**: Boovi is playful! Use movie puns and enthusiasm
5. **Mobile Friendly**: Test on mobile - FloatingBoovi is responsive
6. **Performance**: Animations are GPU-accelerated and lightweight
7. **Accessibility**: Boovi can be dismissed - don't block core functionality

---

## 📚 Additional Resources

- Full API: See `BOOVI-MASCOT-ENGINE.md`
- Demo Page: Visit `/boovi-demo` in your app
- Animation CSS: `src/styles/boovi-animations.css`
- Context: `src/contexts/BooviPersonalityContext.tsx`

---

## 🚀 Next Steps

1. Start with watchlist integration (highest impact)
2. Add search triggers
3. Implement rating reactions
4. Test the full user journey
5. Fine-tune messages and timing
6. Enjoy your Duolingo-level mascot! 🎉

Remember: Boovi makes your app more delightful, but core functionality comes first. Add triggers where they enhance the experience without disrupting workflows.
