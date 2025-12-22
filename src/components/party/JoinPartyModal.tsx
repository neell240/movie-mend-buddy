import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
    if (code.length < 6) return;

    setIsJoining(true);
    setError('');

    const room = await joinByCode(code);
    
    setIsJoining(false);

    if (room) {
      onRoomJoined(room);
      onOpenChange(false);
      setCode('');
    } else {
      setError('Party not found. Check the code and try again.');
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6));
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              placeholder="ABC123"
              maxLength={6}
              className="text-center text-3xl tracking-[0.5em] font-mono h-16"
              disabled={isJoining}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive mt-2 text-center"
              >
                {error}
              </motion.p>
            )}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinPartyModal;
