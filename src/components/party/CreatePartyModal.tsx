import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Sparkles, TreePine, Loader2, Check, MessageCircle, Heart, Mic, Copy, Share2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParty, PartyRoom } from '@/hooks/useParty';
import { useSearchMovies, useTrendingMovies } from '@/hooks/useTMDB';
import { useSeasonal } from '@/hooks/useChristmasMode';
import { ChristmasBoovi } from '@/components/christmas/ChristmasBoovi';
import { useDebounce } from '@/hooks/useDebounce';
import { BooviAnimated } from '@/components/BooviAnimated';
import { useToast } from '@/hooks/use-toast';

interface CreatePartyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomCreated: (room: PartyRoom) => void;
}

interface SelectedMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
}

type Step = 'select' | 'settings' | 'invite';

const CreatePartyModal = ({ open, onOpenChange, onRoomCreated }: CreatePartyModalProps) => {
  const { createRoom } = useParty();
  const { isChristmas } = useSeasonal();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('select');
  const [selectedMovie, setSelectedMovie] = useState<SelectedMovie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<PartyRoom | null>(null);
  const [copied, setCopied] = useState(false);

  // Settings
  const [enableChat, setEnableChat] = useState(true);
  const [enableReactions, setEnableReactions] = useState(true);
  const [enableVoice, setEnableVoice] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);
  const { data: searchResults, isLoading: isSearching } = useSearchMovies(debouncedQuery);
  const { data: trendingData } = useTrendingMovies();

  const handleSelectMovie = (movie: SelectedMovie) => {
    setSelectedMovie(movie);
  };

  const handleCreateParty = async () => {
    if (!selectedMovie) return;

    setIsCreating(true);
    const room = await createRoom(
      selectedMovie.id,
      selectedMovie.title,
      selectedMovie.poster_path || undefined
    );
    setIsCreating(false);

    if (room) {
      setCreatedRoom(room);
      setStep('invite');
    }
  };

  const handleCopyCode = async () => {
    if (!createdRoom) return;
    await navigator.clipboard.writeText(createdRoom.room_code);
    setCopied(true);
    toast({ title: 'Code copied! 📋' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    if (!createdRoom) return;
    const link = `${window.location.origin}/party?code=${createdRoom.room_code}`;
    await navigator.clipboard.writeText(link);
    toast({ title: 'Link copied! 🔗' });
  };

  const handleShare = async () => {
    if (!createdRoom) return;
    const link = `${window.location.origin}/party?code=${createdRoom.room_code}`;
    
    if (navigator.share) {
      await navigator.share({
        title: `Join my movie party: ${createdRoom.movie_title}`,
        text: `Join me to watch ${createdRoom.movie_title} together!`,
        url: link,
      });
    } else {
      handleCopyLink();
    }
  };

  const handleEnterRoom = () => {
    if (createdRoom) {
      onRoomCreated(createdRoom);
      onOpenChange(false);
      resetModal();
    }
  };

  const resetModal = () => {
    setStep('select');
    setSelectedMovie(null);
    setSearchQuery('');
    setCreatedRoom(null);
  };

  const handleClose = (open: boolean) => {
    if (!open) resetModal();
    onOpenChange(open);
  };

  const MovieCard = ({ movie }: { movie: SelectedMovie }) => {
    const isSelected = selectedMovie?.id === movie.id;
    
    return (
      <motion.button
        onClick={() => handleSelectMovie(movie)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative flex items-center gap-3 p-3 rounded-xl w-full text-left transition-all ${
          isSelected 
            ? 'bg-primary/20 ring-2 ring-primary' 
            : 'bg-card hover:bg-secondary'
        }`}
      >
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
            alt={movie.title}
            className="w-12 h-18 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-18 rounded-lg bg-muted" />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{movie.title}</p>
          <p className="text-sm text-muted-foreground">
            {movie.release_date?.split('-')[0] || 'Unknown'}
          </p>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-3 bg-primary rounded-full p-1"
          >
            <Check className="w-4 h-4 text-primary-foreground" />
          </motion.div>
        )}
      </motion.button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden p-0">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Movie */}
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <DialogHeader className="p-6 pb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {isChristmas ? (
                      <ChristmasBoovi size="sm" variant="happy" />
                    ) : (
                      <BooviAnimated animation="celebrate" size="sm" />
                    )}
                  </motion.div>
                  <div>
                    <DialogTitle>Create a Watch Party</DialogTitle>
                    <p className="text-sm text-muted-foreground">Let's pick a movie!</p>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="search" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3 mx-6 mb-4" style={{ width: 'calc(100% - 48px)' }}>
                  <TabsTrigger value="search" className="gap-1 text-xs">
                    <Search className="w-3 h-3" /> Search
                  </TabsTrigger>
                  <TabsTrigger value="suggested" className="gap-1 text-xs">
                    <Sparkles className="w-3 h-3" /> Popular
                  </TabsTrigger>
                  {isChristmas && (
                    <TabsTrigger value="christmas" className="gap-1 text-xs">
                      <TreePine className="w-3 h-3" /> Holiday
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="search" className="flex-1 px-6 mt-0">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for a movie..."
                      className="pl-10"
                    />
                  </div>

                  <ScrollArea className="h-[280px]">
                    <div className="space-y-2 pr-4">
                      {isSearching ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      ) : searchResults?.results?.length ? (
                        searchResults.results.slice(0, 10).map((movie) => (
                          <MovieCard key={movie.id} movie={movie} />
                        ))
                      ) : searchQuery ? (
                        <p className="text-center py-8 text-muted-foreground">
                          No movies found
                        </p>
                      ) : null}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="suggested" className="flex-1 px-6 mt-0">
                  <ScrollArea className="h-[320px]">
                    <div className="space-y-2 pr-4">
                      {trendingData?.results?.slice(0, 10).map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {isChristmas && (
                  <TabsContent value="christmas" className="flex-1 px-6 mt-0">
                    <ScrollArea className="h-[320px]">
                      <div className="space-y-2 pr-4">
                        {/* Christmas movies - these would come from a special API call */}
                        <p className="text-center py-8 text-muted-foreground">
                          Search for holiday favorites! 🎄
                        </p>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                )}
              </Tabs>

              <div className="p-6 pt-4 border-t">
                <Button
                  onClick={() => setStep('settings')}
                  disabled={!selectedMovie}
                  className="w-full"
                  size="lg"
                >
                  {selectedMovie ? `Continue with "${selectedMovie.title}"` : 'Select a movie'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Settings */}
          {step === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <DialogHeader className="mb-6">
                <DialogTitle>Party Settings</DialogTitle>
              </DialogHeader>

              {/* Selected Movie Preview */}
              <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl mb-6">
                {selectedMovie?.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w154${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    className="w-16 h-24 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-bold">{selectedMovie?.title}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    Opens in your streaming app
                  </p>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="chat" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    Enable Chat
                  </Label>
                  <Switch
                    id="chat"
                    checked={enableChat}
                    onCheckedChange={setEnableChat}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="reactions" className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary" />
                    Enable Reactions
                  </Label>
                  <Switch
                    id="reactions"
                    checked={enableReactions}
                    onCheckedChange={setEnableReactions}
                  />
                </div>

                <div className="flex items-center justify-between opacity-50">
                  <Label htmlFor="voice" className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-muted-foreground" />
                    Voice Chat
                    <span className="text-xs text-muted-foreground">(coming soon)</span>
                  </Label>
                  <Switch
                    id="voice"
                    checked={enableVoice}
                    onCheckedChange={setEnableVoice}
                    disabled
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('select')} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleCreateParty}
                  disabled={isCreating}
                  className="flex-1"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Party'
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Invite */}
          {step === 'invite' && createdRoom && (
            <motion.div
              key="invite"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 text-center"
            >
              {/* Confetti animation would go here */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mb-4"
              >
                {isChristmas ? (
                  <ChristmasBoovi size="lg" variant="excited" className="mx-auto" />
                ) : (
                  <BooviAnimated animation="celebrate" size="xl" className="mx-auto" showSparkles />
                )}
              </motion.div>

              <DialogTitle className="text-2xl mb-2">Your Party Is Ready! 🎉</DialogTitle>
              <p className="text-muted-foreground mb-6">
                Share this with friends to join your party
              </p>

              {/* Room Code */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-secondary rounded-2xl p-6 mb-6"
              >
                <p className="text-sm text-muted-foreground mb-2">Party Code</p>
                <p className="text-4xl font-mono font-bold tracking-widest text-primary">
                  {createdRoom.room_code}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  variant="outline"
                  onClick={handleCopyCode}
                  className="gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>

              <Button onClick={handleEnterRoom} size="lg" className="w-full">
                Enter Party Room
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePartyModal;
