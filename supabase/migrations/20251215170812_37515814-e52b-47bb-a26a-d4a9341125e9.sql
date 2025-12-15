-- Create party rooms table
CREATE TABLE public.party_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID NOT NULL,
  room_code TEXT NOT NULL UNIQUE,
  movie_id INTEGER NOT NULL,
  movie_title TEXT NOT NULL,
  movie_poster TEXT,
  status TEXT NOT NULL DEFAULT 'waiting', -- waiting, countdown, playing, paused, ended
  current_timestamp_ms BIGINT NOT NULL DEFAULT 0,
  playback_speed NUMERIC(3,2) NOT NULL DEFAULT 1.0,
  started_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create party participants table
CREATE TABLE public.party_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.party_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  username TEXT,
  avatar_url TEXT,
  is_ready BOOLEAN NOT NULL DEFAULT false,
  is_buffering BOOLEAN NOT NULL DEFAULT false,
  last_timestamp_ms BIGINT NOT NULL DEFAULT 0,
  last_heartbeat TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Create party messages table
CREATE TABLE public.party_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.party_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  is_reaction BOOLEAN NOT NULL DEFAULT false,
  movie_timestamp_ms BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.party_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_messages ENABLE ROW LEVEL SECURITY;

-- Party rooms policies
CREATE POLICY "Anyone can view party rooms" ON public.party_rooms FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create rooms" ON public.party_rooms FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Host can update room" ON public.party_rooms FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Host can delete room" ON public.party_rooms FOR DELETE USING (auth.uid() = host_id);

-- Party participants policies
CREATE POLICY "Anyone can view participants" ON public.party_participants FOR SELECT USING (true);
CREATE POLICY "Authenticated users can join" ON public.party_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their participation" ON public.party_participants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can leave party" ON public.party_participants FOR DELETE USING (auth.uid() = user_id);

-- Party messages policies
CREATE POLICY "Participants can view messages" ON public.party_messages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.party_participants WHERE room_id = party_messages.room_id AND user_id = auth.uid()));
CREATE POLICY "Participants can send messages" ON public.party_messages FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.party_participants WHERE room_id = party_messages.room_id AND user_id = auth.uid()));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.party_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.party_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.party_messages;

-- Update timestamp trigger
CREATE TRIGGER update_party_rooms_updated_at
  BEFORE UPDATE ON public.party_rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Generate unique room code function
CREATE OR REPLACE FUNCTION public.generate_room_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;