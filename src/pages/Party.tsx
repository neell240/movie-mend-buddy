import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import PartyHome from '@/components/party/PartyHome';
import PartyRoomEnhanced from '@/components/party/PartyRoomEnhanced';
import { PartyRoom as PartyRoomType, useParty } from '@/hooks/useParty';
import { Snowfall } from '@/components/christmas/Snowfall';
import { useSeasonal } from '@/hooks/useChristmasMode';

const Party = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentRoom, setCurrentRoom] = useState<PartyRoomType | null>(null);
  const { isChristmas, showSnowfall } = useSeasonal();
  
  // Check for room code in URL
  const codeFromUrl = searchParams.get('code');
  const { joinByCode } = useParty();

  // Auto-join if code in URL
  useEffect(() => {
    if (codeFromUrl && !currentRoom) {
      joinByCode(codeFromUrl).then((room) => {
        if (room) {
          setCurrentRoom(room);
          // Clean up URL
          navigate('/party', { replace: true });
        }
      });
    }
  }, [codeFromUrl, currentRoom, joinByCode, navigate]);

  const handleRoomCreated = (room: PartyRoomType) => {
    setCurrentRoom(room);
  };

  const handleRoomJoined = (room: PartyRoomType) => {
    setCurrentRoom(room);
  };

  const handleLeave = () => {
    setCurrentRoom(null);
  };

  return (
    <>
      {isChristmas && <Snowfall enabled={showSnowfall} />}
      
      {currentRoom ? (
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
    </>
  );
};

export default Party;
