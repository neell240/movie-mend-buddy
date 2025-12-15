import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Crown, Clock } from 'lucide-react';
import { PartyParticipant } from '@/hooks/useParty';
import { formatDistanceToNow } from 'date-fns';

interface PartyParticipantsProps {
  participants: PartyParticipant[];
  hostId: string;
  currentUserId?: string;
}

const PartyParticipants = ({ participants, hostId, currentUserId }: PartyParticipantsProps) => {
  const isStale = (heartbeat: string) => {
    const lastBeat = new Date(heartbeat).getTime();
    const now = Date.now();
    return now - lastBeat > 10000; // 10 seconds
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
        <Crown className="h-4 w-4 text-yellow-500" />
        Party Members ({participants.length})
      </h3>
      
      <div className="space-y-2">
        {participants.map((participant) => {
          const isHost = participant.user_id === hostId;
          const isYou = participant.user_id === currentUserId;
          const stale = isStale(participant.last_heartbeat);

          return (
            <div
              key={participant.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                stale ? 'opacity-50' : ''
              } ${isYou ? 'bg-secondary/50' : ''}`}
            >
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {participant.username?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                {isHost && (
                  <Crown className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {participant.username || 'Anonymous'}
                  {isYou && <span className="text-muted-foreground"> (you)</span>}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(participant.last_heartbeat), { addSuffix: true })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {participant.is_buffering && (
                  <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                )}
                
                {participant.is_ready ? (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    <Check className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Waiting
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PartyParticipants;
