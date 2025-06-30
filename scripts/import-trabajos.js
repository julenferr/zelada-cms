import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const STRAPI_URL = "https://zelada-cms.onrender.com/api/trabajos";
const JSON_PATH = path.join("data", "trabajos.json");

// Mapeo de nombres a IDs reales del CMS online
const categoriaMap = {
  "PRINT": 4,
  "EDITORIAL": 1,
  "ILUSTRACIÓN": 8,
  "ANIMACIÓN": 6,
};

async function importar() {
  const raw = fs.readFileSync(JSON_PATH, "utf-8");
  const trabajos = JSON.parse(raw);

  for (const trabajo of trabajos) {
    // Mapear nombres a IDs
    trabajo.categorias = (trabajo.categorias || [])
      .map(nombre => categoriaMap[nombre])
      .filter(Boolean);

    try {
      const res = await fetch(STRAPI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: trabajo }),
      });

      const result = await res.json();

      if (res.ok) {
        console.log(`✅ Trabajo importado: ${result?.data?.id}`);
      } else {
        console.error(`❌ Error al importar:`, result);
      }
    } catch (err) {
      console.error(`⚠️ Error de red:`, err.message);
    }
  }
}

importar();
