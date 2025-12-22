import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeasonal } from '@/hooks/useChristmasMode';
import { ChristmasBoovi } from '@/components/christmas/ChristmasBoovi';
import { BooviAnimated } from '@/components/BooviAnimated';
import { SyncState } from '@/hooks/useParty';

interface BooviHostProps {
  syncState: SyncState;
  participantCount: number;
  isHost: boolean;
}

const MESSAGES = {
  waiting: [
    "Getting everyone ready! 🍿",
    "Who's bringing the snacks?",
    "Movie time soon!",
  ],
  countdown: [
    "Here we go!",
    "Press play when I say GO!",
    "Everyone ready?",
  ],
  playing: [
    "Shhh... movie's on!",
    "This part is good!",
    "I love this scene!",
  ],
  paused: [
    "Quick break!",
    "Snack time? 🍿",
    "BRB or bathroom break?",
  ],
  ended: [
    "That was amazing!",
    "What did you think?",
    "Another one? 🎬",
  ],
};

const BooviHost = ({ syncState, participantCount, isHost }: BooviHostProps) => {
  const { isChristmas } = useSeasonal();
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [lastStatus, setLastStatus] = useState(syncState.status);

  // Update message on status change
  useEffect(() => {
    if (syncState.status !== lastStatus) {
      const messages = MESSAGES[syncState.status] || MESSAGES.waiting;
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
      setShowMessage(true);
      setLastStatus(syncState.status);

      // Hide message after a few seconds
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [syncState.status, lastStatus]);

  // Countdown messages
  useEffect(() => {
    if (syncState.status === 'countdown' && syncState.countdownSeconds > 0) {
      if (syncState.countdownSeconds === 1) {
        setMessage("GO! 🎬");
      } else {
        setMessage(`${syncState.countdownSeconds}...`);
      }
      setShowMessage(true);
    }
  }, [syncState.status, syncState.countdownSeconds]);

  // Random messages during movie
  useEffect(() => {
    if (syncState.status !== 'playing') return;

    const interval = setInterval(() => {
      // Only show random messages occasionally
      if (Math.random() > 0.7) {
        const messages = MESSAGES.playing;
        setMessage(messages[Math.floor(Math.random() * messages.length)]);
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [syncState.status]);

  const getBooviAnimation = () => {
    switch (syncState.status) {
      case 'countdown':
        return 'celebrate';
      case 'playing':
        return 'idle';
      case 'paused':
        return 'think';
      case 'ended':
        return 'wave';
      default:
        return 'wave';
    }
  };

  const getBooviVariant = () => {
    switch (syncState.status) {
      case 'countdown':
        return 'excited';
      case 'playing':
        return 'popcorn';
      case 'paused':
        return 'cozy';
      case 'ended':
        return 'happy';
      default:
        return 'happy';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-24 left-4 z-40 flex items-end gap-2"
    >
      {/* Boovi */}
      <motion.div
        animate={syncState.status === 'countdown' ? { 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        } : {
          y: [0, -5, 0]
        }}
        transition={{ repeat: Infinity, duration: syncState.status === 'countdown' ? 0.5 : 2 }}
      >
        {isChristmas ? (
          <ChristmasBoovi size="sm" variant={getBooviVariant()} showGlow={false} />
        ) : (
          <BooviAnimated animation={getBooviAnimation()} size="sm" />
        )}
      </motion.div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -10 }}
            className="relative bg-card border border-border rounded-2xl px-4 py-2 shadow-lg max-w-[200px]"
          >
            {/* Speech bubble tail */}
            <div className="absolute -left-2 bottom-3 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-card border-b-8 border-b-transparent" />
            <p className="text-sm font-medium">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BooviHost;
