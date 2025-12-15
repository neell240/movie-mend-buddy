import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import PartyLobby from '@/components/party/PartyLobby';
import PartyRoom from '@/components/party/PartyRoom';
import { PartyRoom as PartyRoomType, useParty } from '@/hooks/useParty';

const Party = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentRoom, setCurrentRoom] = useState<PartyRoomType | null>(null);
  
  // Check for room code in URL
  const codeFromUrl = searchParams.get('code');
  const { joinByCode } = useParty();

  // Check for movie selection from search page
  const movieId = searchParams.get('movieId');
  const movieTitle = searchParams.get('movieTitle');
  const moviePoster = searchParams.get('moviePoster');

  const selectedMovie = movieId && movieTitle ? {
    id: parseInt(movieId),
    title: movieTitle,
    poster: moviePoster || undefined,
  } : undefined;

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
    // Clean up URL params
    navigate('/party', { replace: true });
  };

  const handleRoomJoined = (room: PartyRoomType) => {
    setCurrentRoom(room);
  };

  const handleLeave = () => {
    setCurrentRoom(null);
  };

  return (
    <>
      {currentRoom ? (
        <PartyRoom roomId={currentRoom.id} onLeave={handleLeave} />
      ) : (
        <div className="min-h-screen bg-background pb-24 lg:pb-8">
          <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border p-4">
            <h1 className="text-xl font-bold text-center">🎉 Party Mode</h1>
          </header>

          <div className="p-4 mt-8">
            <PartyLobby
              onRoomCreated={handleRoomCreated}
              onRoomJoined={handleRoomJoined}
              selectedMovie={selectedMovie}
            />
          </div>

          <BottomNav />
        </div>
      )}
    </>
  );
};

export default Party;
