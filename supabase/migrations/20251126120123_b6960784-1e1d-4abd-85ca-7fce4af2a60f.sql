-- Create watchlist table
CREATE TABLE public.watchlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  movie_id INTEGER NOT NULL,
  movie_title TEXT NOT NULL,
  movie_poster TEXT,
  status TEXT NOT NULL DEFAULT 'want_to_watch',
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  watched_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(user_id, movie_id)
);

-- Enable RLS
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own watchlist"
ON public.watchlist
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their watchlist"
ON public.watchlist
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their watchlist"
ON public.watchlist
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their watchlist"
ON public.watchlist
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_watchlist_user_id ON public.watchlist(user_id);

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_watchlist_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When a movie is marked as watched
  IF TG_OP = 'UPDATE' AND OLD.status != 'watched' AND NEW.status = 'watched' THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      '🎬 Movie Watched!',
      'You marked "' || NEW.movie_title || '" as watched. Great choice!',
      'watchlist_update'
    );
  END IF;
  
  -- When a new movie is added to watchlist
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      '📝 Added to Watchlist!',
      '"' || NEW.movie_title || '" has been added to your watchlist',
      'watchlist_update'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for watchlist changes
CREATE TRIGGER watchlist_notification_trigger
AFTER INSERT OR UPDATE ON public.watchlist
FOR EACH ROW
EXECUTE FUNCTION public.create_watchlist_notification();