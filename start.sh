#!/bin/bash

echo "Iniciando Kemepongo..."

# Iniciar Backend en segundo plano
echo "-> Iniciando Backend (FastAPI)..."
cd backend
source venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Iniciar Frontend en segundo plano
echo "-> Iniciando Frontend (Vite)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "======================================================"
echo "✨ Aplicación Kemepongo en ejecución ✨"
echo "Frontend (Web):  http://localhost:5173"
echo "Backend (API):   http://localhost:8000"
echo "Docs de API:     http://localhost:8000/docs"
echo "======================================================"
echo "Presiona Ctrl+C para detener ambos servidores."

# Función para matar ambos procesos si el script se detiene
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Capturar Ctrl+C para limpiar
trap cleanup SIGINT

# Mantener el script corriendo
wait $BACKEND_PID $FRONTEND_PID
