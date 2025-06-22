// config/plugins.ts
export default ({ env }) => ({
  // si usás upload, mantené SOLO esa parte; si no, quedate con export default () => ({}).
  upload: {
    config: {
      providerOptions: {},
      mimeTypes: ['image/jpeg','image/png','image/gif','video/mp4'],
    },
  },
});
