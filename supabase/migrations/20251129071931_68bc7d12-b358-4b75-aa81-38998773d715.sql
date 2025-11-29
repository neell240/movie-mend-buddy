-- Create a security definer function to check if a user can view another user's activity
CREATE OR REPLACE FUNCTION public.can_view_user_activity(activity_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_vis profile_visibility;
  is_friend boolean;
BEGIN
  -- Get the profile visibility setting
  SELECT visibility INTO profile_vis
  FROM profiles
  WHERE id = activity_user_id;
  
  -- If no profile found, default to private
  IF profile_vis IS NULL THEN
    RETURN false;
  END IF;
  
  -- Always allow users to see their own activity
  IF auth.uid() = activity_user_id THEN
    RETURN true;
  END IF;
  
  -- Check visibility setting
  IF profile_vis = 'public' THEN
    RETURN true;
  ELSIF profile_vis = 'private' THEN
    RETURN false;
  ELSIF profile_vis = 'friends_only' THEN
    -- Check if they are friends
    SELECT EXISTS (
      SELECT 1 FROM friendships
      WHERE status = 'accepted'
        AND (
          (user_id = auth.uid() AND friend_id = activity_user_id)
          OR
          (friend_id = auth.uid() AND user_id = activity_user_id)
        )
    ) INTO is_friend;
    
    RETURN is_friend;
  END IF;
  
  RETURN false;
END;
$$;

-- Drop existing policies on user_activities
DROP POLICY IF EXISTS "Friends-only activities viewable by friends" ON user_activities;
DROP POLICY IF EXISTS "Public activities are viewable by everyone" ON user_activities;

-- Create new policy that uses profile visibility
CREATE POLICY "Users can view activities based on profile visibility"
ON user_activities
FOR SELECT
USING (public.can_view_user_activity(user_id));

-- Also need to make profiles viewable to check visibility
CREATE POLICY "Profiles are viewable by everyone for visibility check"
ON profiles
FOR SELECT
USING (true);