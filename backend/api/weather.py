import os
import httpx
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

async def get_weather_open_meteo(lat: float, lon: float):
    """
    API Alternativa de clima (Open-Meteo). 
    Es 100% gratuita y no requiere API key. Se usa como fallback.
    """
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Fallo en API principal y también en el fallback alternativo (Open-Meteo)")
        
    data = response.json()
    current = data.get("current", {})
    
    # Mapeo de códigos WMO de Open-Meteo a nuestra lógica (rain, clouds, clear, snow)
    code = current.get("weather_code", 0)
    condition = "clear"
    if code in [1, 2, 3]:
        condition = "clouds"
    elif code in [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]:
        condition = "rain"
    elif code in [71, 73, 75, 77, 85, 86]:
        condition = "snow"
        
    return {
        "location": {"lat": lat, "lon": lon, "city": "Ubicación (Open-Meteo)"},
        "current": {
            "temperature": round(current.get("temperature_2m", 0)),
            "condition": condition,
            "humidity": current.get("relative_humidity_2m", 0),
            "wind_speed": current.get("wind_speed_10m", 0)
        }
    }

@router.get("/weather")
async def get_weather(lat: float = -34.6037, lon: float = -58.3816):
    # 1. Intentar usar OpenWeatherMap si existe la llave
    if OPENWEATHER_API_KEY and OPENWEATHER_API_KEY != "your_openweather_api_key_here":
        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                
            if response.status_code == 200:
                data = response.json()
                main_weather = data["weather"][0]["main"].lower()
                condition = "clear"
                if "rain" in main_weather or "drizzle" in main_weather or "thunderstorm" in main_weather:
                    condition = "rain"
                elif "cloud" in main_weather:
                    condition = "clouds"
                elif "snow" in main_weather:
                    condition = "snow"

                return {
                    "location": {
                        "lat": lat, 
                        "lon": lon, 
                        "city": data.get("name", "Desconocida")
                    },
                    "current": {
                        "temperature": round(data["main"]["temp"]),
                        "condition": condition,
                        "humidity": data["main"]["humidity"],
                        "wind_speed": data["wind"]["speed"]
                    }
                }
            else:
                print(f"OpenWeatherMap falló ({response.status_code}): {response.text}. Activando Fallback Open-Meteo...")
        except Exception as e:
            print(f"Error de red conectando a OpenWeatherMap: {e}. Activando Fallback Open-Meteo...")
            
    # 2. Si no hay llave o si falló OpenWeatherMap (ej. por key inactiva o servidor caído), usamos el fallback seguro
    print("Usando API alternativa (Open-Meteo)...")
    return await get_weather_open_meteo(lat, lon)
