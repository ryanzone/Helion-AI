import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
data_path = os.path.join(BASE_DIR, "data", "data.csv")
model_path = os.path.join(BASE_DIR, "app", "model", "model.pkl")
encoder_path = os.path.join(BASE_DIR, "app", "model", "encoder.pkl")

df = pd.read_csv(data_path)

le = LabelEncoder()
df["city"] = le.fit_transform(df["city"])

X = df[["city", "month", "rainfall"]]
y = df["trigger"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = XGBClassifier()
model.fit(X_train, y_train)
joblib.dump(model, model_path)
joblib.dump(le, encoder_path)

print("✅ Model trained and saved")