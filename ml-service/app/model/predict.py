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
    # 1. Fetch real-time weather (restricted to India)
    weather = get_weather(city)
    
    # 2. Map city to subdivision for the model
    city_for_model = get_subdivision(city)

    # 3. Handle unknown cities with fallback
    if not city_for_model:
        # Try a direct lookup in case it's already a subdivision name
        city_upper = city.upper()
        if city_upper in encoder.classes_:
            city_for_model = city_upper
        else:
            print(f"⚠️ Warning: City '{city}' could not be mapped. Using fallback.")
            city_for_model = encoder.classes_[0]
    elif city_for_model not in encoder.classes_:
        print(f"⚠️ Warning: Subdivision '{city_for_model}' not in training set. Using fallback.")
        city_for_model = encoder.classes_[0]

    # 4. Resolve Rainfall Mismatch
    # Model trained on monthly totals (mm). Input weather is hourly (mm/h).
    # We use a heuristic: Hourly rain * 24 (daily) * 10 (sensitivity factor)
    # This represents 'projected monthly intensity' if the rain continues.
    rainfall_input = weather["rainfall"] * 24 * 10
    
    # Clip to reasonable max monthly rainfall (e.g., 2000mm)
    rainfall_input = min(rainfall_input, 2000.0)

    # 5. Transform input
    city_encoded = encoder.transform([city_for_model])[0]
    
    # 6. Create DataFrame for prediction
    X = pd.DataFrame([[
        city_encoded,
        month,
        rainfall_input
    ]], columns=["city", "month", "rainfall"])

    # 7. Predict probability
    # model.predict_proba returns [[prob_0, prob_1]]
    prob = model.predict_proba(X)[0][1]

    # 8. Categorize Risk
    if prob >= 0.7:
        risk_label = "HIGH"
    elif prob >= 0.3:
        risk_label = "MODERATE"
    else:
        risk_label = "LOW"

    # 9. Dynamic Premium (Base: ₹40/week)
    base_premium = 40.0
    # Increase up to 50% for high risk, decrease up to 25% for low risk
    if prob >= 0.7:
        dynamic_premium = base_premium * (1 + (prob - 0.5)) 
    elif prob <= 0.2:
        dynamic_premium = base_premium * 0.8  # 20% discount
    else:
        dynamic_premium = base_premium

    # Include original rainfall in weather info for the UI
    result = {
        "probability": prob,
        "risk_label": risk_label,
        "dynamic_premium": round(dynamic_premium, 2)
    }

    return result, weather


# ======================
# TEST RUN
# ======================
if __name__ == "__main__":
    # Example test
    prob, w = predict_risk("Chennai", 7)
    print(f"Result -> Risk: {prob:.4f}, Weather: {w}")