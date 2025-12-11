import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { ActivityFeed } from "@/components/ActivityFeed";
import { FriendsList } from "@/components/FriendsList";
import { FriendRequests } from "@/components/FriendRequests";
import { UserSearch } from "@/components/UserSearch";
import { SocialWalkthrough } from "@/components/SocialWalkthrough";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFriends } from "@/hooks/useFriends";
import { useAuth } from "@/hooks/useAuth";
import { Users, UserPlus, Activity, Share2 } from "lucide-react";
import { toast } from "sonner";

const Social = () => {
  const { pendingRequests } = useFriends();
  const { user } = useAuth();
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  useEffect(() => {
    // Check if user has seen the social walkthrough
    const hasSeenWalkthrough = localStorage.getItem("social-walkthrough-seen");
    if (!hasSeenWalkthrough && user) {
      setShowWalkthrough(true);
    }
  }, [user]);

  const handleInviteFriend = async () => {
    if (!user) {
      toast.error("Please sign in to invite friends");
      return;
    }

    // Create invite link with user ID
    const inviteUrl = `${window.location.origin}/auth?invite=${user.id}`;

    // Try Web Share API first (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on MovieMend!",
          text: "I'm using MovieMend to discover amazing movies. Join me!",
          url: inviteUrl,
        });
        toast.success("Invite shared!");
      } catch (error) {
        // User cancelled or share failed
        if ((error as Error).name !== 'AbortError') {
          // Fallback to clipboard
          try {
            await navigator.clipboard.writeText(inviteUrl);
            toast.success("Invite link copied to clipboard!");
          } catch {
            toast.error("Failed to share invite");
          }
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(inviteUrl);
        toast.success("Invite link copied to clipboard!");
      } catch {
        toast.error("Failed to copy invite link");
      }
    }
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-6 lg:pt-16">
      <SocialWalkthrough 
        open={showWalkthrough} 
        onClose={() => {
          setShowWalkthrough(false);
          localStorage.setItem("social-walkthrough-seen", "true");
        }}
      />

      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border lg:top-16">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Social</h1>
          <Button
            variant="default"
            size="sm"
            onClick={handleInviteFriend}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Invite Friend
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Friends
              {pendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <ActivityFeed />
            </div>
          </TabsContent>

          <TabsContent value="friends" className="space-y-6">
            {pendingRequests.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Friend Requests ({pendingRequests.length})
                </h2>
                <FriendRequests />
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold mb-4">Your Friends</h2>
              <FriendsList />
            </div>
          </TabsContent>

          <TabsContent value="search">
            <div>
              <h2 className="text-lg font-semibold mb-4">Find Friends</h2>
              <UserSearch />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Social;
