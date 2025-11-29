-- Add rating column to watchlist table
ALTER TABLE public.watchlist 
ADD COLUMN rating INTEGER CHECK (rating >= 1 AND rating <= 5);

-- Add notes column for user feedback
ALTER TABLE public.watchlist 
ADD COLUMN notes TEXT;

-- Create index for faster queries on watched movies with ratings
CREATE INDEX idx_watchlist_user_watched ON public.watchlist(user_id, status) WHERE status = 'watched';
CREATE INDEX idx_watchlist_ratings ON public.watchlist(user_id, rating) WHERE rating IS NOT NULL;