import 'dotenv/config'
import fs from 'fs';
import path from 'path';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadsDir = path.join(process.cwd(), 'public/uploads');

async function uploadAll() {
  const files = fs.readdirSync(uploadsDir);
  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);

    if (stats.size > 10 * 1024 * 1024) {
      console.log(`⚠️  Saltando archivo muy grande: ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      continue;
    }

    try {
      const res = await cloudinary.v2.uploader.upload(filePath, {
        folder: 'zelada-portfolio',
        resource_type: 'auto'
      });
      console.log(`✅ Subido: ${file} => ${res.secure_url}`);
    } catch (err) {
      console.error(`❌ Error al subir ${file}:`, err.message);
    }
  }
}

uploadAll();
