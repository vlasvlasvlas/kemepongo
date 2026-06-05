import { openDB } from 'idb';

const DB_NAME = 'kemepongo_db';
const DB_VERSION = 1;

export async function initDB() {
    return await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Catálogo Genérico que viene de la API
            if (!db.objectStoreNames.contains('GenericCatalog')) {
                db.createObjectStore('GenericCatalog', { keyPath: 'id' });
            }
            
            // Inventario del usuario (Ropa clonada o creada)
            if (!db.objectStoreNames.contains('Wardrobe')) {
                db.createObjectStore('Wardrobe', { keyPath: 'id', autoIncrement: true });
            }
            
            // Preferencias del usuario (Tolerancia térmica)
            if (!db.objectStoreNames.contains('ProfileSettings')) {
                db.createObjectStore('ProfileSettings', { keyPath: 'key' });
            }
            
            // Historial de feedback (Día, Clima, Outfit, Sentimiento)
            if (!db.objectStoreNames.contains('FeedbackHistory')) {
                db.createObjectStore('FeedbackHistory', { keyPath: 'date' });
            }
        }
    });
}
