from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="gigshield")

# state → subdivision mapping (matches data.csv exactly)
state_to_subdivision = {
    "Tamil Nadu": "TAMIL NADU",
    "Kerala": "KERALA",
    "Karnataka": "SOUTH INTERIOR KARNATAKA", # Default for general Karnataka
    "Coastal Karnataka": "COASTAL KARNATAKA",
    "North Karnataka": "NORTH INTERIOR KARNATAKA",
    "Maharashtra": "MADHYA MAHARASHTRA",
    "Mumbai": "KONKAN & GOA",
    "Goa": "KONKAN & GOA",
    "Delhi": "HARYANA DELHI & CHANDIGARH",
    "Haryana": "HARYANA DELHI & CHANDIGARH",
    "Chandigarh": "HARYANA DELHI & CHANDIGARH",
    "Punjab": "PUNJAB",
    "Gujarat": "GUJARAT REGION",
    "Saurashtra": "SAURASHTRA & KUTCH",
    "Kutch": "SAURASHTRA & KUTCH",
    "Rajasthan": "EAST RAJASTHAN",
    "West Rajasthan": "WEST RAJASTHAN",
    "Uttar Pradesh": "WEST UTTAR PRADESH",
    "East Uttar Pradesh": "EAST UTTAR PRADESH",
    "Uttarakhand": "UTTARAKHAND",
    "West Bengal": "GANGETIC WEST BENGAL",
    "Sikkim": "SUB HIMALAYAN WEST BENGAL & SIKKIM",
    "Assam": "ASSAM & MEGHALAYA",
    "Meghalaya": "ASSAM & MEGHALAYA",
    "Arunachal Pradesh": "ARUNACHAL PRADESH",
    "Odisha": "ORISSA",
    "Jharkhand": "JHARKHAND",
    "Bihar": "BIHAR",
    "Madhya Pradesh": "WEST MADHYA PRADESH",
    "East Madhya Pradesh": "EAST MADHYA PRADESH",
    "Chhattisgarh": "CHHATTISGARH",
    "Andhra Pradesh": "COASTAL ANDHRA PRADESH",
    "Telangana": "TELANGANA",
    "Rayalaseema": "RAYALSEEMA",
    "Jammu and Kashmir": "JAMMU & KASHMIR",
    "Himachal Pradesh": "HIMACHAL PRADESH",
    "Tripura": "NAGA MANI MIZO TRIPURA",
    "Mizoram": "NAGA MANI MIZO TRIPURA",
    "Manipur": "NAGA MANI MIZO TRIPURA",
    "Nagaland": "NAGA MANI MIZO TRIPURA",
    "Andaman and Nicobar": "ANDAMAN & NICOBAR ISLANDS",
    "Lakshadweep": "LAKSHADWEEP"
}


def get_subdivision(city):
    try:
        location = geolocator.geocode(city + ", India")

        if not location:
            # 💡 DEMO FALLBACK: Handle common demo inputs
            city_clean = city.lower()
            if "mumbai" in city_clean: return "KONKAN & GOA"
            if "chennai" in city_clean: return "TAMIL NADU"
            if "delhi" in city_clean: return "HARYANA DELHI & CHANDIGARH"
            if "bangalore" in city_clean: return "SOUTH INTERIOR KARNATAKA"
            return None

        address = location.raw.get("display_name", "")

        for state in state_to_subdivision:
            if state in address:
                return state_to_subdivision[state]

        return None

    except Exception as e:
        print("Geocoding error:", e)
        return None