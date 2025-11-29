import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, UserCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useFriends } from "@/hooks/useFriends";
import { useFollows } from "@/hooks/useFollows";
import { useAuth } from "@/hooks/useAuth";

interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

export const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { sendFriendRequest, friends } = useFriends();
  const { followUser, isFollowing } = useFollows();
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .ilike("username", `%${searchQuery}%`)
        .neq("id", user?.id || '')
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const isFriend = (userId: string) => {
    return friends.some(f => f.friend_id === userId);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search users by username..."
          className="pl-10 bg-secondary border-border"
        />
      </div>

      {isSearching && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      <div className="space-y-3">
        {searchResults.map((profile) => (
          <Card key={profile.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback>
                    {profile.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{profile.username || 'Anonymous User'}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {isFriend(profile.id) ? (
                  <Button size="sm" variant="outline" disabled>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Friends
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => sendFriendRequest.mutate(profile.id)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Friend
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => followUser.mutate(profile.id)}
                  disabled={isFollowing(profile.id)}
                >
                  {isFollowing(profile.id) ? 'Following' : 'Follow'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
