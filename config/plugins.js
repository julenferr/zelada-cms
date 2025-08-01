module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {
          quality: '100',            // 👈 Explícitamente calidad máxima
          use_filename: true,        // Usa nombre original
          unique_filename: false,    // No genera nombres únicos
          overwrite: false,          // No sobrescribe
          fetch_format: 'auto'       // Mantiene formato original
        },
        delete: {},
      },
      mimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'video/mp4'
      ],
      breakpoints: [],
    },
  },
});
