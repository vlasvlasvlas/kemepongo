from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import catalog, weather

app = FastAPI(title="Kemepongo API")

# Permitir CORS para desarrollo local (Vite suele usar el puerto 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción deberíamos restringir esto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(catalog.router, prefix="/api")
app.include_router(weather.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Kemepongo"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
