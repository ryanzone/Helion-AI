import joblib
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

model_path = os.path.join(BASE_DIR, "app", "model", "model.pkl")
encoder_path = os.path.join(BASE_DIR, "app", "model", "encoder.pkl")

model = joblib.load(model_path)
encoder = joblib.load(encoder_path)  