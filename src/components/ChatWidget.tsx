import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSeasonal } from "@/hooks/useChristmasMode";
import { ChristmasBoovi } from "@/components/christmas/ChristmasBoovi";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "Recommend a cozy family movie",
  "Find a heist movie like Now You See Me",
  "Something funny for movie night",
  "A feel-good Christmas classic",
];

export const ChatWidget = () => {
  const navigate = useNavigate();
  const { isChristmas } = useSeasonal();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: isChristmas 
        ? "Hey! 🎄 I'm Boovi, your Christmas movie buddy! What kind of movie are you in the mood for today?"
        : "Hey! 👻 I'm Boovi, your movie buddy! What kind of movie are you in the mood for?",
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    
    // Navigate to full AI chat with the query
    navigate(`/ai-chat?query=${encodeURIComponent(input)}`);
    setInput("");
    setIsOpen(false);
  };

  const handleQuickPrompt = (prompt: string) => {
    navigate(`/ai-chat?query=${encodeURIComponent(prompt)}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating trigger button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-24 lg:bottom-6 right-4 z-50"
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className={`group flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all ${
                isChristmas
                  ? "bg-gradient-to-r from-[hsl(355,72%,45%)] to-[hsl(355,72%,40%)] hover:from-[hsl(355,72%,50%)] hover:to-[hsl(355,72%,45%)] text-white"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
              style={{
                boxShadow: isChristmas 
                  ? "0 8px 30px -8px hsl(355 72% 45% / 0.6)"
                  : "0 8px 30px -8px hsl(var(--primary) / 0.4)",
              }}
            >
              {isChristmas ? (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20">
                  <ChristmasBoovi size="sm" showGlow={false} animate={false} />
                </div>
              ) : (
                <MessageCircle className="w-5 h-5" />
              )}
              <span className="font-semibold text-sm whitespace-nowrap">Ask Boovi</span>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[hsl(42,85%,65%)]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`fixed bottom-0 lg:bottom-24 right-0 lg:right-4 w-full lg:w-[380px] z-50 rounded-t-3xl lg:rounded-2xl overflow-hidden shadow-2xl ${
                isChristmas
                  ? "bg-gradient-to-b from-[hsl(355,45%,15%)] to-[hsl(355,50%,12%)] border border-[hsl(355,40%,28%)]"
                  : "bg-card border border-border"
              }`}
              style={{
                maxHeight: "80vh",
              }}
            >
              {/* Header */}
              <div 
                className={`flex items-center justify-between p-4 border-b ${
                  isChristmas ? "border-[hsl(355,40%,25%)]" : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isChristmas ? (
                    <ChristmasBoovi size="sm" showGlow={false} animate />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xl">👻</span>
                    </div>
                  )}
                  <div>
                    <h3 className={`font-bold text-sm ${
                      isChristmas ? "text-[hsl(45,60%,96%)]" : "text-foreground"
                    }`}>
                      Chat with Boovi
                    </h3>
                    <p className={`text-xs ${
                      isChristmas ? "text-[hsl(42,45%,70%)]" : "text-muted-foreground"
                    }`}>
                      Your AI movie companion
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className={isChristmas ? "text-[hsl(45,60%,90%)] hover:bg-[hsl(355,45%,25%)]" : ""}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="h-[280px] p-4">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                          msg.role === "user"
                            ? isChristmas
                              ? "bg-[hsl(42,85%,65%)] text-[hsl(355,45%,12%)]"
                              : "bg-primary text-primary-foreground"
                            : isChristmas
                              ? "bg-[hsl(355,45%,22%)] text-[hsl(45,60%,92%)]"
                              : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick prompts */}
                <div className="mt-4 pt-4 border-t border-border/30">
                  <p className={`text-xs mb-3 ${
                    isChristmas ? "text-[hsl(42,45%,60%)]" : "text-muted-foreground"
                  }`}>
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Quick suggestions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleQuickPrompt(prompt)}
                        className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                          isChristmas
                            ? "bg-[hsl(355,45%,18%)] text-[hsl(42,45%,80%)] hover:bg-[hsl(42,85%,65%)/0.15] hover:text-[hsl(42,85%,70%)] border border-[hsl(355,40%,28%)]"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollArea>

              {/* Input */}
              <div 
                className={`p-4 border-t ${
                  isChristmas ? "border-[hsl(355,40%,25%)]" : "border-border"
                }`}
              >
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className={`flex-1 rounded-xl ${
                      isChristmas
                        ? "bg-[hsl(355,45%,18%)] border-[hsl(355,40%,28%)] text-[hsl(45,60%,96%)] placeholder:text-[hsl(42,45%,50%)] focus:border-[hsl(42,85%,65%)]"
                        : ""
                    }`}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim()}
                    className={`rounded-xl shrink-0 ${
                      isChristmas
                        ? "bg-[hsl(42,85%,65%)] hover:bg-[hsl(42,85%,70%)] text-[hsl(355,45%,15%)]"
                        : ""
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                
                <button
                  onClick={() => navigate("/ai-chat")}
                  className={`w-full mt-3 text-xs py-2 rounded-lg transition-colors ${
                    isChristmas
                      ? "text-[hsl(42,85%,65%)] hover:bg-[hsl(355,45%,20%)]"
                      : "text-primary hover:bg-secondary"
                  }`}
                >
                  Open full chat →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
