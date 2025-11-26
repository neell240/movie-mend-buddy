import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  Mail, 
  LogOut,
  LogIn,
  Zap
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [isTestingNotifications, setIsTestingNotifications] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleTestNotifications = async () => {
    setIsTestingNotifications(true);
    try {
      const { error } = await supabase.functions.invoke('notification-scheduler');
      
      if (error) throw error;
      
      toast.success("Notification scheduler triggered! Check your notifications in a moment.");
    } catch (error) {
      console.error('Error triggering notification scheduler:', error);
      toast.error("Failed to trigger notifications. Please try again.");
    } finally {
      setIsTestingNotifications(false);
    }
  };

  const menuItems = [
    {
      icon: Settings,
      label: "Preferences",
      onClick: () => navigate("/preferences"),
    },
  ];

  const appSettings = [
    {
      icon: Bell,
      label: "Notifications",
      onClick: () => navigate("/notifications"),
    },
  ];

  const support = [
    {
      icon: HelpCircle,
      label: "Help & Support",
      onClick: () => {},
    },
    {
      icon: Mail,
      label: "Contact Us",
      onClick: () => {},
    },
    {
      icon: Shield,
      label: "Privacy Policy",
      onClick: () => {},
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
          <div className="max-w-lg mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">Profile</h1>
          </div>
        </header>
        <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* User Info */}
        {user ? (
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {user.email?.[0].toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold">{user.email}</h2>
                <p className="text-sm text-muted-foreground">Member</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Sign in to access more features</p>
              <Button onClick={() => navigate("/auth")} className="w-full">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          </Card>
        )}

        {/* General Settings */}
        <section>
          <h3 className="font-semibold mb-3">General</h3>
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:bg-accent transition-colors"
                onClick={item.onClick}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span>{item.label}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* App Settings */}
        <section>
          <h3 className="font-semibold mb-3">App Settings</h3>
          <div className="space-y-2">
            {appSettings.map((item, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:bg-accent transition-colors"
                onClick={item.onClick}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span>{item.label}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Support */}
        <section>
          <h3 className="font-semibold mb-3">Support</h3>
          <div className="space-y-2">
            {support.map((item, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:bg-accent transition-colors"
                onClick={item.onClick}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span>{item.label}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Developer Tools */}
        {user && (
          <section>
            <h3 className="font-semibold mb-3">Developer Tools</h3>
            <Card className="p-4">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Manually trigger the notification scheduler to test notifications
                </p>
                <Button
                  onClick={handleTestNotifications}
                  disabled={isTestingNotifications}
                  className="w-full"
                  variant="outline"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isTestingNotifications ? "Triggering..." : "Test Notifications"}
                </Button>
              </div>
            </Card>
          </section>
        )}

        {/* Sign Out */}
        {user && (
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        )}

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>MovieMend v1.0.0</p>
          <p className="mt-1">Made with ❤️ by Boovi 👻</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
