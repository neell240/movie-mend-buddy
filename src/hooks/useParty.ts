import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface PartyRoom {
  id: string;
  host_id: string;
  room_code: string;
  movie_id: number;
  movie_title: string;
  movie_poster: string | null;
  status: 'waiting' | 'countdown' | 'playing' | 'paused' | 'ended';
  current_timestamp_ms: number;
  playback_speed: number;
  started_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartyParticipant {
  id: string;
  room_id: string;
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  is_ready: boolean;
  is_buffering: boolean;
  last_timestamp_ms: number;
  last_heartbeat: string;
  joined_at: string;
}

export interface PartyMessage {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  content: string;
  is_reaction: boolean;
  movie_timestamp_ms: number | null;
  created_at: string;
}

export interface SyncState {
  status: 'waiting' | 'countdown' | 'playing' | 'paused' | 'ended';
  timestamp_ms: number;
  drift_ms: number;
  countdownSeconds: number;
}

const HEARTBEAT_INTERVAL = 3000; // 3 seconds
const DRIFT_THRESHOLD_MS = 2000; // 2 seconds before showing alert
const SYNC_CORRECTION_THRESHOLD_MS = 5000; // 5 seconds before forcing resync

export const useParty = (roomId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [room, setRoom] = useState<PartyRoom | null>(null);
  const [participants, setParticipants] = useState<PartyParticipant[]>([]);
  const [messages, setMessages] = useState<PartyMessage[]>([]);
  const [syncState, setSyncState] = useState<SyncState>({
    status: 'waiting',
    timestamp_ms: 0,
    drift_ms: 0,
    countdownSeconds: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [localTimestamp, setLocalTimestamp] = useState(0);
  
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const syncRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Generate a unique room code
  const generateRoomCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Create a new party room
  const createRoom = async (movieId: number, movieTitle: string, moviePoster?: string) => {
    if (!user) {
      toast({ title: 'Please sign in to create a party', variant: 'destructive' });
      return null;
    }

    const roomCode = generateRoomCode();
    
    const { data, error } = await supabase
      .from('party_rooms')
      .insert({
        host_id: user.id,
        room_code: roomCode,
        movie_id: movieId,
        movie_title: movieTitle,
        movie_poster: moviePoster || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating room:', error);
      toast({ title: 'Failed to create party room', variant: 'destructive' });
      return null;
    }

    // Auto-join as host
    await joinRoom(data.id);
    
    return data as PartyRoom;
  };

  // Join an existing room
  const joinRoom = async (roomIdToJoin: string) => {
    if (!user) {
      toast({ title: 'Please sign in to join a party', variant: 'destructive' });
      return false;
    }

    const { error } = await supabase
      .from('party_participants')
      .upsert({
        room_id: roomIdToJoin,
        user_id: user.id,
        username: user.email?.split('@')[0] || 'Anonymous',
        avatar_url: null,
        is_ready: false,
        is_buffering: false,
        last_timestamp_ms: 0,
        last_heartbeat: new Date().toISOString(),
      }, {
        onConflict: 'room_id,user_id',
      });

    if (error) {
      console.error('Error joining room:', error);
      toast({ title: 'Failed to join party', variant: 'destructive' });
      return false;
    }

    return true;
  };

  // Join by room code
  const joinByCode = async (code: string) => {
    const { data, error } = await supabase
      .from('party_rooms')
      .select('*')
      .eq('room_code', code.toUpperCase())
      .maybeSingle();

    if (error || !data) {
      toast({ title: 'Party not found. Check the code and try again.', variant: 'destructive' });
      return null;
    }

    const joined = await joinRoom(data.id);
    return joined ? (data as PartyRoom) : null;
  };

  // Leave the room
  const leaveRoom = async () => {
    if (!user || !roomId) return;

    await supabase
      .from('party_participants')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', user.id);

    // Clear intervals
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    if (syncRef.current) clearInterval(syncRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  // Toggle ready status
  const toggleReady = async () => {
    if (!user || !roomId) return;

    const currentParticipant = participants.find(p => p.user_id === user.id);
    if (!currentParticipant) return;

    await supabase
      .from('party_participants')
      .update({ is_ready: !currentParticipant.is_ready })
      .eq('room_id', roomId)
      .eq('user_id', user.id);
  };

  // Update buffering state
  const setBuffering = async (isBuffering: boolean) => {
    if (!user || !roomId) return;

    await supabase
      .from('party_participants')
      .update({ is_buffering: isBuffering })
      .eq('room_id', roomId)
      .eq('user_id', user.id);
  };

  // Update local timestamp (call this from player)
  const updateLocalTimestamp = (timestampMs: number) => {
    setLocalTimestamp(timestampMs);
  };

  // Host controls: Start countdown
  const startCountdown = async (seconds: number = 5) => {
    if (!user || !room || room.host_id !== user.id) return;

    await supabase
      .from('party_rooms')
      .update({ 
        status: 'countdown',
        current_timestamp_ms: 0,
      })
      .eq('id', room.id);

    setSyncState(prev => ({ ...prev, status: 'countdown', countdownSeconds: seconds }));
  };

  // Host controls: Play
  const play = async () => {
    if (!user || !room || room.host_id !== user.id) return;

    await supabase
      .from('party_rooms')
      .update({ 
        status: 'playing',
        started_at: room.started_at || new Date().toISOString(),
      })
      .eq('id', room.id);
  };

  // Host controls: Pause
  const pause = async () => {
    if (!user || !room || room.host_id !== user.id) return;

    await supabase
      .from('party_rooms')
      .update({ 
        status: 'paused',
        current_timestamp_ms: localTimestamp,
      })
      .eq('id', room.id);
  };

  // Host controls: Seek
  const seek = async (timestampMs: number) => {
    if (!user || !room || room.host_id !== user.id) return;

    await supabase
      .from('party_rooms')
      .update({ current_timestamp_ms: timestampMs })
      .eq('id', room.id);
  };

  // Host controls: End party
  const endParty = async () => {
    if (!user || !room || room.host_id !== user.id) return;

    await supabase
      .from('party_rooms')
      .update({ status: 'ended' })
      .eq('id', room.id);
  };

  // Send a chat message
  const sendMessage = async (content: string, isReaction: boolean = false) => {
    if (!user || !roomId) return;

    await supabase
      .from('party_messages')
      .insert({
        room_id: roomId,
        user_id: user.id,
        username: user.email?.split('@')[0] || 'Anonymous',
        content,
        is_reaction: isReaction,
        movie_timestamp_ms: localTimestamp,
      });
  };

  // Send an emoji reaction
  const sendReaction = async (emoji: string) => {
    await sendMessage(emoji, true);
  };

  // Heartbeat: Update last_heartbeat and timestamp
  const sendHeartbeat = useCallback(async () => {
    if (!user || !roomId) return;

    await supabase
      .from('party_participants')
      .update({
        last_heartbeat: new Date().toISOString(),
        last_timestamp_ms: localTimestamp,
      })
      .eq('room_id', roomId)
      .eq('user_id', user.id);
  }, [user, roomId, localTimestamp]);

  // Calculate drift from host
  const calculateDrift = useCallback(() => {
    if (!room || room.status !== 'playing') return 0;
    
    const hostTimestamp = room.current_timestamp_ms;
    const drift = localTimestamp - hostTimestamp;
    return drift;
  }, [room, localTimestamp]);

  // Fetch room data
  const fetchRoom = useCallback(async () => {
    if (!roomId) return;

    const { data, error } = await supabase
      .from('party_rooms')
      .select('*')
      .eq('id', roomId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching room:', error);
      return;
    }

    if (data) {
      setRoom(data as PartyRoom);
      setSyncState(prev => ({
        ...prev,
        status: data.status as SyncState['status'],
        timestamp_ms: data.current_timestamp_ms,
      }));
    }
  }, [roomId]);

  // Fetch participants
  const fetchParticipants = useCallback(async () => {
    if (!roomId) return;

    const { data, error } = await supabase
      .from('party_participants')
      .select('*')
      .eq('room_id', roomId)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('Error fetching participants:', error);
      return;
    }

    setParticipants((data || []) as PartyParticipant[]);
  }, [roomId]);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!roomId) return;

    const { data, error } = await supabase
      .from('party_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages((data || []) as PartyMessage[]);
  }, [roomId]);

  // Initial fetch and realtime subscription
  useEffect(() => {
    if (!roomId) {
      setIsLoading(false);
      return;
    }

    const init = async () => {
      setIsLoading(true);
      await Promise.all([fetchRoom(), fetchParticipants(), fetchMessages()]);
      setIsLoading(false);
    };

    init();

    // Subscribe to room changes
    const roomChannel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'party_rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setRoom(payload.new as PartyRoom);
            setSyncState(prev => ({
              ...prev,
              status: (payload.new as PartyRoom).status as SyncState['status'],
              timestamp_ms: (payload.new as PartyRoom).current_timestamp_ms,
            }));
          }
        }
      )
      .subscribe();

    // Subscribe to participant changes
    const participantsChannel = supabase
      .channel(`participants:${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'party_participants', filter: `room_id=eq.${roomId}` },
        () => {
          fetchParticipants();
        }
      )
      .subscribe();

    // Subscribe to messages
    const messagesChannel = supabase
      .channel(`messages:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'party_messages', filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as PartyMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(participantsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [roomId, fetchRoom, fetchParticipants, fetchMessages]);

  // Heartbeat interval
  useEffect(() => {
    if (!roomId || !user) return;

    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [roomId, user, sendHeartbeat]);

  // Calculate drift periodically
  useEffect(() => {
    if (!room || room.status !== 'playing') return;

    syncRef.current = setInterval(() => {
      const drift = calculateDrift();
      setSyncState(prev => ({ ...prev, drift_ms: drift }));

      // Show warning if drift is too high
      if (Math.abs(drift) > DRIFT_THRESHOLD_MS) {
        const ahead = drift > 0;
        toast({
          title: ahead ? "You're ahead! ⏩" : "You're behind! ⏪",
          description: `${Math.abs(Math.round(drift / 1000))}s ${ahead ? 'ahead' : 'behind'} the host. ${ahead ? 'Pause briefly' : 'Skip forward'} to sync.`,
        });
      }
    }, 5000);

    return () => {
      if (syncRef.current) clearInterval(syncRef.current);
    };
  }, [room, calculateDrift, toast]);

  // Countdown handler
  useEffect(() => {
    if (syncState.status !== 'countdown' || syncState.countdownSeconds <= 0) return;

    countdownRef.current = setInterval(() => {
      setSyncState(prev => {
        if (prev.countdownSeconds <= 1) {
          if (room && user && room.host_id === user.id) {
            play();
          }
          return { ...prev, countdownSeconds: 0 };
        }
        return { ...prev, countdownSeconds: prev.countdownSeconds - 1 };
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [syncState.status, syncState.countdownSeconds, room, user]);

  const isHost = room && user && room.host_id === user.id;
  const allReady = participants.length > 0 && participants.every(p => p.is_ready);
  const anyBuffering = participants.some(p => p.is_buffering);

  return {
    // State
    room,
    participants,
    messages,
    syncState,
    isLoading,
    localTimestamp,
    isHost,
    allReady,
    anyBuffering,
    
    // Actions
    createRoom,
    joinRoom,
    joinByCode,
    leaveRoom,
    toggleReady,
    setBuffering,
    updateLocalTimestamp,
    startCountdown,
    play,
    pause,
    seek,
    endParty,
    sendMessage,
    sendReaction,
  };
};
