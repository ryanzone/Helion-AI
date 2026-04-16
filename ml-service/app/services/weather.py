import requests
import os
from dotenv import load_dotenv

# ======================
# LOAD ENV
# ======================
load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")

if not API_KEY:
    raise ValueError("OPENWEATHER_API_KEY not found in .env")


# ======================
# WEATHER FUNCTION
# ======================
def get_weather(city: str):
    """
    Fetches weather data from OpenWeatherMap, restricted to India.
    """
    try:
        url = "https://api.openweathermap.org/data/2.5/weather"

        # Explicitly target India for better data clarity
        query = f"{city},IN"
        
        params = {
            "q": query,
            "appid": API_KEY,
            "units": "metric"
        }

        res = requests.get(url, params=params, timeout=5)
        data = res.json()

        if res.status_code != 200:
            raise Exception(data.get("message", "API error"))

        # Extract rain data (handling multiple keys)
        rain_1h = data.get("rain", {}).get("1h", 0)
        rain_3h = data.get("rain", {}).get("3h", 0)
        
        return {
            "city": city,
            "country": "India",
            "temp": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "rainfall": rain_1h if rain_1h > 0 else (rain_3h / 3 if rain_3h > 0 else 0),
            "description": data["weather"][0]["description"],
            "icon": data["weather"][0]["icon"]
        }

    except Exception as e:
        print(f"⚠️ Weather API failed for {city}:", e)

        # Fallback values for India (generic summer/monsoon mix)
        return {
            "city": city,
            "country": "India",
            "temp": 30.0,
            "humidity": 60,
            "rainfall": 0.0,
            "description": "clear sky (fallback)",
            "icon": "01d"
        }



# ======================
# TEST MULTIPLE CITIES
# ======================
if __name__ == "__main__":
    cities = ["Chennai", "Mumbai", "Delhi", "Bangalore"]

    for c in cities:
        print(get_weather(c))