import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BooviAnimated } from "@/components/BooviAnimated";
import { Activity, Users, UserPlus, Share2 } from "lucide-react";

interface SocialWalkthroughProps {
  open: boolean;
  onClose: () => void;
}

const walkthroughSteps = [
  {
    title: "👻 Welcome to Social!",
    description: "Hey! It's me, Boovi! Let me show you around your new social hub where you can connect with fellow movie lovers! 🍿",
    icon: null,
  },
  {
    title: "📺 Activity Feed",
    description: "See what your friends are watching! Check out their ratings, discover what they're adding to watchlists, and get inspired for your next movie night! 🎬",
    icon: Activity,
  },
  {
    title: "👥 Friends List",
    description: "Manage your movie buddies here! Accept friend requests, see who you're connected with, and build your cinema crew! The more friends, the better recommendations! ✨",
    icon: Users,
  },
  {
    title: "🔍 Find Friends",
    description: "Search for friends by username and send them requests! Find your real-life friends or connect with people who share your taste in movies! 🎭",
    icon: UserPlus,
  },
  {
    title: "📤 Invite Friends",
    description: "Share MovieMend with your friends using the Invite button! Send them a link and grow your movie community! More friends = more fun! 🚀",
    icon: Share2,
  },
];

export const SocialWalkthrough = ({ open, onClose }: SocialWalkthroughProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = walkthroughSteps[currentStep];
  const isLastStep = currentStep === walkthroughSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center text-center space-y-6 py-6">
          {/* Boovi Avatar */}
          <div className="relative">
            <BooviAnimated animation="wave" size="xl" showSparkles />
          </div>

          {/* Icon for current feature */}
          {step.icon && (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <step.icon className="w-8 h-8 text-primary" />
            </div>
          )}

          {/* Content */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">{step.title}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex gap-2">
            {walkthroughSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              {isLastStep ? "Let's Go! 🍿" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
