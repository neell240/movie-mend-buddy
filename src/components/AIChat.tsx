import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send } from "lucide-react";
import { usePreferences } from "@/hooks/usePreferences";
import { useNavigate } from "react-router-dom";
import { MovieCard } from "@/components/MovieCard";
import { TMDBMovie } from "@/types/tmdb";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  movies?: TMDBMovie[];
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { preferences } = usePreferences();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

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
    // Auto-send the suggestion
    setTimeout(() => {
      const syntheticInput = suggestion;
      setInput("");
      const userMessage: Message = { role: "user", content: syntheticInput };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = assistantContent;
                return newMessages;
              });
            }
          } catch (e) {
            console.error("Error parsing SSE:", e);
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
              const movieResponse = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tmdb-details`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                  },
                  body: JSON.stringify({ movieId: id }),
                }
              );
              if (movieResponse.ok) {
                const movieData = await movieResponse.json();
                movies.push(movieData);
              }
            } catch (e) {
              console.error("Error fetching movie:", e);
            }
          })
        );

        setMessages(prev => {
          const newMessages = [...prev];
          const cleanContent = assistantContent.replace(/\[MOVIE:\d+\]/g, '').trim();
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: cleanContent,
            movies: movies.length > 0 ? movies : undefined
          };
          return newMessages;
        });
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
    <div className="bg-card rounded-2xl border border-border flex flex-col h-[600px]">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold">AI Assistant</h2>
          <p className="text-xs text-muted-foreground">Ask for movie recommendations</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            Hi! What kind of movie are you in the mood for today?
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className="space-y-3">
            <div
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
            {message.movies && message.movies.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {message.movies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted">
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-2 space-y-1">
                      <h3 className="font-semibold text-sm line-clamp-1">{movie.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                        <span>•</span>
                        <span className="uppercase">{movie.original_language}</span>
                      </div>
                      {movie.vote_average > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-medium">{movie.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border space-y-3">
        {messages.length === 0 && (
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
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
