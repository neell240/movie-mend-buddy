import { BottomNav } from "@/components/BottomNav";
import { AIChat } from "@/components/AIChat";

const AIPage = () => {
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Chat with Boovi 👻</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <AIChat />
      </main>

      <BottomNav />
    </div>
  );
};

export default AIPage;
