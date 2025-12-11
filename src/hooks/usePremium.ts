import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface PremiumStatus {
  isPremium: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

export const usePremium = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<PremiumStatus>({
    isPremium: false,
    isAdmin: false,
    isLoading: true,
  });

  const fetchPremiumStatus = useCallback(async () => {
    if (!user) {
      setStatus({ isPremium: false, isAdmin: false, isLoading: false });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium, is_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setStatus({
        isPremium: data?.is_premium ?? false,
        isAdmin: data?.is_admin ?? false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching premium status:', error);
      setStatus({ isPremium: false, isAdmin: false, isLoading: false });
    }
  }, [user]);

  useEffect(() => {
    fetchPremiumStatus();
  }, [fetchPremiumStatus]);

  const togglePremium = async (enabled: boolean) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: enabled })
        .eq('id', user.id);

      if (error) throw error;

      setStatus(prev => ({ ...prev, isPremium: enabled }));
      return true;
    } catch (error) {
      console.error('Error toggling premium:', error);
      return false;
    }
  };

  const setAdminStatus = async (enabled: boolean) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: enabled })
        .eq('id', user.id);

      if (error) throw error;

      setStatus(prev => ({ ...prev, isAdmin: enabled }));
      return true;
    } catch (error) {
      console.error('Error setting admin status:', error);
      return false;
    }
  };

  return {
    ...status,
    togglePremium,
    setAdminStatus,
    refresh: fetchPremiumStatus,
  };
};
