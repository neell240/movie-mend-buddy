import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('🎬 Back online! Loading fresh content...', {
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.info('📡 You\'re offline. Showing cached content.', {
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-warning/90 backdrop-blur-sm text-warning-foreground px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shadow-lg">
      <WifiOff className="h-4 w-4" />
      <span>Offline Mode - Viewing cached content</span>
    </div>
  );
};
