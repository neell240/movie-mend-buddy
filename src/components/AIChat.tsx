import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MovieCard } from "@/components/MovieCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePreferences } from "@/hooks/usePreferences";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { TMDBMovie } from "@/types/tmdb";
import { BooviAnimated } from "@/components/BooviAnimated";

interface Message {
  role: "user" | "assistant";
  content: string;
  movies?: TMDBMovie[];
  emotionalState?: "celebrating" | "sympathetic" | "excited" | "focused";
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMovies, setIsFetchingMovies] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { preferences } = usePreferences();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Check for query parameter from ChatWidget/HeroCTA
  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setPendingQuery(query);
      // Clear the query from URL to prevent re-sending on refresh
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Send pending query once conversation is ready
  useEffect(() => {
    if (pendingQuery && conversationId && !isLoading) {
      const query = pendingQuery;
      setPendingQuery(null);
      
      // Send the message
      const userMessage: Message = { role: "user", content: query };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      setShowWelcome(false);

      // Save user message and get AI response
      supabase.from("messages").insert([{
        conversation_id: conversationId,
        role: "user",
        content: query,
      }]).then(() => {
        handleAIResponse([...messages, userMessage]);
      });
    }
  }, [pendingQuery, conversationId, isLoading]);

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

  // Note: We intentionally do NOT restrict to a hardcoded "verified" list.
  // The backend emits real TMDB ids, and we fetch details from TMDB to render the cards.
  // (We still validate IDs are numeric before fetching.)


  const detectEmotionalState = (content: string): "celebrating" | "sympathetic" | "excited" | "focused" => {
    const lowerContent = content.toLowerCase();
    
    // Excited state - IMDb mentions, bold ratings, urgent words
    if (lowerContent.includes('imdb') || lowerContent.includes('top-tier') || 
        lowerContent.includes('must-watch') || lowerContent.includes('blockbuster incoming')) {
      return "excited";
    }
    
    // Sympathetic state - empathy, no results, suggestions
    if (lowerContent.includes('aww') || lowerContent.includes('no reels matched') ||
        lowerContent.includes('try a different') || lowerContent.includes('want me to try')) {
      return "sympathetic";
    }
    
    // Celebrating state - popcorn, 3D glasses, success words
    if (lowerContent.includes('popcorn') || lowerContent.includes('3d glasses') ||
        lowerContent.includes('found') || lowerContent.includes('blockbuster batch')) {
      return "celebrating";
    }
    
    // Default to focused
    return "focused";
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

      const emotionalState = detectEmotionalState(assistantContent);
      
      const movieMatches = assistantContent.match(/\[MOVIE:(\d+)\]/g);
      if (movieMatches) {
        const movieIds = [...new Set(
          movieMatches
            .map((m) => m.match(/\d+/)?.[0])
            .filter(Boolean)
        )]
          .map((id) => parseInt(id as string, 10))
          .filter((id) => Number.isFinite(id) && id > 0)
          .slice(0, 6);

        // Show loading state for movie fetching
        setIsFetchingMovies(true);

        // Clean the content immediately so user sees the text
        setMessages((prev) => {
          const newMessages = [...prev];
          const cleanContent = assistantContent.replace(/\[MOVIE:\d+\]/g, "").trim();
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.content = cleanContent;
            lastMessage.emotionalState = emotionalState;
          }
          return newMessages;
        });

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
                console.warn(`Movie ID ${id} not found in TMDB (${response.status})`);
              }
            } catch (error) {
              console.error(`Failed to fetch movie ${id}:`, error);
            }
          })
        );

        // Update with movies
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.movies = movies;
          }
          return newMessages;
        });
        
        setIsFetchingMovies(false);

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
        // Update with emotional state
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.emotionalState = emotionalState;
          }
          return newMessages;
        });
        
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
      setIsFetchingMovies(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area - scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2 sm:gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10">
                <BooviAnimated 
                  animation={
                    message.emotionalState === "celebrating" ? "celebrate" :
                    message.emotionalState === "excited" ? "jump" :
                    message.emotionalState === "focused" ? "think" :
                    "idle"
                  }
                  size="sm"
                />
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/80 border border-border shadow-sm"
              }`}
            >
              <p className={`whitespace-pre-wrap leading-relaxed text-sm sm:text-[15px] ${
                message.role === "assistant" 
                  ? "text-secondary-foreground font-medium" 
                  : ""
              }`}>{message.content}</p>
              {message.movies && message.movies.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
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
        {(isLoading || isFetchingMovies) && (
          <div className="flex gap-2 sm:gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10">
              <BooviAnimated animation="think" size="sm" />
            </div>
            <Card className="p-2 sm:p-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs sm:text-sm text-muted-foreground">
                {isFetchingMovies ? "Finding movies..." : "Thinking..."}
              </span>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - fixed at bottom */}
      <div className="shrink-0 p-3 sm:p-4 border-t border-border space-y-2 sm:space-y-3 bg-background">
        {messages.length <= 1 && showWelcome && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="whitespace-nowrap text-[11px] sm:text-xs shrink-0 h-8 px-2.5 sm:px-3 hover:bg-primary/10 hover:text-primary hover:border-primary/50 active:scale-95 transition-transform"
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
            className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading || !input.trim()}
            className="h-10 sm:h-11 px-4 sm:px-6 active:scale-95 transition-transform"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};
