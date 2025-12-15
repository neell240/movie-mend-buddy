import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { PartyMessage } from '@/hooks/useParty';
import { formatDistanceToNow } from 'date-fns';

interface PartyChatProps {
  messages: PartyMessage[];
  onSendMessage: (content: string) => void;
  onSendReaction: (emoji: string) => void;
  currentUserId?: string;
}

const REACTIONS = ['🔥', '😂', '😱', '❤️', '👏', '🍿', '👻', '🎬'];

const PartyChat = ({ messages, onSendMessage, onSendReaction, currentUserId }: PartyChatProps) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const formatTimestamp = (ms: number | null) => {
    if (ms === null || ms === 0) return '';
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border">
      {/* Reactions bar */}
      <div className="flex items-center gap-1 p-2 border-b border-border overflow-x-auto">
        {REACTIONS.map((emoji) => (
          <Button
            key={emoji}
            variant="ghost"
            size="sm"
            className="text-lg hover:bg-secondary px-2"
            onClick={() => onSendReaction(emoji)}
          >
            {emoji}
          </Button>
        ))}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-2">
          {messages.map((msg) => {
            const isOwn = msg.user_id === currentUserId;
            
            if (msg.is_reaction) {
              return (
                <div
                  key={msg.id}
                  className={`flex items-center gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  {!isOwn && (
                    <span className="text-xs text-muted-foreground">{msg.username}</span>
                  )}
                  <span className="text-2xl animate-bounce">{msg.content}</span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs text-muted-foreground">
                    {isOwn ? 'You' : msg.username}
                  </span>
                  {msg.movie_timestamp_ms && msg.movie_timestamp_ms > 0 && (
                    <span className="text-xs text-primary">
                      @ {formatTimestamp(msg.movie_timestamp_ms)}
                    </span>
                  )}
                </div>
                <div
                  className={`px-3 py-2 rounded-xl max-w-[80%] ${
                    isOwn
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <p className="text-sm break-words">{msg.content}</p>
                </div>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                </span>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-2 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PartyChat;
