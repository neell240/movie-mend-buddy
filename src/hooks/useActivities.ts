import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Activity {
  id: string;
  user_id: string;
  activity_type: 'rated' | 'watched' | 'added_to_watchlist';
  movie_id: number;
  movie_title: string;
  movie_poster: string | null;
  rating: number | null;
  metadata: any;
  created_at: string;
  profile?: {
    username: string | null;
    avatar_url: string | null;
  };
}

export const useActivities = (userId?: string) => {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activities", userId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from("user_activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set(data.map(a => a.user_id))];
      if (userIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

      return data.map(activity => ({
        ...activity,
        profile: profiles?.find(p => p.id === activity.user_id)
      })) as Activity[];
    },
  });

  return { activities, isLoading };
};
