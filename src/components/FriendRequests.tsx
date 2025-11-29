import { useFriends } from "@/hooks/useFriends";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";

export const FriendRequests = () => {
  const { pendingRequests, loadingRequests, acceptFriendRequest, rejectFriendRequest } = useFriends();

  if (loadingRequests) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No pending friend requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pendingRequests.map((request) => (
        <Card key={request.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={request.friend_profile?.avatar_url || undefined} />
                <AvatarFallback>
                  {request.friend_profile?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {request.friend_profile?.username || 'Anonymous User'}
                </p>
                <p className="text-xs text-muted-foreground">Friend request</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => acceptFriendRequest.mutate(request.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => rejectFriendRequest.mutate(request.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
