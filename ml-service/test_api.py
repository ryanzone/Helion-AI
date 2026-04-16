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
    if response.status_code == 200:
        print("Response received successfully!")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error Response: {response.text}")
except Exception as e:

    print(f"Error: {e}")
