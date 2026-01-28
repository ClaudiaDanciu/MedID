
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cdd216a026f645838c70f80577ecc33d',
  appName: 'health-flow-sympa-ai',
  webDir: 'dist',
  server: {
    url: 'https://cdd216a0-26f6-4583-8c70-f80577ecc33d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF'
    }
  }
};

export default config;
