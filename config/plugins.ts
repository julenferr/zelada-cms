// config/plugins.ts
export default ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 100000000, // 100 MB
        uploadPath: 'public/uploads',
      },
      mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
    },
  },
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
});
