import { useState } from "react";
import { BooviAnimated } from "@/components/BooviAnimated";
import { BooviLoadingScreen } from "@/components/BooviLoadingScreen";
import { BooviWelcome } from "@/components/BooviWelcome";
import { BooviThinking } from "@/components/BooviThinking";
import { BooviPointer } from "@/components/BooviPointer";
import { useBooviAnimation } from "@/hooks/useBooviAnimation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BooviDemo() {
  const [showLoading, setShowLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const { animation, setAnimation, celebrate, jump, wave } = useBooviAnimation();

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Boovi Animation Demo</h1>
        <p className="text-muted-foreground">
          Test all Boovi animations and components
        </p>
      </div>

      {/* Animation Controls */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Animation Controls</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setAnimation("idle")}>Idle</Button>
          <Button onClick={() => setAnimation("wave")}>Wave</Button>
          <Button onClick={() => setAnimation("jump")}>Jump</Button>
          <Button onClick={() => setAnimation("think")}>Think</Button>
          <Button onClick={() => setAnimation("loading")}>Loading</Button>
          <Button onClick={() => setAnimation("point")}>Point</Button>
          <Button onClick={celebrate}>Celebrate</Button>
          <Button onClick={jump}>Quick Jump</Button>
          <Button onClick={wave}>Quick Wave</Button>
        </div>
      </Card>

      {/* Main Boovi Display */}
      <Card className="p-8">
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-xl font-semibold">Current Animation: {animation}</h3>
          <BooviAnimated 
            animation={animation} 
            size="xl" 
            showSparkles={animation === "celebrate" || animation === "wave"}
          />
        </div>
      </Card>

      {/* Size Variants */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Size Variants</h2>
        <div className="flex items-end justify-around flex-wrap gap-8">
          <div className="text-center">
            <BooviAnimated animation="idle" size="sm" />
            <p className="text-sm mt-2">Small</p>
          </div>
          <div className="text-center">
            <BooviAnimated animation="idle" size="md" />
            <p className="text-sm mt-2">Medium</p>
          </div>
          <div className="text-center">
            <BooviAnimated animation="idle" size="lg" />
            <p className="text-sm mt-2">Large</p>
          </div>
          <div className="text-center">
            <BooviAnimated animation="idle" size="xl" />
            <p className="text-sm mt-2">Extra Large</p>
          </div>
        </div>
      </Card>

      {/* Component Examples */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Component Examples</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Thinking Component</h3>
            <BooviThinking message="Finding the perfect movie..." />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Thinking Compact</h3>
            <BooviThinking message="Analyzing your preferences..." compact />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Pointer Components</h3>
            <div className="grid grid-cols-2 gap-8 p-8">
              <BooviPointer message="Check this out!" direction="right" />
              <BooviPointer message="Look up here!" direction="up" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Screen Components</h3>
            <div className="flex gap-4">
              <Button onClick={() => setShowLoading(true)}>
                Show Loading Screen
              </Button>
              <Button onClick={() => setShowWelcome(true)}>
                Show Welcome Screen
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Examples */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Basic Animation:</h4>
            <pre className="bg-muted p-3 rounded overflow-x-auto">
{`<BooviAnimated animation="wave" size="lg" showSparkles />`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">With Hook:</h4>
            <pre className="bg-muted p-3 rounded overflow-x-auto">
{`const { animation, celebrate } = useBooviAnimation();

// Trigger celebration
celebrate();

<BooviAnimated animation={animation} size="xl" />`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Loading Screen:</h4>
            <pre className="bg-muted p-3 rounded overflow-x-auto">
{`<BooviLoadingScreen message="Finding movies..." />`}
            </pre>
          </div>
        </div>
      </Card>

      {/* Overlay Components */}
      {showLoading && (
        <BooviLoadingScreen 
          message="Demo loading..." 
        />
      )}

      {showWelcome && (
        <BooviWelcome 
          message="Welcome to the demo! 🎬"
          onComplete={() => setShowWelcome(false)}
        />
      )}

      <div className="text-center pt-8">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to App
        </Button>
      </div>
    </div>
  );
}
