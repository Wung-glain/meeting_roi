# train_model.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import os
from ml_pipeline import load_and_preprocess, train_models


csv_file_path = './synthetic_meetings_avg_salary.csv'
df = load_and_preprocess(csv_file_path)
clf, reg =  train_models(df)

print("model created success fully")
# 1. Generate synthetic data
np.random.seed(42)
num_samples = 1000

data = pd.DataFrame({
    "num_attendees": np.random.randint(2, 20, num_samples),
    "duration_minutes": np.random.randint(15, 180, num_samples),
    "has_agenda": np.random.randint(0, 2, num_samples),
    "avg_hourly_rate": np.random.randint(20, 150, num_samples),
    "meeting_time_hour": np.random.randint(8, 18, num_samples),
    "historical_productivity_avg": np.round(np.random.rand(num_samples), 2),
})

# 2. Define target label
def simulate_label(row):
    score = 0
    if row["num_attendees"] <= 5:
        score += 1
    if row["duration_minutes"] <= 60:
        score += 1
    if row["has_agenda"] == 1:
        score += 1
    if row["historical_productivity_avg"] > 0.5:
        score += 1
    return 1 if score >= 3 else 0

data["is_productive"] = data.apply(simulate_label, axis=1)

# 3. Split data
X = data.drop("is_productive", axis=1)
y = data["is_productive"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 5. Evaluate model
print(classification_report(y_test, model.predict(X_test)))

#  6. Save model
# os.makedirs("model", exist_ok=True)
# joblib.dump(model, "model/meeting_roi_model.pkl")
# print("\n Model saved to 'model/meeting_roi_model.pkl'")

