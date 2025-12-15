import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, ArrowRight, Film, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useParty, PartyRoom } from '@/hooks/useParty';
import { useAuth } from '@/hooks/useAuth';
import { BooviAnimated } from '@/components/BooviAnimated';

interface PartyLobbyProps {
  onRoomCreated: (room: PartyRoom) => void;
  onRoomJoined: (room: PartyRoom) => void;
  selectedMovie?: {
    id: number;
    title: string;
    poster?: string;
  };
}

const PartyLobby = ({ onRoomCreated, onRoomJoined, selectedMovie }: PartyLobbyProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createRoom, joinByCode } = useParty();
  
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCreate = async () => {
    if (!selectedMovie) {
      // Navigate to search to select a movie
      navigate('/search?partyMode=true');
      return;
    }

    setIsCreating(true);
    const room = await createRoom(
      selectedMovie.id,
      selectedMovie.title,
      selectedMovie.poster
    );
    setIsCreating(false);

    if (room) {
      onRoomCreated(room);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;

    setIsJoining(true);
    const room = await joinByCode(joinCode.trim());
    setIsJoining(false);

    if (room) {
      onRoomJoined(room);
    }
  };

  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <BooviAnimated animation="wave" size="lg" className="mx-auto mb-4" />
          <CardTitle>Sign in to Party! 🎉</CardTitle>
          <CardDescription>
            Create a free account to watch movies with friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/auth')} className="w-full">
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <BooviAnimated animation="celebrate" size="lg" className="mx-auto mb-4" />
        <CardTitle className="flex items-center justify-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Party Mode
        </CardTitle>
        <CardDescription>
          Watch movies together with friends, synced in real-time!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Party</TabsTrigger>
            <TabsTrigger value="join">Join Party</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 mt-4">
            {selectedMovie ? (
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                {selectedMovie.poster && (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${selectedMovie.poster}`}
                    alt={selectedMovie.title}
                    className="w-12 h-18 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{selectedMovie.title}</p>
                  <p className="text-xs text-muted-foreground">Selected for party</p>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-dashed border-border rounded-lg text-center">
                <Film className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Select a movie first to create a party
                </p>
              </div>
            )}

            <Button
              onClick={handleCreate}
              className="w-full gap-2"
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {selectedMovie ? 'Create Party Room' : 'Select a Movie'}
            </Button>
          </TabsContent>

          <TabsContent value="join" className="space-y-4 mt-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Enter the 6-character party code:
              </p>
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
              />
            </div>

            <Button
              onClick={handleJoin}
              className="w-full gap-2"
              disabled={joinCode.length < 6 || isJoining}
            >
              {isJoining ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              Join Party
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PartyLobby;
