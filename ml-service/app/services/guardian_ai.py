from app.model.predict import predict_risk
import datetime


def guardian_analysis(user_data: dict):

    city = user_data["city"]

    # Use current month
    month = datetime.datetime.now().month

    # Reuse your ML pipeline
    result, weather = predict_risk(city, month)

    risk = result["probability"]

    safety_score = int((1 - risk) * 100)

    triggers = []

    if weather["rainfall"] > 10:
        triggers.append("Heavy Rain Risk")

    if weather["humidity"] > 85:
        triggers.append("High Humidity Stress")

    if risk > 0.8:
        triggers.append("High Accident Probability")

    if risk < 0.3:
        status = "All conditions are within safe operating range."
    elif risk < 0.7:
        status = "Moderate risk detected. Stay cautious."
    else:
        status = "High risk detected. Immediate precautions advised."

    return {
        "risk_score": round(risk, 2),
        "risk_label": result["risk_label"],
        "safety_score": safety_score,
        "triggers": triggers,
        "ai_analysis": status,
        "weather": weather
    }