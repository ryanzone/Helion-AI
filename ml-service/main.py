from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from app.model.predict import predict_risk
import uvicorn

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
    allow_origins=["*"],  # For production, restrict this to specific origins
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

class PredictionRequest(BaseModel):
    city: str = Field(..., example="Chennai")
    month: int = Field(..., ge=1, le=12, example=7)

class PredictionResponse(BaseModel):
    risk: float
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
        # Perform prediction
        prob, weather_data = predict_risk(request.city, request.month)
        
        # Return structured response
        return {
            "risk": float(prob),
            "weather": {
                "temp": float(weather_data["temp"]),
                "humidity": int(weather_data["humidity"]),
                "rainfall": float(weather_data["rainfall"])
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
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)