import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fea22bb3ec134fa4b1f60dd9dc8dd40d',
  appName: 'movie-mend-buddy',
  webDir: 'dist',
  server: {
    url: 'https://fea22bb3-ec13-4fa4-b1f6-0dd9dc8dd40d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
