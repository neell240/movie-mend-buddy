import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import PartyHome from '@/components/party/PartyHome';
import PartyRoomEnhanced from '@/components/party/PartyRoomEnhanced';
import PartyErrorBoundary from '@/components/party/PartyErrorBoundary';
import PartyLoading from '@/components/party/PartyLoading';
import PartyNotFound from '@/components/party/PartyNotFound';
import { PartyRoom as PartyRoomType, useParty } from '@/hooks/useParty';
import { Snowfall } from '@/components/christmas/Snowfall';
import { useSeasonal } from '@/hooks/useChristmasMode';

type PartyState = 'idle' | 'loading' | 'joining' | 'joined' | 'not-found' | 'error';

const Party = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentRoom, setCurrentRoom] = useState<PartyRoomType | null>(null);
  const [partyState, setPartyState] = useState<PartyState>('idle');
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const { isChristmas, showSnowfall } = useSeasonal();
  
  // Check for room code in URL
  const codeFromUrl = searchParams.get('code');
  const { joinByCode } = useParty();

  // Auto-join if code in URL
  useEffect(() => {
    const handleAutoJoin = async () => {
      if (codeFromUrl && partyState === 'idle' && !currentRoom) {
        setPartyState('joining');
        setJoinCode(codeFromUrl);
        
        try {
          const room = await joinByCode(codeFromUrl);
          
          if (room) {
            setCurrentRoom(room);
            setPartyState('joined');
            // Clean up URL
            navigate('/party', { replace: true });
          } else {
            setPartyState('not-found');
          }
        } catch (error) {
          console.error('Error joining party:', error);
          setPartyState('error');
        }
      }
    };

    handleAutoJoin();
  }, [codeFromUrl, partyState, currentRoom, joinByCode, navigate]);

  const handleRoomCreated = useCallback((room: PartyRoomType) => {
    if (room?.id) {
      setCurrentRoom(room);
      setPartyState('joined');
    }
  }, []);

  const handleRoomJoined = useCallback((room: PartyRoomType) => {
    if (room?.id) {
      setCurrentRoom(room);
      setPartyState('joined');
    }
  }, []);

  const handleLeave = useCallback(() => {
    setCurrentRoom(null);
    setPartyState('idle');
    setJoinCode(null);
  }, []);

  const handleRetry = useCallback(() => {
    setPartyState('idle');
    setJoinCode(null);
    setCurrentRoom(null);
  }, []);

  // Render loading state for URL-based join
  if (partyState === 'joining') {
    return (
      <>
        {isChristmas && <Snowfall enabled={showSnowfall} />}
        <PartyLoading message="Joining party..." />
      </>
    );
  }

  // Render party not found
  if (partyState === 'not-found') {
    return (
      <>
        {isChristmas && <Snowfall enabled={showSnowfall} />}
        <PartyNotFound onGoBack={handleRetry} code={joinCode || undefined} />
      </>
    );
  }

  // Render error state
  if (partyState === 'error') {
    return (
      <>
        {isChristmas && <Snowfall enabled={showSnowfall} />}
        <PartyNotFound onGoBack={handleRetry} code={joinCode || undefined} />
      </>
    );
  }

  return (
    <PartyErrorBoundary onReset={handleRetry}>
      {isChristmas && <Snowfall enabled={showSnowfall} />}
      
      {currentRoom?.id ? (
        <PartyRoomEnhanced roomId={currentRoom.id} onLeave={handleLeave} />
      ) : (
        <div className="min-h-screen bg-background pb-24 lg:pb-8">
          <header 
            className="sticky top-0 z-50 backdrop-blur border-b p-4"
            style={isChristmas ? {
              background: "linear-gradient(to right, hsl(355 50% 18% / 0.95), hsl(355 45% 15% / 0.95))",
              borderColor: "hsl(355 40% 28%)",
            } : {
              background: "hsl(var(--background) / 0.95)",
              borderColor: "hsl(var(--border))",
            }}
          >
            <h1 className="text-xl font-bold text-center">🎬 Party Mode</h1>
            <p className="text-sm text-muted-foreground text-center">Watch together. React together.</p>
          </header>

          <div className="p-4">
            <PartyHome
              onRoomCreated={handleRoomCreated}
              onRoomJoined={handleRoomJoined}
            />
          </div>

          <BottomNav />
        </div>
      )}
    </PartyErrorBoundary>
  );
};

export default Party;
