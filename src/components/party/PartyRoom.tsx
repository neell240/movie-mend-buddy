import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Check, ExternalLink, LogOut, Hand } from 'lucide-react';
import { useParty } from '@/hooks/useParty';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import PartyChat from './PartyChat';
import PartyControls from './PartyControls';
import PartyParticipants from './PartyParticipants';
import { BooviAnimated } from '@/components/BooviAnimated';

interface PartyRoomProps {
  roomId: string;
  onLeave: () => void;
}

const STREAMING_LINKS: Record<string, { name: string; url: string; appScheme?: string }> = {
  netflix: {
    name: 'Netflix',
    url: 'https://www.netflix.com',
    appScheme: 'nflx://',
  },
  prime: {
    name: 'Prime Video',
    url: 'https://www.primevideo.com',
    appScheme: 'aiv://',
  },
  disney: {
    name: 'Disney+',
    url: 'https://www.disneyplus.com',
    appScheme: 'disneyplus://',
  },
  hbo: {
    name: 'Max',
    url: 'https://www.max.com',
  },
  hulu: {
    name: 'Hulu',
    url: 'https://www.hulu.com',
    appScheme: 'hulu://',
  },
  apple: {
    name: 'Apple TV+',
    url: 'https://tv.apple.com',
  },
};

const PartyRoom = ({ roomId, onLeave }: PartyRoomProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const {
    room,
    participants,
    messages,
    syncState,
    isLoading,
    localTimestamp,
    isHost,
    allReady,
    anyBuffering,
    toggleReady,
    leaveRoom,
    startCountdown,
    play,
    pause,
    seek,
    sendMessage,
    sendReaction,
    updateLocalTimestamp,
  } = useParty(roomId);

  const currentParticipant = participants.find(p => p.user_id === user?.id);

  const copyRoomCode = async () => {
    if (!room) return;
    
    try {
      await navigator.clipboard.writeText(room.room_code);
      setCopied(true);
      toast({ title: 'Room code copied! 📋' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  const openStreamingApp = (platform: string) => {
    const service = STREAMING_LINKS[platform];
    if (!service) return;

    setSelectedPlatform(platform);

    // Try to open app first on mobile
    if (service.appScheme && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      window.location.href = service.appScheme;
      // Fallback to web after delay
      setTimeout(() => {
        window.open(service.url, '_blank');
      }, 1000);
    } else {
      window.open(service.url, '_blank');
    }
  };

  const handleLeave = async () => {
    await leaveRoom();
    onLeave();
  };

  // Simulate timestamp updates (in real app, this would come from player)
  useEffect(() => {
    if (syncState.status !== 'playing') return;

    const interval = setInterval(() => {
      updateLocalTimestamp(localTimestamp + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [syncState.status, localTimestamp, updateLocalTimestamp]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <BooviAnimated animation="loading" size="lg" />
        <p className="mt-4 text-muted-foreground">Loading party...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
      <BooviAnimated animation="think" size="lg" />
      <p className="mt-4 text-muted-foreground">Party not found</p>
        <Button onClick={onLeave} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={handleLeave}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="text-center">
            <h1 className="text-lg font-bold">🎬 Party Mode</h1>
            <div className="flex items-center gap-2 justify-center">
              <Badge variant="outline" className="font-mono text-lg tracking-widest">
                {room.room_code}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={copyRoomCode}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={handleLeave}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4 pb-24 lg:pb-8">
        {/* Movie info */}
        <div className="flex items-center gap-4 bg-card rounded-xl border border-border p-4">
          {room.movie_poster && (
            <img
              src={`https://image.tmdb.org/t/p/w154${room.movie_poster}`}
              alt={room.movie_title}
              className="w-20 h-30 rounded-lg object-cover"
            />
          )}
          <div className="flex-1">
            <h2 className="font-bold text-lg">{room.movie_title}</h2>
            <p className="text-sm text-muted-foreground">
              {isHost ? "You're hosting this party!" : "Waiting for host to start..."}
            </p>
          </div>
        </div>

        {/* Platform selector */}
        {syncState.status === 'waiting' && (
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-medium mb-3">Open your streaming app:</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(STREAMING_LINKS).map(([key, service]) => (
                <Button
                  key={key}
                  variant={selectedPlatform === key ? 'default' : 'outline'}
                  size="sm"
                  className="gap-1"
                  onClick={() => openStreamingApp(key)}
                >
                  <ExternalLink className="h-3 w-3" />
                  {service.name}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Find "{room.movie_title}" in your app and get ready to press play!
            </p>
          </div>
        )}

        {/* Ready button */}
        {syncState.status === 'waiting' && (
          <Button
            onClick={toggleReady}
            variant={currentParticipant?.is_ready ? 'secondary' : 'default'}
            className="w-full gap-2"
          >
            <Hand className="h-4 w-4" />
            {currentParticipant?.is_ready ? "I'm Ready! ✅" : "Tap when ready"}
          </Button>
        )}

        {/* Desktop layout */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-4">
          {/* Main controls */}
          <div className="lg:col-span-2 space-y-4">
            <PartyControls
              syncState={syncState}
              isHost={isHost || false}
              allReady={allReady}
              anyBuffering={anyBuffering}
              participants={participants}
              onStartCountdown={() => startCountdown(5)}
              onPlay={play}
              onPause={pause}
              onSeek={seek}
              currentTimestamp={localTimestamp}
            />

            <PartyParticipants
              participants={participants}
              hostId={room.host_id}
              currentUserId={user?.id}
            />
          </div>

          {/* Chat sidebar */}
          <div className="lg:col-span-1 h-[400px] lg:h-[600px] mt-4 lg:mt-0">
            <PartyChat
              messages={messages}
              onSendMessage={sendMessage}
              onSendReaction={sendReaction}
              currentUserId={user?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyRoom;
