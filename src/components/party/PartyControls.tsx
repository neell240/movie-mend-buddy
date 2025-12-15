import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Clock, Users, Loader2 } from 'lucide-react';
import { SyncState, PartyParticipant } from '@/hooks/useParty';
import { BooviAnimated } from '@/components/BooviAnimated';

interface PartyControlsProps {
  syncState: SyncState;
  isHost: boolean;
  allReady: boolean;
  anyBuffering: boolean;
  participants: PartyParticipant[];
  onStartCountdown: () => void;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (ms: number) => void;
  currentTimestamp: number;
}

const PartyControls = ({
  syncState,
  isHost,
  allReady,
  anyBuffering,
  participants,
  onStartCountdown,
  onPlay,
  onPause,
  onSeek,
  currentTimestamp,
}: PartyControlsProps) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hours = Math.floor(mins / 60);
    
    if (hours > 0) {
      return `${hours}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDriftMessage = () => {
    if (Math.abs(syncState.drift_ms) < 2000) return null;
    
    const ahead = syncState.drift_ms > 0;
    const seconds = Math.abs(Math.round(syncState.drift_ms / 1000));
    
    return {
      type: ahead ? 'ahead' : 'behind',
      message: `You're ${seconds}s ${ahead ? 'ahead' : 'behind'}`,
      action: ahead ? 'Pause briefly to sync' : 'Skip forward to sync',
    };
  };

  const driftInfo = getDriftMessage();

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4">
      {/* Status display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
        <BooviAnimated 
            animation={
              syncState.status === 'playing' ? 'idle' :
              syncState.status === 'countdown' ? 'wave' :
              syncState.status === 'paused' ? 'think' : 'idle'
            } 
            size="sm" 
          />
          <div>
            <p className="text-sm font-medium">
              {syncState.status === 'waiting' && '⏳ Waiting for everyone...'}
              {syncState.status === 'countdown' && `🎬 Starting in ${syncState.countdownSeconds}...`}
              {syncState.status === 'playing' && '▶️ Now playing'}
              {syncState.status === 'paused' && '⏸️ Paused'}
              {syncState.status === 'ended' && '🎉 Party ended!'}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(currentTimestamp)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span className="text-sm">{participants.length}</span>
          {anyBuffering && (
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
          )}
        </div>
      </div>

      {/* Drift warning */}
      {driftInfo && (
        <div className={`p-3 rounded-lg ${driftInfo.type === 'ahead' ? 'bg-yellow-500/20' : 'bg-orange-500/20'}`}>
          <p className="text-sm font-medium">{driftInfo.message}</p>
          <p className="text-xs text-muted-foreground">{driftInfo.action}</p>
        </div>
      )}

      {/* Countdown overlay effect */}
      {syncState.status === 'countdown' && (
        <div className="text-center py-4">
          <p className="text-6xl font-bold text-primary animate-pulse">
            {syncState.countdownSeconds}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Press PLAY on your streaming app when it hits 0!
          </p>
        </div>
      )}

      {/* Host controls */}
      {isHost && (
        <div className="flex items-center justify-center gap-2">
          {syncState.status === 'waiting' && (
            <Button
              onClick={onStartCountdown}
              disabled={!allReady}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {allReady ? 'Start Countdown' : 'Waiting for everyone to be ready'}
            </Button>
          )}

          {(syncState.status === 'playing' || syncState.status === 'paused') && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onSeek(Math.max(0, currentTimestamp - 10000))}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              {syncState.status === 'playing' ? (
                <Button size="icon" onClick={onPause}>
                  <Pause className="h-4 w-4" />
                </Button>
              ) : (
                <Button size="icon" onClick={onPlay}>
                  <Play className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => onSeek(currentTimestamp + 10000)}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )}

      {/* Non-host instructions */}
      {!isHost && syncState.status === 'playing' && (
        <p className="text-center text-sm text-muted-foreground">
          Follow the host's controls in your streaming app
        </p>
      )}
    </div>
  );
};

export default PartyControls;
