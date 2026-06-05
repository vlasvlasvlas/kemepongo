import { initDB } from './db.js';

export async function syncCatalog() {
    try {
        const db = await initDB();
        
        // Revisar si ya hay catálogo local para evitar descargas innecesarias
        const count = await db.count('GenericCatalog');
        if (count > 0) {
            console.log("Catálogo genérico ya sincronizado (en caché).");
            return;
        }

        console.log("Descargando catálogo genérico de la API...");
        const res = await fetch('/api/catalog');
        
        if (!res.ok) {
            throw new Error('Error al conectar con la API de FastAPI');
        }

        const data = await res.json();
        
        // Guardar cada prenda en IndexedDB
        const tx = db.transaction('GenericCatalog', 'readwrite');
        const store = tx.objectStore('GenericCatalog');
        
        for (const item of data.catalog) {
            await store.put(item);
        }
        
        await tx.done;
        console.log("Catálogo genérico guardado en IndexedDB con éxito.");
    } catch (error) {
        console.error("Error sincronizando catálogo:", error);
        throw error;
    }
}
