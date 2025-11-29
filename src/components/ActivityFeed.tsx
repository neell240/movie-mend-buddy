import { useActivities } from "@/hooks/useActivities";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Plus, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ActivityFeedProps {
  userId?: string;
  limit?: number;
}

export const ActivityFeed = ({ userId, limit }: ActivityFeedProps) => {
  const { activities, isLoading } = useActivities(userId);
  const navigate = useNavigate();

  const displayActivities = limit ? activities.slice(0, limit) : activities;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (displayActivities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No activities yet</p>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'rated':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'watched':
        return <Eye className="h-4 w-4 text-green-500" />;
      case 'added_to_watchlist':
        return <Plus className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getActivityText = (activity: typeof displayActivities[0]) => {
    const username = activity.profile?.username || 'Someone';
    switch (activity.activity_type) {
      case 'rated':
        return (
          <>
            <span className="font-semibold">{username}</span> rated{' '}
            <span className="font-semibold">{activity.movie_title}</span>
            {activity.rating && (
              <span className="ml-2 text-yellow-500">
                {'⭐'.repeat(activity.rating)}
              </span>
            )}
          </>
        );
      case 'watched':
        return (
          <>
            <span className="font-semibold">{username}</span> watched{' '}
            <span className="font-semibold">{activity.movie_title}</span>
          </>
        );
      case 'added_to_watchlist':
        return (
          <>
            <span className="font-semibold">{username}</span> added{' '}
            <span className="font-semibold">{activity.movie_title}</span> to watchlist
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {displayActivities.map((activity) => (
        <Card
          key={activity.id}
          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate(`/movie/${activity.movie_id}`)}
        >
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={activity.profile?.avatar_url || undefined} />
              <AvatarFallback>
                {activity.profile?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {getActivityIcon(activity.activity_type)}
                <p className="text-sm">{getActivityText(activity)}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>

            {activity.movie_poster && (
              <img
                src={`https://image.tmdb.org/t/p/w92${activity.movie_poster}`}
                alt={activity.movie_title}
                className="w-12 h-18 rounded object-cover"
              />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
