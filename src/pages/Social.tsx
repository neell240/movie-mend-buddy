import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { ActivityFeed } from "@/components/ActivityFeed";
import { FriendsList } from "@/components/FriendsList";
import { FriendRequests } from "@/components/FriendRequests";
import { UserSearch } from "@/components/UserSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useFriends } from "@/hooks/useFriends";
import { Users, UserPlus, Activity } from "lucide-react";

const Social = () => {
  const { pendingRequests } = useFriends();

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Social</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
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
