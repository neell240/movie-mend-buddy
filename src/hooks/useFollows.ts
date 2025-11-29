import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  profile?: {
    username: string | null;
    avatar_url: string | null;
  };
}

export const useFollows = () => {
  const queryClient = useQueryClient();

  const { data: following = [], isLoading: loadingFollowing } = useQuery({
    queryKey: ["following"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const followingIds = data.map(f => f.following_id);
      if (followingIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", followingIds);

      return data.map(follow => ({
        ...follow,
        profile: profiles?.find(p => p.id === follow.following_id)
      })) as Follow[];
    },
  });

  const { data: followers = [], isLoading: loadingFollowers } = useQuery({
    queryKey: ["followers"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("follows")
        .select("*")
        .eq("following_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch follower profiles separately
      const followerIds = data.map(f => f.follower_id);
      if (followerIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", followerIds);

      return data.map(follow => ({
        ...follow,
        profile: profiles?.find(p => p.id === follow.follower_id)
      })) as Follow[];
    },
  });

  const followUser = useMutation({
    mutationFn: async (userId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("follows")
        .insert({ follower_id: user.id, following_id: userId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following"] });
      toast.success("Now following!");
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error("Already following");
      } else {
        toast.error("Failed to follow user");
      }
    },
  });

  const unfollowUser = useMutation({
    mutationFn: async (userId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following"] });
      toast.success("Unfollowed");
    },
  });

  const isFollowing = (userId: string) => {
    return following.some(f => f.following_id === userId);
  };

  return {
    following,
    followers,
    loadingFollowing,
    loadingFollowers,
    followUser,
    unfollowUser,
    isFollowing,
  };
};
