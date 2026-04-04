import joblib
import pandas as pd
import os
from app.services.weather import get_weather
from app.utils.city_mapper import get_subdivision

# ======================
# LOAD MODEL + ENCODER
# ======================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
model_path = os.path.join(BASE_DIR, "app", "model", "model.pkl")
encoder_path = os.path.join(BASE_DIR, "app", "model", "encoder.pkl")

if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at {model_path}")
if not os.path.exists(encoder_path):
    raise FileNotFoundError(f"Encoder file not found at {encoder_path}")

model = joblib.load(model_path)
encoder = joblib.load(encoder_path)

# ======================
# PREDICTION FUNCTION
# ======================
def predict_risk(city: str, month: int):
    """
    Predicts the risk probability based on city and month.
    Fetches real-time weather data and maps city to its subdivision.
    """
    # 1. Fetch real-time weather
    weather = get_weather(city)
    
    # 2. Map city to subdivision for the model
    city_for_model = get_subdivision(city)

    # 3. Handle unknown cities with fallback (first class in encoder)
    if not city_for_model or city_for_model not in encoder.classes_:
        print(f"⚠️ Warning: City '{city}' ({city_for_model}) not in training set. Using fallback.")
        city_for_model = encoder.classes_[0]

    # 4. Transform input
    city_encoded = encoder.transform([city_for_model])[0]
    
    # 5. Create DataFrame for prediction
    X = pd.DataFrame([[
        city_encoded,
        month,
        weather["rainfall"]
    ]], columns=["city", "month", "rainfall"])

    # 6. Predict probability
    # model.predict_proba returns [[prob_0, prob_1]]
    prob = model.predict_proba(X)[0][1]

    return prob, weather

# ======================
# TEST RUN
# ======================
if __name__ == "__main__":
    # Example test
    prob, w = predict_risk("Chennai", 7)
    print(f"Result -> Risk: {prob:.4f}, Weather: {w}")