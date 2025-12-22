import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Users, Clock, Film, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSeasonal } from '@/hooks/useChristmasMode';
import { ChristmasBoovi } from '@/components/christmas/ChristmasBoovi';
import { BooviAnimated } from '@/components/BooviAnimated';
import { PartyRoom } from '@/hooks/useParty';
import { formatDistanceToNow } from 'date-fns';
import CreatePartyModal from './CreatePartyModal';
import JoinPartyModal from './JoinPartyModal';

interface PartyHomeProps {
  onRoomCreated: (room: PartyRoom) => void;
  onRoomJoined: (room: PartyRoom) => void;
}

const PartyHome = ({ onRoomCreated, onRoomJoined }: PartyHomeProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isChristmas } = useSeasonal();
  const [recentParties, setRecentParties] = useState<PartyRoom[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [booviMessage, setBooviMessage] = useState("Ready to watch together? 🎬");

  // Boovi messages rotation
  useEffect(() => {
    const messages = [
      "Ready to watch together? 🎬",
      "Movie night is better with friends! 🍿",
      "Let's start a party! 🎉",
      "Pick a movie and invite your crew! 👻",
      isChristmas ? "Holiday movie marathon time! 🎄" : "What are we watching tonight? 🌙",
    ];
    
    const interval = setInterval(() => {
      setBooviMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isChristmas]);

  // Fetch recent parties
  useEffect(() => {
    if (!user) return;

    const fetchRecentParties = async () => {
      const { data } = await supabase
        .from('party_rooms')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        setRecentParties(data as PartyRoom[]);
      }
    };

    fetchRecentParties();
  }, [user]);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {isChristmas ? (
            <ChristmasBoovi size="lg" variant="santa" />
          ) : (
            <BooviAnimated animation="wave" size="xl" />
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <h2 className="text-2xl font-bold mb-2">Sign in to Party! 🎉</h2>
          <p className="text-muted-foreground mb-6">
            Create a free account to watch movies with friends
          </p>
          <Button onClick={() => navigate('/auth')} size="lg" className="gap-2">
            <Ghost className="w-5 h-5" />
            Sign In
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8"
        >
          {/* Floating Boovi */}
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="mb-6"
          >
            {isChristmas ? (
              <ChristmasBoovi size="lg" variant="excited" className="mx-auto" />
            ) : (
              <BooviAnimated animation="celebrate" size="xl" className="mx-auto" showSparkles />
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2"
          >
            Party Mode
          </motion.h1>
          
          <AnimatePresence mode="wait">
            <motion.p
              key={booviMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-muted-foreground text-lg"
            >
              {booviMessage}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setShowCreateModal(true)}
              size="lg"
              className={`w-full h-24 flex-col gap-2 rounded-2xl text-lg ${
                isChristmas 
                  ? 'bg-gradient-to-br from-[hsl(355,60%,45%)] to-[hsl(355,50%,35%)] hover:from-[hsl(355,60%,50%)] hover:to-[hsl(355,50%,40%)]'
                  : ''
              }`}
            >
              <Plus className="w-6 h-6" />
              Create Party
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setShowJoinModal(true)}
              variant="outline"
              size="lg"
              className={`w-full h-24 flex-col gap-2 rounded-2xl text-lg ${
                isChristmas 
                  ? 'border-[hsl(355,40%,30%)] hover:bg-[hsl(355,40%,20%)]'
                  : ''
              }`}
            >
              <Users className="w-6 h-6" />
              Join with Code
            </Button>
          </motion.div>
        </motion.div>

        {/* Recent Parties Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Your Recent Parties
          </h3>

          {recentParties.length > 0 ? (
            <div className="space-y-3">
              {recentParties.map((party, index) => (
                <motion.div
                  key={party.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className={`overflow-hidden ${isChristmas ? 'border-[hsl(355,40%,25%)]' : ''}`}>
                    <CardContent className="p-0">
                      <div className="flex items-center gap-4 p-4">
                        {party.movie_poster ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${party.movie_poster}`}
                            alt={party.movie_title}
                            className="w-12 h-18 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-18 rounded-lg bg-muted flex items-center justify-center">
                            <Film className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{party.movie_title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(party.created_at), { addSuffix: true })}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            party.status === 'ended' 
                              ? 'bg-muted text-muted-foreground' 
                              : 'bg-primary/20 text-primary'
                          }`}>
                            {party.status === 'ended' ? 'Ended' : 'Active'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`text-center py-12 rounded-2xl border-2 border-dashed ${
                isChristmas ? 'border-[hsl(355,40%,25%)]' : 'border-border'
              }`}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {isChristmas ? (
                  <ChristmasBoovi size="sm" variant="popcorn" className="mx-auto mb-3" />
                ) : (
                  <BooviAnimated animation="idle" size="md" className="mx-auto mb-3" />
                )}
              </motion.div>
              <p className="text-muted-foreground">No parties yet!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first watch party
              </p>
            </motion.div>
          )}
        </motion.section>
      </motion.div>

      {/* Modals */}
      <CreatePartyModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onRoomCreated={onRoomCreated}
      />
      
      <JoinPartyModal
        open={showJoinModal}
        onOpenChange={setShowJoinModal}
        onRoomJoined={onRoomJoined}
      />
    </>
  );
};

export default PartyHome;
