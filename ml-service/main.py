from dotenv import load_dotenv
import os

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn
import datetime

from app.model.predict import predict_risk
from app.services.earnings_ai import analyze_earnings
from app.services.guardian_ai import guardian_analysis

app = FastAPI(
    title="GigShield AI ML Service",
    description="Backend for predicting risk probabilities and AI insights.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class WeatherInfo(BaseModel):
    temp: float
    humidity: int
    rainfall: float
    description: str
    icon: str
    country: str


class PredictionRequest(BaseModel):
    city: str = Field(..., example="Chennai")
    month: int = Field(None, ge=1, le=12, example=7)
    rain: float = None
    aqi: int = None


class PredictionResponse(BaseModel):
    probability: float
    risk_label: str
    dynamic_premium: float
    weather: WeatherInfo


class EarningsRequest(BaseModel):
    user_id: str


class GuardianRequest(BaseModel):
    city: str


@app.get("/")
def home():
    return {
        "status": "GigShield AI ML Service alive",
        "version": "2.0.0"
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    try:
        month = request.month if request.month else datetime.datetime.now().month

        result, weather_data = predict_risk(request.city, month)

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
        print(f"❌ Prediction Error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )


@app.post("/earnings-analysis")
def earnings_analysis(request: EarningsRequest):
    try:
        return analyze_earnings(request.user_id)
    except Exception as e:
        print(f"❌ Earnings Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/guardian-analysis")
def guardian(request: GuardianRequest):
    try:
        return guardian_analysis({"city": request.city})
    except Exception as e:
        print(f"❌ Guardian Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5005, reload=True)