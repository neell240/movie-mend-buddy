import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MovieCard } from "@/components/MovieCard";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "@/hooks/usePreferences";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { TMDBMovie } from "@/types/tmdb";
import booviAvatar from "@/assets/boovi-avatar.png";

interface Message {
  role: "user" | "assistant";
  content: string;
  movies?: TMDBMovie[];
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { preferences } = usePreferences();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and load conversation
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Load or create conversation
      const { data: conversations, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", session.user.id)
        .order("updated_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error loading conversation:", error);
        return;
      }

      if (conversations && conversations.length > 0) {
        const conv = conversations[0];
        setConversationId(conv.id);
        setShowWelcome(false);
        
        // Load messages
        const { data: msgs } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: true });

        if (msgs) {
          setMessages(msgs.map(m => ({
            role: m.role as "user" | "assistant",
            content: m.content,
            movies: m.movies ? (m.movies as any[]) as TMDBMovie[] : undefined,
          })));
        }
      } else {
        // Create new conversation with welcome message
        const { data: newConv, error: convError } = await supabase
          .from("conversations")
          .insert({ user_id: session.user.id, title: "New Chat" })
          .select()
          .single();

        if (convError) {
          console.error("Error creating conversation:", convError);
          return;
        }

        setConversationId(newConv.id);

        // Add welcome message
        const welcomeMsg: Message = {
          role: "assistant",
          content: `Boo! 👻 I'm Boovi, your cute movie recommender ghost! Welcome to MovieMend!\n\nHere's what I can help you with:\n\n🎬 **Get Personalized Movie Recommendations** - Just tell me what you're in the mood for!\n\n🔍 **Search & Filter** - Find movies by genre, rating, or streaming platform\n\n📝 **Create Your Watchlist** - Save movies you want to watch later\n\n⚙️ **Set Your Preferences** - Tell me your favorite genres, languages, and streaming services\n\nTry asking me something like "I want an action movie tonight" or "Show me family-friendly picks"! What kind of movie are you looking for today? 🍿`,
        };

        setMessages([welcomeMsg]);
        
        // Save welcome message to DB
        await supabase.from("messages").insert([{
          conversation_id: newConv.id,
          role: "assistant",
          content: welcomeMsg.content,
        }]);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !conversationId) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowWelcome(false);

    // Save user message
    await supabase.from("messages").insert([{
      conversation_id: conversationId,
      role: "user",
      content: input,
    }]);

    await handleAIResponse([...messages, userMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickSuggestions = [
    "Action movies tonight",
    "Family-friendly picks",
    "Romantic comedies",
    "Hidden gems from the 90s",
    "Award-winning films",
    "Thriller movies like Inception",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
      const syntheticInput = suggestion;
      setInput("");
      const userMessage: Message = { role: "user", content: syntheticInput };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      setShowWelcome(false);
      
      // Save user message
      if (conversationId) {
        supabase.from("messages").insert([{
          conversation_id: conversationId,
          role: "user",
          content: syntheticInput,
        }]);
      }
      
      handleAIResponse([...messages, userMessage]);
    }, 0);
  };

  const handleAIResponse = async (conversationMessages: Message[]) => {
    let assistantContent = "";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: conversationMessages,
            userPreferences: preferences,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let buffer = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim() || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;

          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;

            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === "assistant") {
                  lastMessage.content = assistantContent;
                }
                return newMessages;
              });
            }
          } catch (e) {
            console.error("Failed to parse SSE data:", e);
          }
        }
      }

      const movieMatches = assistantContent.match(/\[MOVIE:(\d+)\]/g);
      if (movieMatches) {
        const movieIds = [...new Set(movieMatches.map(m => m.match(/\d+/)?.[0]).filter(Boolean))];
        const movies: TMDBMovie[] = [];
        
        await Promise.all(
          movieIds.map(async (id) => {
            try {
              const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tmdb-details?id=${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                  },
                }
              );
              
              if (response.ok) {
                const movie = await response.json();
                movies.push(movie);
              } else {
                console.warn(`Movie ID ${id} not found in TMDB (404)`);
              }
            } catch (error) {
              console.error(`Failed to fetch movie ${id}:`, error);
            }
          })
        );

        setMessages(prev => {
          const newMessages = [...prev];
          const cleanContent = assistantContent.replace(/\[MOVIE:\d+\]/g, '').trim();
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.content = cleanContent;
            lastMessage.movies = movies;
          }
          return newMessages;
        });

        // Save assistant message with movies
        if (conversationId) {
          await supabase.from("messages").insert([{
            conversation_id: conversationId,
            role: "assistant",
            content: assistantContent.replace(/\[MOVIE:\d+\]/g, '').trim(),
            movies: movies as any,
          }]);
        }
      } else {
        // Save assistant message without movies
        if (conversationId) {
          await supabase.from("messages").insert([{
            conversation_id: conversationId,
            role: "assistant",
            content: assistantContent,
          }]);
        }
      }
    } catch (error) {
      console.error("AI chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get AI response");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8">
                <img src={booviAvatar} alt="Boovi" className="w-full h-full" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.movies && message.movies.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {message.movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8">
              <img src={booviAvatar} alt="Boovi" className="w-full h-full" />
            </div>
            <Card className="p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border space-y-3">
        {messages.length <= 1 && showWelcome && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="whitespace-nowrap text-xs shrink-0 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="Ask Boovi anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};
