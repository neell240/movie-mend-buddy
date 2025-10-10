import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Language",
      subtitle: "App Language",
      value: "English",
      onClick: () => {}
    },
    {
      title: "Preferences",
      subtitle: "Genres",
      value: "Action, Comedy, Drama",
      onClick: () => navigate("/preferences")
    },
    {
      title: "Watch History",
      subtitle: "8 movies",
      onClick: () => {}
    },
    {
      title: "Feedback",
      subtitle: "Improve Recommendations",
      onClick: () => {}
    }
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Preferences</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Menu Items */}
        <div className="space-y-2 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={item.onClick}
              className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors text-left"
            >
              <div className="flex-1">
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.subtitle}
                  {item.value && ` • ${item.value}`}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Settings Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">App Settings</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
              <div>
                <h3 className="font-medium mb-1">Appearance</h3>
                <p className="text-sm text-muted-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground mt-1">Adjust the app's visual theme</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
              <div>
                <h3 className="font-medium mb-1">Notifications</h3>
                <p className="text-sm text-muted-foreground">App Notifications</p>
                <p className="text-xs text-muted-foreground mt-1">Receive updates on new releases</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Support</h2>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors text-left">
              <span className="font-medium">Help Center</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors text-left">
              <span className="font-medium">Contact Us</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* About */}
        <div className="text-center text-sm text-muted-foreground mb-4">
          <p className="mb-1">About</p>
          <p>App Version: 1.2.3</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
