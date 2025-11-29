-- Create enum for friendship status
CREATE TYPE public.friendship_status AS ENUM ('pending', 'accepted', 'blocked');

-- Create enum for watchlist visibility
CREATE TYPE public.watchlist_visibility AS ENUM ('public', 'friends_only', 'private');

-- Create enum for activity types
CREATE TYPE public.activity_type AS ENUM ('rated', 'watched', 'added_to_watchlist');

-- Create friendships table (mutual connections)
CREATE TABLE public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status friendship_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Create follows table (one-way connections)
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create user activities table
CREATE TABLE public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  movie_id INTEGER NOT NULL,
  movie_title TEXT NOT NULL,
  movie_poster TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add visibility column to watchlist
ALTER TABLE public.watchlist ADD COLUMN visibility watchlist_visibility NOT NULL DEFAULT 'friends_only';

-- Add avatar_url to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Enable RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for friendships
CREATE POLICY "Users can view their own friendships"
  ON public.friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friendship requests"
  ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their friendships"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete their friendships"
  ON public.friendships FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- RLS Policies for follows
CREATE POLICY "Users can view their follows and followers"
  ON public.follows FOR SELECT
  USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can create follows"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their follows"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- RLS Policies for user_activities
CREATE POLICY "Public activities are viewable by everyone"
  ON public.user_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.watchlist w
      WHERE w.user_id = user_activities.user_id
        AND w.movie_id = user_activities.movie_id
        AND w.visibility = 'public'
    )
  );

CREATE POLICY "Friends-only activities viewable by friends"
  ON public.user_activities FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.friendships
      WHERE ((user_id = auth.uid() AND friend_id = user_activities.user_id)
         OR (friend_id = auth.uid() AND user_id = user_activities.user_id))
        AND status = 'accepted'
    )
  );

CREATE POLICY "System can create activities"
  ON public.user_activities FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_friendships_user ON public.friendships(user_id);
CREATE INDEX idx_friendships_friend ON public.friendships(friend_id);
CREATE INDEX idx_friendships_status ON public.friendships(status);
CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);
CREATE INDEX idx_activities_user ON public.user_activities(user_id);
CREATE INDEX idx_activities_created ON public.user_activities(created_at DESC);
CREATE INDEX idx_watchlist_visibility ON public.watchlist(visibility);

-- Create function to automatically create activity entries
CREATE OR REPLACE FUNCTION public.create_user_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When movie is rated
  IF TG_OP = 'UPDATE' AND OLD.rating IS DISTINCT FROM NEW.rating AND NEW.rating IS NOT NULL THEN
    INSERT INTO public.user_activities (user_id, activity_type, movie_id, movie_title, movie_poster, rating)
    VALUES (NEW.user_id, 'rated', NEW.movie_id, NEW.movie_title, NEW.movie_poster, NEW.rating);
  END IF;
  
  -- When movie is marked as watched
  IF TG_OP = 'UPDATE' AND OLD.status != 'watched' AND NEW.status = 'watched' THEN
    INSERT INTO public.user_activities (user_id, activity_type, movie_id, movie_title, movie_poster)
    VALUES (NEW.user_id, 'watched', NEW.movie_id, NEW.movie_title, NEW.movie_poster);
  END IF;
  
  -- When movie is added to watchlist
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.user_activities (user_id, activity_type, movie_id, movie_title, movie_poster)
    VALUES (NEW.user_id, 'added_to_watchlist', NEW.movie_id, NEW.movie_title, NEW.movie_poster);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic activity tracking
CREATE TRIGGER track_watchlist_activities
  AFTER INSERT OR UPDATE ON public.watchlist
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_activity();

-- Trigger for updating friendships updated_at
CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON public.friendships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();