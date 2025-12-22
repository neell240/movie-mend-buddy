import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Check, ExternalLink, LogOut, Hand, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParty } from '@/hooks/useParty';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useSeasonal } from '@/hooks/useChristmasMode';
import PartyChat from './PartyChat';
import PartyControls from './PartyControls';
import PartyParticipants from './PartyParticipants';
import { ChristmasBoovi } from '@/components/christmas/ChristmasBoovi';
import { BooviAnimated } from '@/components/BooviAnimated';
import ReactionsOverlay from './ReactionsOverlay';
import BooviHost from './BooviHost';

interface PartyRoomEnhancedProps {
  roomId: string;
  onLeave: () => void;
}

const STREAMING_LINKS: Record<string, { name: string; url: string; appScheme?: string; icon: string }> = {
  netflix: {
    name: 'Netflix',
    url: 'https://www.netflix.com',
    appScheme: 'nflx://',
    icon: '🔴',
  },
  prime: {
    name: 'Prime',
    url: 'https://www.primevideo.com',
    appScheme: 'aiv://',
    icon: '🔵',
  },
  disney: {
    name: 'Disney+',
    url: 'https://www.disneyplus.com',
    appScheme: 'disneyplus://',
    icon: '✨',
  },
  hbo: {
    name: 'Max',
    url: 'https://www.max.com',
    icon: '💜',
  },
  hulu: {
    name: 'Hulu',
    url: 'https://www.hulu.com',
    appScheme: 'hulu://',
    icon: '💚',
  },
  apple: {
    name: 'Apple TV+',
    url: 'https://tv.apple.com',
    icon: '🍎',
  },
};

const PartyRoomEnhanced = ({ roomId, onLeave }: PartyRoomEnhancedProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isChristmas } = useSeasonal();
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [floatingReactions, setFloatingReactions] = useState<{ id: string; emoji: string }[]>([]);

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

    if (service.appScheme && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      window.location.href = service.appScheme;
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

  const handleReaction = async (emoji: string) => {
    await sendReaction(emoji);
    // Add floating reaction
    const id = Math.random().toString(36);
    setFloatingReactions(prev => [...prev, { id, emoji }]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  // Simulate timestamp updates
  useEffect(() => {
    if (syncState.status !== 'playing') return;

    const interval = setInterval(() => {
      updateLocalTimestamp(localTimestamp + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [syncState.status, localTimestamp, updateLocalTimestamp]);

  // Listen for reactions from messages
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.is_reaction && latestMessage.user_id !== user?.id) {
      const id = Math.random().toString(36);
      setFloatingReactions(prev => [...prev, { id, emoji: latestMessage.content }]);
      setTimeout(() => {
        setFloatingReactions(prev => prev.filter(r => r.id !== id));
      }, 2000);
    }
  }, [messages, user?.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {isChristmas ? (
            <ChristmasBoovi size="lg" variant="excited" />
          ) : (
            <BooviAnimated animation="loading" size="xl" />
          )}
        </motion.div>
        <p className="mt-4 text-muted-foreground">Loading party...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        {isChristmas ? (
          <ChristmasBoovi size="lg" variant="cozy" />
        ) : (
          <BooviAnimated animation="think" size="xl" />
        )}
        <p className="mt-4 text-muted-foreground">Party not found</p>
        <Button onClick={onLeave} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Reactions Overlay */}
      <ReactionsOverlay reactions={floatingReactions} />
      
      {/* Boovi Host */}
      <BooviHost 
        syncState={syncState}
        participantCount={participants.length}
        isHost={isHost || false}
      />

      {/* Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur border-b"
        style={isChristmas ? {
          background: "linear-gradient(to right, hsl(355 50% 18% / 0.95), hsl(355 45% 15% / 0.95))",
          borderColor: "hsl(355 40% 28%)",
        } : {
          background: "hsl(var(--background) / 0.95)",
          borderColor: "hsl(var(--border))",
        }}
      >
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={handleLeave}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="text-center">
            <div className="flex items-center gap-2 justify-center">
              <Badge 
                variant="outline" 
                className="font-mono text-lg tracking-widest px-3 py-1"
              >
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
            <div className="flex items-center gap-1 justify-center mt-1">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {participants.length} watching
              </span>
              {syncState.status === 'playing' && (
                <Badge variant="destructive" className="ml-2 text-xs animate-pulse">
                  LIVE
                </Badge>
              )}
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={handleLeave}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4 pb-24 lg:pb-8">
        {/* Movie Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-4 rounded-2xl border p-4 ${
            isChristmas 
              ? 'bg-[hsl(355,40%,18%)] border-[hsl(355,40%,25%)]' 
              : 'bg-card border-border'
          }`}
        >
          {room.movie_poster && (
            <img
              src={`https://image.tmdb.org/t/p/w154${room.movie_poster}`}
              alt={room.movie_title}
              className="w-20 h-30 rounded-xl object-cover shadow-lg"
            />
          )}
          <div className="flex-1">
            <h2 className="font-bold text-lg">{room.movie_title}</h2>
            <p className="text-sm text-muted-foreground">
              {isHost ? "You're hosting this party! 🎬" : "Waiting for host to start..."}
            </p>
          </div>
        </motion.div>

        {/* Platform Selector */}
        <AnimatePresence>
          {syncState.status === 'waiting' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`rounded-2xl border p-4 ${
                isChristmas 
                  ? 'bg-[hsl(355,40%,18%)] border-[hsl(355,40%,25%)]' 
                  : 'bg-card border-border'
              }`}
            >
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Open your streaming app:
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(STREAMING_LINKS).map(([key, service]) => (
                  <motion.div key={key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={selectedPlatform === key ? 'default' : 'outline'}
                      size="sm"
                      className="w-full gap-1"
                      onClick={() => openStreamingApp(key)}
                    >
                      <span>{service.icon}</span>
                      <span className="text-xs">{service.name}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Find "{room.movie_title}" and get ready to press play!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ready Button */}
        {syncState.status === 'waiting' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={toggleReady}
              variant={currentParticipant?.is_ready ? 'secondary' : 'default'}
              size="lg"
              className="w-full gap-2 h-14 text-lg"
            >
              <Hand className="h-5 w-5" />
              {currentParticipant?.is_ready ? "I'm Ready! ✅" : "Tap when ready"}
            </Button>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-4">
          {/* Controls + Participants */}
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

          {/* Chat */}
          <div className="lg:col-span-1 h-[400px] lg:h-[600px] mt-4 lg:mt-0">
            <PartyChat
              messages={messages}
              onSendMessage={sendMessage}
              onSendReaction={handleReaction}
              currentUserId={user?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyRoomEnhanced;
