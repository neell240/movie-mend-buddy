import { useFriends } from "@/hooks/useFriends";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserMinus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FriendsList = () => {
  const { friends, loadingFriends, removeFriend } = useFriends();
  const navigate = useNavigate();

  if (loadingFriends) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No friends yet. Start by searching for users!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {friends.map((friendship) => (
        <Card key={friendship.id} className="p-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={() => navigate(`/profile/${friendship.friend_id}`)}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={friendship.friend_profile?.avatar_url || undefined} />
                <AvatarFallback>
                  {friendship.friend_profile?.username?.[0]?.toUpperCase() || 'F'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {friendship.friend_profile?.username || 'Anonymous User'}
                </p>
                <p className="text-xs text-muted-foreground">Friend</p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => removeFriend.mutate(friendship.id)}
            >
              <UserMinus className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
