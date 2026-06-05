import { initDB } from '../db.js';

/**
 * Actualiza el perfil térmico del usuario basado en su feedback
 * feedbackType: 'frio', 'perfecto', 'calor'
 */
export async function registerFeedback(weather, outfit, feedbackType) {
    const db = await initDB();
    const dateStr = new Date().toISOString().split('T')[0]; // Ej: 2026-06-05
    
    // 1. Guardar en el historial (útil para estadísticas de la V2)
    await db.put('FeedbackHistory', {
        date: dateStr,
        temperature: weather.current.temperature,
        condition: weather.current.condition,
        outfit: outfit,
        feedback: feedbackType
    });

    // 2. Ajustar tolerancia térmica (Inteligencia del sistema)
    let currentOffset = 0;
    const profile = await db.get('ProfileSettings', 'temperature_offset');
    if (profile) {
        currentOffset = profile.value;
    }

    // Si tuvo frío, restamos grados a su offset. Así la próxima vez
    // que haga 15°C, su cuerpo "percibirá" 13°C y el algoritmo será más conservador.
    if (feedbackType === 'frio') {
        currentOffset -= 2; 
    } else if (feedbackType === 'calor') {
        currentOffset += 2; 
    }
    
    await db.put('ProfileSettings', {
        key: 'temperature_offset',
        value: currentOffset
    });
    
    console.log(`Feedback registrado: ${feedbackType}. Nuevo offset térmico: ${currentOffset}`);
    return currentOffset;
}
