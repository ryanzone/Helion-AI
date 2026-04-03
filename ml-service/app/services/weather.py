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
    try:
        url = "https://api.openweathermap.org/data/2.5/weather"

        params = {
            "q": city,
            "appid": API_KEY,
            "units": "metric"
        }

        res = requests.get(url, params=params, timeout=5)
        data = res.json()

        if res.status_code != 200:
            raise Exception(data.get("message", "API error"))

        return {
            "city": city,
            "temp": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "rainfall": data.get("rain", {}).get("1h", 0)
        }

    except Exception as e:
        print(f"⚠️ Weather API failed for {city}:", e)

        return {
            "city": city,
            "temp": 30,
            "humidity": 60,
            "rainfall": 0
        }


# ======================
# TEST MULTIPLE CITIES
# ======================
if __name__ == "__main__":
    cities = ["Chennai", "Mumbai", "Delhi", "Bangalore"]

    for c in cities:
        print(get_weather(c))