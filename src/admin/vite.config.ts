// admin/vite.config.ts

import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    optimizeDeps: {
      // Evita que Vite intente empacar estos chunks cuyo hash cambia en cada build
      exclude: [
        'HomePage',
        'ListViewPage',
        'Login',
        'constants',
      ],
    },
  });
};
