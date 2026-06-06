import { initDB } from '../db.js';

/**
 * Filtra las prendas disponibles en el guardarropas o en el catálogo genérico
 * según la temperatura percibida y las condiciones del clima.
 */
export async function suggestOutfit(weather) {
    const db = await initDB();
    const currentTemp = weather.current.temperature;
    const condition = weather.current.condition; // "rain", "clear", "clouds"
    
    // 1. Obtener la tolerancia del usuario. 
    // Por defecto el offset es 0. 
    let tempOffset = 0;
    const profile = await db.get('ProfileSettings', 'temperature_offset');
    if (profile) {
        tempOffset = profile.value;
    }
    
    // Si offset es -2 (friolento), perceivedTemp será menor, obligando al sistema a recomendar más abrigo.
    const perceivedTemp = currentTemp + tempOffset;

    // 2. Obtener el inventario. Si "Mi Guardarropas" está vacío, usamos el catálogo genérico para el MVP.
    let wardrobe = await db.getAll('Wardrobe');
    if (wardrobe.length === 0) {
        wardrobe = await db.getAll('GenericCatalog');
    }

    // 3. Lógica de selección por capas
    const outfit = {
        base: null,
        mid: null,
        outer: null,
        bottom: null,
        shoes: null,
        accessories: []
    };

    // Función auxiliar para buscar la mejor prenda para una capa y temperatura
    const findBestGarment = (layer, temp, weatherCondition) => {
        // Filtrar por capa y temperatura
        let options = wardrobe.filter(g => 
            g.layer === layer && 
            temp >= g.min_temp && 
            temp <= g.max_temp
        );
        
        // Priorizar por condición climática (ej. lluvia)
        const conditionSpecific = options.filter(g => g.weather_condition === weatherCondition);
        if (conditionSpecific.length > 0) {
            options = conditionSpecific;
        } else {
            options = options.filter(g => !g.weather_condition); // prendas genéricas sin condición
        }

        return options.length > 0 ? options[0] : null;
    };

    // Selección base obligatoria
    outfit.base = findBestGarment('base', perceivedTemp, condition);
    outfit.bottom = findBestGarment('bottom', perceivedTemp, condition);
    outfit.shoes = findBestGarment('shoes', perceivedTemp, condition);
    
    // Capas dinámicas según el frío
    if (perceivedTemp <= 20) {
        outfit.mid = findBestGarment('mid', perceivedTemp, condition);
    }
    
    if (perceivedTemp <= 15 || condition === 'rain') {
        outfit.outer = findBestGarment('outer', perceivedTemp, condition);
    }
    
    if (perceivedTemp <= 10) {
        const beanie = findBestGarment('accessory', perceivedTemp, condition);
        if (beanie) outfit.accessories.push(beanie);
    }

    return outfit;
}
