import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
  friend_profile?: {
    username: string | null;
    avatar_url: string | null;
  };
}

export const useFriends = () => {
  const queryClient = useQueryClient();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("friendships")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "accepted")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch friend profiles separately
      const friendIds = data.map(f => f.friend_id);
      if (friendIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", friendIds);

      return data.map(friendship => ({
        ...friendship,
        friend_profile: profiles?.find(p => p.id === friendship.friend_id)
      })) as Friendship[];
    },
  });

  const { data: pendingRequests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ["friend-requests"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("friendships")
        .select("*")
        .eq("friend_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch requester profiles separately
      const userIds = data.map(f => f.user_id);
      if (userIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

      return data.map(friendship => ({
        ...friendship,
        friend_profile: profiles?.find(p => p.id === friendship.user_id)
      })) as Friendship[];
    },
  });

  const sendFriendRequest = useMutation({
    mutationFn: async (friendId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("friendships")
        .insert({ user_id: user.id, friend_id: friendId, status: 'pending' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Friend request sent!");
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error("Friend request already exists");
      } else {
        toast.error("Failed to send friend request");
      }
    },
  });

  const acceptFriendRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from("friendships")
        .update({ status: 'accepted' })
        .eq("id", requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      toast.success("Friend request accepted!");
    },
  });

  const rejectFriendRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .eq("id", requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      toast.success("Friend request rejected");
    },
  });

  const removeFriend = useMutation({
    mutationFn: async (friendshipId: string) => {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .eq("id", friendshipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Friend removed");
    },
  });

  return {
    friends,
    pendingRequests,
    loadingFriends,
    loadingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
  };
};
