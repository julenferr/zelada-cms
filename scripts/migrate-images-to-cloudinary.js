import 'dotenv/config';
import sqlite3 from 'sqlite3';
import path from 'path';
import cloudinary from 'cloudinary';

// Configura Cloudinary desde tu .env
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Ruta a tu base de datos local
const dbPath = path.resolve('.tmp/data.db');
const db = new sqlite3.Database(dbPath);

function uploadToCloudinary(localPath, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      localPath,
      {
        folder: 'zelada-portfolio',
        public_id: publicId,
        overwrite: true,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    );
  });
}

function getFilename(url) {
  return path.basename(url).split('.')[0];
}

async function migrate() {
  console.log('📦 Buscando imágenes locales para subir a Cloudinary...');
  
  db.all("SELECT id, url FROM files WHERE mime LIKE 'image/%'", async (err, rows) => {

    if (err) {
      console.error('❌ Error al consultar la DB:', err.message);
      return;
    }

    for (const file of rows) {
      if (file.url.startsWith('/uploads/')) {
        const localPath = path.join('public', file.url);
        const publicId = getFilename(file.url);

        try {
          const cloudUrl = await uploadToCloudinary(localPath, publicId);
          console.log(`✅ Subido ${file.url} → ${cloudUrl}`);

          db.run(
            "UPDATE files SET url = ? WHERE id = ?",
            [cloudUrl, file.id],
            (updateErr) => {
              if (updateErr) {
                console.error(`❌ Error actualizando DB para ${file.url}:`, updateErr.message);
              }
            }
          );
        } catch (uploadErr) {
          console.error(`🚨 Error subiendo ${file.url}:`, uploadErr.message);
        }
      }
    }
  });
}

migrate();
