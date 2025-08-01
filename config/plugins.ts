export default ({ env }) => {
  console.log('⚙️ Plugin Cloudinary cargado con configuración personalizada');

  return {
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDINARY_NAME'),
          api_key: env('CLOUDINARY_KEY'),
          api_secret: env('CLOUDINARY_SECRET')
        },
        actionOptions: {
          upload: {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
            fetch_format: 'auto',
            transformation: [
              { quality: '100' }
            ]
          },
          delete: {}
        },
        mimeTypes: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          'video/mp4'
        ],
        breakpoints: []
      }
    },
    'users-permissions': {
      config: {
        jwtSecret: env('JWT_SECRET')
      }
    }
  };
};
