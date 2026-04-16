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

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    use_label_encoder=False,
    eval_metric='logloss'
)

print("Training model...")
model.fit(X_train, y_train)

# Evaluation
score = model.score(X_test, y_test)
print(f"Model Accuracy: {score:.4f}")


joblib.dump(model, model_path)
joblib.dump(le, encoder_path)


print("Model trained and saved")