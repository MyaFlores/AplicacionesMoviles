import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.pokedex',
  appName: 'PokeDex',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    Http: {
      enabled: true //Habilita el plugin CapacitorHttp
    }
  }
};

export default config;