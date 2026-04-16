from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from app.model.predict import predict_risk
import uvicorn
import datetime

app = FastAPI(
    title="GigShield AI ML Service",
    description="Backend for predicting risk probabilities based on city and month.",
    version="1.0.0"
)

# ======================
# CORS CONFIGURATION
# ======================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ======================
# SCHEMAS (Request/Response)
# ======================
class WeatherInfo(BaseModel):
    temp: float
    humidity: int
    rainfall: float
    description: str
    icon: str
    country: str

class PredictionRequest(BaseModel):
    city: str = Field(..., json_schema_extra={"example": "Chennai"})
    month: int = Field(None, ge=1, le=12, json_schema_extra={"example": 7})
    rain: float = Field(None, description="Optional rain value from frontend")
    aqi: int = Field(None, description="Optional AQI value from frontend")

class PredictionResponse(BaseModel):
    probability: float
    risk_label: str
    dynamic_premium: float
    weather: WeatherInfo

# ======================
# ENDPOINTS
# ======================
@app.get("/")
def home():
    return {"status": "GigShield AI ML Service alive", "version": "1.0.0"}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    """
    Predict risk based on city and month using ML model.
    """
    try:
        # Use provided month or current month
        month = request.month if request.month else datetime.datetime.now().month

        # Perform prediction (returns result dict and weather dict)
        result, weather_data = predict_risk(request.city, month)
        
        # Return structured response
        return {
            "probability": float(result["probability"]),
            "risk_label": result["risk_label"],
            "dynamic_premium": float(result["dynamic_premium"]),
            "weather": {
                "temp": float(weather_data["temp"]),
                "humidity": int(weather_data["humidity"]),
                "rainfall": float(weather_data["rainfall"]),
                "description": weather_data["description"],
                "icon": weather_data["icon"],
                "country": weather_data["country"]
            }
        }

    except Exception as e:
        # Global error handling for model or API failures
        print(f"❌ Prediction Error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )

# ======================
# RUN (For direct execution)
# ======================
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5005, reload=True)