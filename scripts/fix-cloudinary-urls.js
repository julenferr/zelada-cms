import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

(async () => {
  const db = await open({
    filename: '.tmp/data.db',
    driver: sqlite3.Database
  });

  // Descubrir tablas disponibles
  const tables = await db.all(`SELECT name FROM sqlite_master WHERE type='table'`);
  console.log('📋 Tablas encontradas:', tables.map(t => t.name));

  const tableName = tables.find(t => t.name.includes('upload_file') || t.name.includes('files'));
  if (!tableName) {
    console.error('❌ No se encontró tabla de archivos (upload_file o files). Revisa tu DB.');
    process.exit(1);
  }

  const realTable = tableName.name;
  console.log(`✅ Usando tabla: ${realTable}`);

  // Pedir imágenes
  const files = await db.all(`SELECT * FROM ${realTable} WHERE mime LIKE 'image/%'`);

  let cloudImages = [];
  let nextCursor = undefined;
  do {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'zelada-portfolio/',
      max_results: 500,
      next_cursor: nextCursor
    });
    cloudImages.push(...result.resources);
    nextCursor = result.next_cursor;
  } while (nextCursor);

  for (const file of files) {
    const baseName = file.name.split('.')[0];
    const match = cloudImages.find(c => c.public_id.includes(baseName));

    if (match) {
      await db.run(`UPDATE ${realTable} SET url = ? WHERE id = ?`, [match.secure_url, file.id]);
      console.log(`✅ Actualizado ${file.name} -> ${match.secure_url}`);
    } else {
      console.log(`⚠️ No encontrado en Cloudinary: ${file.name}`);
    }
  }

  console.log('🎉 Migración terminada');
})();
