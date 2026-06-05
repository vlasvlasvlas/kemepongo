from fastapi import APIRouter

router = APIRouter()

GENERIC_CATALOG = [
    {"id": "tshirt_short", "name": "Remera Manga Corta", "layer": "base", "min_temp": 20, "max_temp": 40},
    {"id": "tshirt_long", "name": "Remera Manga Larga", "layer": "base", "min_temp": 15, "max_temp": 25},
    {"id": "sweater_light", "name": "Buzo Liviano", "layer": "mid", "min_temp": 10, "max_temp": 20},
    {"id": "sweater_heavy", "name": "Buzo Grueso", "layer": "mid", "min_temp": -5, "max_temp": 15},
    {"id": "jacket_light", "name": "Campera Liviana", "layer": "outer", "min_temp": 10, "max_temp": 20},
    {"id": "jacket_heavy", "name": "Campera Polar / Abrigada", "layer": "outer", "min_temp": -10, "max_temp": 10},
    {"id": "jacket_rain", "name": "Campera Impermeable", "layer": "outer", "min_temp": 0, "max_temp": 25, "weather_condition": "rain"},
    {"id": "shorts", "name": "Pantalón Corto", "layer": "bottom", "min_temp": 22, "max_temp": 40},
    {"id": "pants_light", "name": "Pantalón Largo Liviano", "layer": "bottom", "min_temp": 15, "max_temp": 30},
    {"id": "pants_heavy", "name": "Pantalón Largo Grueso", "layer": "bottom", "min_temp": -10, "max_temp": 15},
    {"id": "shoes_sneakers", "name": "Zapatillas", "layer": "shoes", "min_temp": 0, "max_temp": 40},
    {"id": "shoes_sandals", "name": "Chancletas / Sandalias", "layer": "shoes", "min_temp": 25, "max_temp": 40},
    {"id": "shoes_boots", "name": "Botas de Lluvia", "layer": "shoes", "min_temp": -10, "max_temp": 25, "weather_condition": "rain"},
    {"id": "acc_scarf", "name": "Bufanda", "layer": "accessory", "min_temp": -10, "max_temp": 10},
    {"id": "acc_beanie", "name": "Gorro de Lana", "layer": "accessory", "min_temp": -10, "max_temp": 10},
    {"id": "acc_cap", "name": "Gorra con Visera", "layer": "accessory", "min_temp": 20, "max_temp": 40, "weather_condition": "clear"}
]

@router.get("/catalog")
def get_catalog():
    return {"catalog": GENERIC_CATALOG}
