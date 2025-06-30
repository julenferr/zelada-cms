import Database from 'better-sqlite3';
import fs from 'fs';

const dbFile = '.tmp/data.db';
const backupFile = `.tmp/data.db.bak-${Date.now()}`;

// 1️⃣ Hacer backup
fs.copyFileSync(dbFile, backupFile);
console.log(`🛟 Backup creado en ${backupFile}`);

// 2️⃣ Conectar DB
const db = new Database(dbFile, { verbose: console.log });
console.log('🚀 Conectado a la DB SQLite');

// 3️⃣ Buscar y actualizar imágenes
const trabajos = db.prepare('SELECT id FROM trabajos').all();

for (const trabajo of trabajos) {
  const imgRows = db.prepare(`
    SELECT f.id, f.url, f.provider_metadata
    FROM files_related_mph as fr
    JOIN files as f ON f.id = fr.upload_file_id
    WHERE fr.trabajo_id = ?
  `).all(trabajo.id);

  let cambios = false;

  for (const img of imgRows) {
    if (img.url.startsWith('/uploads')) {
      const meta = JSON.parse(img.provider_metadata || '{}');
      if (meta.public_id) {
        const ext = img.url.split('.').pop();
        const nuevaUrl = `https://res.cloudinary.com/dxwolohnw/image/upload/${meta.public_id}.${ext}`;
        db.prepare(`UPDATE files SET url = ? WHERE id = ?`).run(nuevaUrl, img.id);
        console.log(`✅ Actualizada img ${img.id} en trabajo ${trabajo.id}: ${nuevaUrl}`);
        cambios = true;
      }
    }
  }

  if (!cambios) {
    console.log(`ℹ️ No hubo cambios para trabajo ${trabajo.id}`);
  }
}

console.log('🎉 Script completado. ¡DB actualizada con URLs de Cloudinary!');
