from app.model.predict import predict_risk
from app.config import supabase
import datetime


def analyze_earnings(user_id: str):

    earnings_res = supabase.table("earnings") \
        .select("amount, created_at") \
        .eq("user_id", user_id) \
        .execute()

    earnings_data = earnings_res.data or []
    total_earnings = sum(e["amount"] for e in earnings_data)

    claims_res = supabase.table("claims") \
        .select("amount, status") \
        .eq("user_id", user_id) \
        .execute()

    claims_data = claims_res.data or []

    pending = sum(c["amount"] for c in claims_data if c["status"] == "pending")
    paid_out = sum(c["amount"] for c in claims_data if c["status"] == "approved")

    hours = len(earnings_data) * 6

    user_res = supabase.table("users") \
        .select("city") \
        .eq("id", user_id) \
        .single() \
        .execute()

    city = user_res.data["city"]

    month = datetime.datetime.now().month
    result, weather = predict_risk(city, month)
    risk = result["probability"]

    earnings_per_hour = total_earnings / max(hours, 1)

    efficiency_score = int((earnings_per_hour / 200) * 100)
    efficiency_score = max(0, min(100, efficiency_score))

    insights = []

    if earnings_per_hour < 120:
        insights.append("Your hourly earnings are below optimal levels.")
    elif earnings_per_hour > 180:
        insights.append("You are operating at high earning efficiency.")
    else:
        insights.append("Your earnings are stable.")

    if pending > 0:
        insights.append("You have pending claims waiting for payout.")

    if weather["rainfall"] > 5:
        insights.append("Rainfall is reducing your delivery efficiency.")

    if risk > 0.7:
        insights.append("High environmental risk is impacting your earnings.")

    if risk > 0.7:
        recommendation = "Avoid high-risk hours and shift your work timing."
    elif weather["rainfall"] > 5:
        recommendation = "Work during low-rain periods to maximize earnings."
    else:
        recommendation = "Your current work pattern is optimal."

    return {
        "total_earnings": float(total_earnings),
        "paid_out": float(paid_out),
        "pending_payout": float(pending),
        "efficiency_score": efficiency_score,
        "risk_score": round(risk, 2),
        "risk_label": result["risk_label"],
        "weather": weather,
        "insights": insights,
        "recommendation": recommendation
    }