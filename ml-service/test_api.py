import requests
import json

url = "http://localhost:8000/predict"
data = {
    "city": "Chennai",
    "month": 7
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
