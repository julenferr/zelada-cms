// config/plugins.ts
export default ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 100000000, // 10 MB — podés subirlo a 20 MB si usás GIFs
        uploadPath: 'public/uploads',
      },
      mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
    },
  },
});
