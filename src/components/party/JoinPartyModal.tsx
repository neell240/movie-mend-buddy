import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParty, PartyRoom } from '@/hooks/useParty';
import { useSeasonal } from '@/hooks/useChristmasMode';
import { ChristmasBoovi } from '@/components/christmas/ChristmasBoovi';
import { BooviAnimated } from '@/components/BooviAnimated';

interface JoinPartyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomJoined: (room: PartyRoom) => void;
}

const JoinPartyModal = ({ open, onOpenChange, onRoomJoined }: JoinPartyModalProps) => {
  const { joinByCode } = useParty();
  const { isChristmas } = useSeasonal();

  const [code, setCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (code.length < 6) {
      setError('Please enter a 6-character code');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      const room = await joinByCode(code);
      
      if (room?.id) {
        onRoomJoined(room);
        onOpenChange(false);
        setCode('');
        setError('');
      } else {
        setError('Party not found. Check the code and try again.');
      }
    } catch (err) {
      console.error('Error joining party:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCodeChange = (value: string) => {
    // Only allow uppercase letters and numbers, max 6 chars
    const sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setCode(sanitized);
    if (error) setError('');
  };

  const handleClose = (newOpen: boolean) => {
    if (!isJoining) {
      onOpenChange(newOpen);
      if (!newOpen) {
        // Reset state when closing
        setCode('');
        setError('');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6 && !isJoining) {
      handleJoin();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={isJoining ? { rotate: [0, 10, -10, 0] } : { y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: isJoining ? 0.5 : 2 }}
            >
              {isChristmas ? (
                <ChristmasBoovi size="sm" variant={isJoining ? "excited" : "happy"} />
              ) : (
                <BooviAnimated animation={isJoining ? "loading" : "wave"} size="sm" />
              )}
            </motion.div>
            <div>
              <DialogTitle>Join a Party</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Enter the 6-character code
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Input
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ABC123"
              maxLength={6}
              className={`text-center text-3xl tracking-[0.5em] font-mono h-16 ${
                error ? 'border-destructive focus-visible:ring-destructive' : ''
              }`}
              disabled={isJoining}
              autoFocus
            />
            
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mt-2"
                >
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            onClick={handleJoin}
            disabled={code.length < 6 || isJoining}
            size="lg"
            className="w-full gap-2"
          >
            {isJoining ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                Join Party
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Ask the host for the party code or use the invite link
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinPartyModal;
