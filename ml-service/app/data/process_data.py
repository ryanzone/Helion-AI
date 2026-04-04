import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

input_path = os.path.join(BASE_DIR, "app", "data", "rainfall.csv")
output_dir = os.path.join(BASE_DIR, "data")
output_path = os.path.join(output_dir, "data.csv")

os.makedirs(output_dir, exist_ok=True)

df = pd.read_csv(input_path)

city_map = {
    "TAMIL NADU": "Chennai",
    "WESTERN GHATS": "Mumbai",
    "DELHI": "Delhi"
}

rows = []

months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]

for _, row in df.iterrows():
    subdivision = row["SUBDIVISION"]
    city = subdivision  # no filtering

    for month_idx, month in enumerate(months, start=1):
        rainfall = row[month]

        if pd.isna(rainfall):
            continue

        trigger = 1 if rainfall > 200 else 0

        rows.append({
            "city": city,
            "month": month_idx,
            "rainfall": rainfall,
            "trigger": trigger
        })
final_df = pd.DataFrame(rows)
final_df.to_csv(output_path, index=False)

print(f"Dataset ready at: {output_path}")