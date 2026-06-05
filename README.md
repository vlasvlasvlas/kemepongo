# 👕 Kemepongo

**Kemepongo** es tu asistente inteligente y ultraligero que resuelve la duda más cotidiana: *"¿Qué me pongo hoy antes de salir?"* 

La aplicación analiza el clima en tiempo real y, basándose en tu tolerancia térmica personal, te sugiere un atuendo estructurado por capas (Capa Base, Medio, Abrigo, Calzado y Accesorios). Todo esto manteniendo una estricta política de **100% Privacidad**: sin registros molestos, sin cuentas y sin enviar tus datos a la nube.

---

## ✨ Características Principales

- **Outfit por Capas:** Sugerencias lógicas basadas en umbrales de temperatura (ej. no te recomendará un abrigo grueso si hace 25°C).
- **Feedback Inteligente (Aprendizaje):** Si una sugerencia te da frío (🥶) o calor (🥵), la aplicación recalibra tu "perfil térmico" internamente para abrigarte más o menos en el futuro bajo esa misma temperatura.
- **100% Privado (IndexedDB):** Tu perfil, historial de sensaciones y guardarropas se almacenan exclusivamente en el almacenamiento local de tu navegador.
- **Alta Disponibilidad:** Conectado a la API de **OpenWeatherMap**, pero cuenta con un *Fallback automático* (plan de contingencia) hacia **Open-Meteo** para asegurar que la web nunca se quede sin datos climáticos.
- **Estética Premium:** UI/UX moderna en *Dark Mode* utilizando técnicas de *Glassmorphism* (cristal translúcido) y micro-animaciones fluidas.

---

## 🛠️ Arquitectura y Tecnologías

El proyecto fue diseñado siguiendo un enfoque minimalista y de altísimo rendimiento:

* **Frontend:** Vanilla JavaScript + HTML/CSS puro, empaquetado con **Vite**. Decidimos prescindir de frameworks pesados para asegurar un uso de memoria diminuto y tiempos de carga instantáneos.
* **Base de Datos (Cliente):** `idb` (IndexedDB Wrapper) para la persistencia asíncrona de datos en el dispositivo.
* **Backend:** **Python** con el framework **FastAPI**. Se encarga de proveer el catálogo inicial de prendas y de funcionar como proxy seguro (ocultando llaves) hacia las APIs del clima.

---

## 🚀 Instalación y Uso Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina.

### Requisitos Previos
- Node.js y npm (para Vite)
- Python 3.10+ (para FastAPI)

### 1. Clonar el repositorio
```bash
git clone https://github.com/dantemepe/kemepongo.git
cd kemepongo
```

### 2. Configurar el Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
> **Nota de API (Opcional):** Renombra el archivo `backend/.env.dummy` a `backend/.env` y coloca tu API Key de OpenWeatherMap. Si decides saltar este paso, Kemepongo detectará la falta de llave y utilizará automáticamente su API gratuita de respaldo (Open-Meteo).

### 3. Configurar el Frontend
```bash
cd ../frontend
npm install
```

### 4. Ejecutar la Aplicación (Script Automático)
En la carpeta raíz del proyecto, asegúrate de darle permisos al script y ejecútalo (válido para Linux/macOS):
```bash
chmod +x start.sh
./start.sh
```
Esto levantará simultáneamente:
- El servidor Web (Frontend) en: `http://localhost:5173`
- La API (Backend) en: `http://localhost:8000`

*(Para detener todo limpiamente, solo presiona `Ctrl+C` en esa misma terminal).*

---

## 📅 Roadmap / Siguientes Pasos

- [x] Motor de Sugerencias lógicas e integración de API Meteorológica.
- [x] Motor de Feedback y Aprendizaje (Offset Térmico).
- [ ] Interfaz gráfica para explorar el catálogo y personalizar "Mi Guardarropas".
- [ ] Unificación integral con `docker-compose`.
- [ ] Despliegue público en la nube.

---
*Este proyecto fue diseñado con el principio de entregar la máxima utilidad en la menor cantidad de clics posibles.*
