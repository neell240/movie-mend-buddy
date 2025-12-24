import { BottomNav } from "@/components/BottomNav";
import { AIChat } from "@/components/AIChat";

const AIPage = () => {
  return (
    <div className="h-[100dvh] flex flex-col pb-16 lg:pb-0 lg:pt-16">
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border lg:top-16 shrink-0">
        <div className="max-w-4xl mx-auto px-3 py-3 sm:px-4 sm:py-4">
          <h1 className="text-lg sm:text-xl font-bold">Chat with Boovi 👻</h1>
        </div>
      </header>

      <main className="flex-1 overflow-hidden max-w-4xl mx-auto w-full">
        <AIChat />
      </main>

      <BottomNav />
    </div>
  );
};

export default AIPage;
