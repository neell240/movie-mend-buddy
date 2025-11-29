import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, Bell, User, Globe, Shield, Palette, Info, Eye, Users, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);
  const [autoPlayTrailers, setAutoPlayTrailers] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState<"public" | "friends_only" | "private">("friends_only");
  const [isLoadingVisibility, setIsLoadingVisibility] = useState(true);

  useEffect(() => {
    const fetchProfileVisibility = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('visibility')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile visibility:', error);
        return;
      }

      if (data?.visibility) {
        setProfileVisibility(data.visibility);
      }
      setIsLoadingVisibility(false);
    };

    fetchProfileVisibility();
  }, [user]);

  const handleNotificationToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    toast.success(checked ? "Notifications enabled" : "Notifications disabled");
  };

  const handlePushNotificationToggle = (checked: boolean) => {
    setPushNotificationsEnabled(checked);
    toast.success(checked ? "Push notifications enabled" : "Push notifications disabled");
  };

  const handleAutoPlayToggle = (checked: boolean) => {
    setAutoPlayTrailers(checked);
    toast.success(checked ? "Auto-play enabled" : "Auto-play disabled");
  };

  const handleVisibilityChange = async (value: "public" | "friends_only" | "private") => {
    if (!user) {
      toast.error("Please sign in to change privacy settings");
      return;
    }

    setProfileVisibility(value);

    const { error } = await supabase
      .from('profiles')
      .update({ visibility: value })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating visibility:', error);
      toast.error("Failed to update privacy settings");
      return;
    }

    const messages = {
      public: "Your activity is now visible to everyone",
      friends_only: "Your activity is now visible to friends only",
      private: "Your activity is now private"
    };
    
    toast.success(messages[value]);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Account Settings */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Account</h2>
          </div>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/profile")}
          >
            <User className="w-4 h-4 mr-2" />
            Profile Settings
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/preferences")}
          >
            <Globe className="w-4 h-4 mr-2" />
            Movie Preferences
          </Button>
        </Card>

        {/* Notifications */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new movies and recommendations
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified on your device
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotificationsEnabled}
              onCheckedChange={handlePushNotificationToggle}
            />
          </div>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/notifications")}
          >
            View All Notifications
          </Button>
        </Card>

        {/* Appearance */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="autoplay">Auto-play Trailers</Label>
              <p className="text-sm text-muted-foreground">
                Automatically play trailers when viewing movies
              </p>
            </div>
            <Switch
              id="autoplay"
              checked={autoPlayTrailers}
              onCheckedChange={handleAutoPlayToggle}
            />
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Privacy & Security</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium mb-3 block">Who can see your activity?</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Control who can see your movie ratings, reviews, and watchlist on the social feed
              </p>
              
              {isLoadingVisibility ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : (
                <RadioGroup value={profileVisibility} onValueChange={handleVisibilityChange}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-medium">Public</div>
                          <div className="text-xs text-muted-foreground">Everyone can see your activity</div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="friends_only" id="friends_only" />
                    <Label htmlFor="friends_only" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-medium">Friends Only</div>
                          <div className="text-xs text-muted-foreground">Only your friends can see your activity</div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-medium">Private</div>
                          <div className="text-xs text-muted-foreground">Only you can see your activity</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              Privacy Policy
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start mt-2"
            >
              Terms of Service
            </Button>
          </div>
        </Card>

        {/* About */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">About</h2>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            <p className="text-sm text-muted-foreground">
              MovieMend - Your personal movie companion
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full justify-start"
          >
            Help & Support
          </Button>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Settings;
