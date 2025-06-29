const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const STRAPI_URL = 'http://localhost:1337/api/trabajos';
const JSON_PATH = path.join(__dirname, '../data/trabajos.json');

// Mapeo de nombres de categorías a sus IDs reales en Strapi
const categoriaMap = {
  'ANIMACIÓN': 6,
  'EDITORIAL': 1,
  'ILUSTRACIÓN': 8,
  'PRINT': 4
};

async function importar() {
  try {
    const raw = fs.readFileSync(JSON_PATH, 'utf-8');
    const trabajos = JSON.parse(raw);

    for (const trabajo of trabajos) {
      // Convertir los nombres de categorías en IDs
      const categoriasConectadas = trabajo.categorias
        .map(nombre => categoriaMap[nombre])
        .filter(id => id) // descartar los que no existan

      const payload = {
        ...trabajo,
        categorias: {
          connect: categoriasConectadas.map(id => ({ id }))
        }
      };

      const res = await fetch(STRAPI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload })
      });

      const result = await res.json();

      if (res.ok) {
        console.log(`✅ Trabajo importado: ${result?.data?.id}`);
      } else {
        console.error(`❌ Error al importar trabajo "${trabajo.tituloHome || trabajo.titulo}":`, result?.error || result);
      }
    }
  } catch (err) {
    console.error('⚠️ Error de conexión o red:', err.message || err);
  }
}

importar();
