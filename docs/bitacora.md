# Bitácora de Desarrollo: Proyecto Kemepongo

## Fecha: 5 de Junio de 2026

### 1. Inicio y Análisis de Requerimientos
- **Lo que hicimos:** Comenzamos definiendo el alcance de la aplicación "Kemepongo". El usuario planteó el problema: "no saber qué ponerse según el clima actual o el futuro cercano antes de salir de casa".
- **Decisiones arquitectónicas:**
  - Inicialmente se propuso SQLite, pero tras dos rondas de análisis (Roleplay de expertos), se decidió utilizar **IndexedDB** en el frontend (navegador) para garantizar la total privacidad del usuario sin necesidad de crear cuentas.
  - Se descartó React puro en favor de **Vanilla JS empaquetado con Vite** para mantener el uso de memoria de la app al mínimo absoluto.
  - El backend se diseñó en **Python utilizando FastAPI** para consultar apis de clima y proveer el catálogo inicial de ropa de forma rápida y moderna.

### 2. Desarrollo del Backend (Python/FastAPI)
- **Lo que hicimos:** 
  - Se creó el entorno virtual (`venv`) y se instalaron las dependencias (`fastapi`, `uvicorn`, `httpx`, `python-dotenv`).
  - Se creó el `Dockerfile` base.
  - Se crearon los endpoints:
    - `/api/catalog`: Entrega una lista JSON de 16 prendas genéricas con umbrales de temperatura (min_temp, max_temp) y capas (base, abrigo, pantalones, calzado, accesorios).
    - `/api/weather`: Inicialmente mockeado, luego conectado a la API real de **OpenWeatherMap** (con un archivo `.env` configurado).
  - **Avance clave (Resiliencia):** Al experimentar el error de "llave inactiva" temporal con OpenWeatherMap, se implementó un sistema de **Fallback automático hacia Open-Meteo**, garantizando que el sistema nunca deje de entregar datos climáticos (Tolerancia a fallos).

### 3. Desarrollo del Frontend (Vite + Vanilla JS)
- **Lo que hicimos:**
  - Configuración de proxy en Vite para conectar con FastAPI sin problemas de CORS.
  - Implementación de la base de datos **IndexedDB** en el navegador a través de la librería ligera `idb`.
  - Creación de colecciones locales: `GenericCatalog`, `Wardrobe`, `ProfileSettings` y `FeedbackHistory`.
  - Desarrollo de un motor lógico (`suggester.js`) que evalúa el clima (temperatura y lluvia) y arma un outfit estructurado combinando las múltiples capas.
  - Desarrollo del sistema de aprendizaje local (`feedback.js`): El usuario vota "Frío/Calor/Perfecto", lo cual altera un modificador interno (`temperature_offset`) para recalibrar cómo la app interpreta las temperaturas futuras.

### 4. Maquetación e Interfaz (UI/UX)
- **Lo que hicimos:**
  - Se diseñó el `index.html` priorizando el objetivo primario. Lo más grande en la pantalla es la tarjeta "LO QUE TE DEBES PONER HOY", dejando el clima como un dato secundario.
  - Se aplicó una estética premium en **Dark Mode** con estilo **Glassmorphism** (paneles de cristal esmerilado translúcido) mediante `style.css`.
  - Se implementaron botones de feedback de emojis (🥶, 😌, 🥵) de forma permanente en el inicio, permitiendo al usuario ingresar su sensación térmica a su propio criterio temporal y no forzado "al fin del día".
  - Se agregó un botón de ayuda ("?") en el header que abre un modal de cristal explicando el funcionamiento del proyecto y enlazando al repositorio de GitHub.
  - Se mejoró el widget del clima: ahora utiliza grandes emojis (☀️, ☁️, 🌧️) en lugar de texto plano y es interactivo. Al hacerle clic, despliega un modal detallado mostrando la ciudad exacta, humedad y velocidad del viento.

### 5. Automatización de Flujo
- **Lo que hicimos:**
  - Se programó un script centralizado `start.sh` que levanta en paralelo el entorno de Python (Backend) y Vite (Frontend), capturando `Ctrl+C` para detener ambos servidores de forma limpia y evitar procesos "zombis".

---

## Estado Actual (Dónde estamos)
Actualmente, el **Producto Mínimo Viable (MVP) principal está finalizado**, interconectado y funcionando en el entorno local. La aplicación es capaz de consultar APIs de clima externas de forma tolerante a fallos, sugerir outfits multicapas, y autoajustarse basándose en el feedback asíncrono del usuario usando su persistencia local y privada.

## Lo que falta (Siguientes Pasos)
- [ ] **Vista de Mi Guardarropas:** Si bien la base de datos ya está preparada, falta maquetar la pantalla en HTML que le permita al usuario listar la ropa genérica, tocar una prenda para "clonarla", y registrar prendas nuevas asociándoles temperaturas específicas.
- [ ] **Unificación Docker:** Empaquetar el Frontend y Backend utilizando `docker-compose` de manera integral.
- [ ] **Despliegue a Producción:** Realizar las configuraciones de hosting para hacer la primera versión pública accesible en internet.
