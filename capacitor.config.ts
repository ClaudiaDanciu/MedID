
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.claudiadanciu.sympaplus',
  appName: 'SYMPA+',
  webDir: 'dist',
  plugins: {
    Camera: {
      permissions: ['camera']
    }
  }
};

export default config;