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
  // Safe values with defaults
  const safeSyncState = syncState ?? {
    status: 'waiting' as const,
    timestamp_ms: 0,
    drift_ms: 0,
    countdownSeconds: 0,
  };
  const safeParticipants = participants ?? [];
  const safeCurrentTimestamp = currentTimestamp ?? 0;
  
  const formatTime = (ms: number | null | undefined) => {
    const safeMs = ms ?? 0;
    const seconds = Math.floor(safeMs / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hours = Math.floor(mins / 60);
    
    if (hours > 0) {
      return `${hours}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDriftMessage = () => {
    const driftMs = safeSyncState.drift_ms ?? 0;
    if (Math.abs(driftMs) < 2000) return null;
    
    const ahead = driftMs > 0;
    const seconds = Math.abs(Math.round(driftMs / 1000));
    
    return {
      type: ahead ? 'ahead' : 'behind',
      message: `You're ${seconds}s ${ahead ? 'ahead' : 'behind'}`,
      action: ahead ? 'Pause briefly to sync' : 'Skip forward to sync',
    };
  };

  const driftInfo = getDriftMessage();
  const status = safeSyncState.status ?? 'waiting';

  const getStatusText = () => {
    switch (status) {
      case 'waiting':
        return '⏳ Waiting for everyone...';
      case 'countdown':
        return `🎬 Starting in ${safeSyncState.countdownSeconds ?? 0}...`;
      case 'playing':
        return '▶️ Now playing';
      case 'paused':
        return '⏸️ Paused';
      case 'ended':
        return '🎉 Party ended!';
      default:
        return '⏳ Waiting...';
    }
  };

  const getBooviAnimation = () => {
    switch (status) {
      case 'playing':
        return 'idle';
      case 'countdown':
        return 'wave';
      case 'paused':
        return 'think';
      default:
        return 'idle';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4">
      {/* Status display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BooviAnimated animation={getBooviAnimation()} size="sm" />
          <div>
            <p className="text-sm font-medium">{getStatusText()}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(safeCurrentTimestamp)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span className="text-sm">{safeParticipants.length}</span>
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
      {status === 'countdown' && (
        <div className="text-center py-4">
          <p className="text-6xl font-bold text-primary animate-pulse">
            {safeSyncState.countdownSeconds ?? 0}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Press PLAY on your streaming app when it hits 0!
          </p>
        </div>
      )}

      {/* Host controls */}
      {isHost && (
        <div className="flex items-center justify-center gap-2">
          {status === 'waiting' && (
            <Button
              onClick={onStartCountdown}
              disabled={!allReady}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {allReady ? 'Start Countdown' : 'Waiting for everyone to be ready'}
            </Button>
          )}

          {(status === 'playing' || status === 'paused') && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onSeek(Math.max(0, safeCurrentTimestamp - 10000))}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              {status === 'playing' ? (
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
                onClick={() => onSeek(safeCurrentTimestamp + 10000)}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )}

      {/* Non-host instructions */}
      {!isHost && status === 'playing' && (
        <p className="text-center text-sm text-muted-foreground">
          Follow the host's controls in your streaming app
        </p>
      )}
    </div>
  );
};

export default PartyControls;
