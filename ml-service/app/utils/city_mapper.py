from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="gigshield")

# state → subdivision mapping
state_to_subdivision = {
    "Tamil Nadu": "TAMIL NADU",
    "Kerala": "KERALA",
    "Karnataka": "COASTAL KARNATAKA",
    "Maharashtra": "WESTERN GHATS",
    "Delhi": "DELHI",
    "Gujarat": "GUJARAT REGION",
    "Rajasthan": "RAJASTHAN",
    "Uttar Pradesh": "UTTAR PRADESH",
    "West Bengal": "GANGETIC WEST BENGAL"
}

def get_subdivision(city):
    try:
        location = geolocator.geocode(city + ", India")

        if not location:
            # 💡 DEMO FALLBACK: Handle common demo inputs
            city_clean = city.lower()
            if "mumbai" in city_clean: return "WESTERN GHATS"
            if "chennai" in city_clean: return "TAMIL NADU"
            if "delhi" in city_clean: return "DELHI"
            return None

        address = location.raw.get("display_name", "")

        for state in state_to_subdivision:
            if state in address:
                return state_to_subdivision[state]

        return None

    except Exception as e:
        print("Geocoding error:", e)
        return None