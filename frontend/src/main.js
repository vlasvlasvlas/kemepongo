import './style.css';
import { syncCatalog } from './catalogSync.js';
import { suggestOutfit } from './logic/suggester.js';
import { registerFeedback } from './logic/feedback.js';

let currentWeather = null;
let currentOutfit = null;

async function fetchWeather() {
    const res = await fetch('/api/weather');
    if (!res.ok) throw new Error("Error en API Clima");
    return await res.json();
}

function renderUI() {
    const app = document.querySelector('#app');
    
    // Estado de carga inicial
    if (!currentOutfit) {
        app.innerHTML = `
          <header>
            <h1>Kemepongo</h1>
          </header>
          <div style="text-align:center; margin-top: 50px;" class="fade-in">
             <p style="color: var(--text-secondary);">Analizando el clima y armando tu outfit...</p>
          </div>
        `;
        return;
    }

    // Renderizar prendas
    const layers = [
        { key: 'base', name: 'BASE' },
        { key: 'bottom', name: 'PANTALÓN' },
        { key: 'mid', name: 'MEDIO' },
        { key: 'outer', name: 'ABRIGO' },
        { key: 'shoes', name: 'CALZADO' }
    ];

    const garmentsHtml = layers
        .filter(l => currentOutfit[l.key])
        .map((l, index) => `
            <div class="garment-item fade-in" style="animation-delay: ${index * 0.1}s">
                <span class="garment-layer">${l.name}</span>
                <span>${currentOutfit[l.key].name}</span>
            </div>
        `).join('');
        
    const accessoriesHtml = currentOutfit.accessories.map((acc, index) => `
        <div class="garment-item fade-in" style="animation-delay: ${(layers.length + index) * 0.1}s">
            <span class="garment-layer">ACCESORIO</span>
            <span>${acc.name}</span>
        </div>
    `).join('');

    // Mapeo del clima a Emojis
    const conditionMap = {
        'clear': { emoji: '☀️', text: 'Despejado' },
        'clouds': { emoji: '☁️', text: 'Nublado' },
        'rain': { emoji: '🌧️', text: 'Lluvia' },
        'snow': { emoji: '❄️', text: 'Nieve' }
    };
    const mappedCondition = conditionMap[currentWeather.current.condition] || { emoji: '🌍', text: currentWeather.current.condition };

    app.innerHTML = `
      <header class="fade-in">
        <h1>Kemepongo</h1>
        <div style="display:flex; align-items:center; gap:10px;">
            <div class="weather-widget" id="btn-weather" style="cursor:pointer; transition: all 0.2s ease;" title="Ver detalle del clima">
              <span class="weather-temp">${currentWeather.current.temperature}°C</span>
              <span class="weather-desc" style="font-size:1.4rem; padding-left:5px;">${mappedCondition.emoji}</span>
            </div>
            <button class="btn-info" id="btn-info" title="Acerca de Kemepongo">?</button>
        </div>
      </header>

      <main class="outfit-section">
        <h2 class="outfit-title fade-in">LO QUE TE DEBES PONER HOY</h2>
        <div class="outfit-card fade-in">
            ${garmentsHtml}
            ${accessoriesHtml}
        </div>
      </main>

      <section class="feedback-section fade-in" style="animation-delay: 0.5s">
        <p>¿Qué tal te resultó esta combinación?</p>
        <div class="feedback-buttons">
            <button class="btn-emoji" id="btn-frio" title="Tuve Frío">🥶</button>
            <button class="btn-emoji" id="btn-perfecto" title="Perfecto">😌</button>
            <button class="btn-emoji" id="btn-calor" title="Tuve Calor">🥵</button>
        </div>
      </section>

      <!-- Modal Detalles del Clima -->
      <div id="weather-modal" class="modal-overlay" style="display:none;">
        <div class="modal-content">
            <button id="close-weather-modal" class="close-btn">&times;</button>
            <h2>Detalle del Clima</h2>
            <h3 style="color:var(--text-secondary);">📍 ${currentWeather.location.city}</h3>
            <div style="margin: 20px 0; font-size: 1.1rem; color: var(--text-primary); line-height: 1.8;">
              <p><strong>Condición:</strong> ${mappedCondition.emoji} ${mappedCondition.text}</p>
              <p><strong>Temperatura:</strong> ${currentWeather.current.temperature} °C</p>
              <p><strong>Humedad:</strong> ${currentWeather.current.humidity}% 💧</p>
              <p><strong>Viento:</strong> ${currentWeather.current.wind_speed} km/h 💨</p>
            </div>
        </div>
      </div>

      <!-- Modal de Información -->
      <div id="info-modal" class="modal-overlay" style="display:none;">
        <div class="modal-content">
            <button id="close-modal" class="close-btn">&times;</button>
            <h2>Sobre Kemepongo</h2>
            <p>Tu asistente inteligente para saber qué ponerte antes de salir de casa. Sin registros molestos, súper rápido y completamente privado.</p>
            <h3>¿Cómo funciona?</h3>
            <p>1. Obtenemos el clima real en tu zona usando tu servidor.</p>
            <p>2. Te sugerimos prendas multicapa (Base, Abrigo, Calzado).</p>
            <p>3. <strong>¡Feedback!</strong> Si tocas los emojis inferiores, la app "aprenderá" tu nivel personal de tolerancia térmica y ajustará el algoritmo para la próxima vez.</p>
            <div style="margin-top:25px; text-align:center;">
                <a href="https://github.com/dantemepe/kemepongo" target="_blank" class="github-link">Ver Repositorio en GitHub</a>
            </div>
        </div>
      </div>
    `;

    // Event Listeners Feedback
    document.getElementById('btn-frio').addEventListener('click', () => handleFeedback('frio'));
    document.getElementById('btn-perfecto').addEventListener('click', () => handleFeedback('perfecto'));
    document.getElementById('btn-calor').addEventListener('click', () => handleFeedback('calor'));

    // Event Listeners Modal Info
    document.getElementById('btn-info').addEventListener('click', () => {
        document.getElementById('info-modal').style.display = 'flex';
    });
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('info-modal').style.display = 'none';
    });
    document.getElementById('info-modal').addEventListener('click', (e) => {
        if (e.target.id === 'info-modal') document.getElementById('info-modal').style.display = 'none';
    });

    // Event Listeners Modal Clima
    document.getElementById('btn-weather').addEventListener('click', () => {
        document.getElementById('weather-modal').style.display = 'flex';
    });
    document.getElementById('btn-weather').addEventListener('mouseenter', (e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
    });
    document.getElementById('btn-weather').addEventListener('mouseleave', (e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.background = 'var(--card-bg)';
    });
    document.getElementById('close-weather-modal').addEventListener('click', () => {
        document.getElementById('weather-modal').style.display = 'none';
    });
    document.getElementById('weather-modal').addEventListener('click', (e) => {
        if (e.target.id === 'weather-modal') document.getElementById('weather-modal').style.display = 'none';
    });
}

async function handleFeedback(type) {
    await registerFeedback(currentWeather, currentOutfit, type);
    alert('¡Anotado! He ajustado mis recomendaciones térmicas para la próxima vez.');
    // Refrescar sugerencia por si el nuevo offset térmico cambia el outfit
    currentOutfit = null;
    initApp(); 
}

async function initApp() {
    renderUI(); // Estado de carga
    try {
        await syncCatalog();
        currentWeather = await fetchWeather();
        currentOutfit = await suggestOutfit(currentWeather);
        renderUI(); // Estado final
    } catch(e) {
        document.querySelector('#app').innerHTML = `
            <header><h1>Kemepongo</h1></header>
            <p style="color:#ef4444; text-align:center; padding: 20px; background: rgba(239, 68, 68, 0.1); border-radius: 12px; margin-top: 20px;">
                Error: ${e.message}<br><small>Asegúrate de tener el backend de FastAPI corriendo.</small>
            </p>
        `;
    }
}

initApp();
