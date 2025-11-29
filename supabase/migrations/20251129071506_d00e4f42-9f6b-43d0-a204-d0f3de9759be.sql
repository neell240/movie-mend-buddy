-- Create profile visibility enum
CREATE TYPE public.profile_visibility AS ENUM ('public', 'friends_only', 'private');

-- Add visibility column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN visibility public.profile_visibility NOT NULL DEFAULT 'friends_only';

-- Create index for better performance
CREATE INDEX idx_profiles_visibility ON public.profiles(visibility);

-- Comment on column
COMMENT ON COLUMN public.profiles.visibility IS 'Controls who can see user activity on social feed';