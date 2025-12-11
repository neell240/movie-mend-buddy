-- Add premium flag to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_premium boolean NOT NULL DEFAULT false;

-- Add is_admin flag for dev testing access
ALTER TABLE public.profiles 
ADD COLUMN is_admin boolean NOT NULL DEFAULT false;