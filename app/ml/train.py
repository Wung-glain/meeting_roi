import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib # For dumping models
import os # For path manipulation

def train_and_save_models(csv_file_path: str):
    """
    Loads data from a CSV, preprocesses it, trains productivity and cost models,
    and saves them along with the LabelEncoder and feature list.

    Args:
        csv_file_path (str): The path to your dataset CSV file.
    """
    if not os.path.exists(csv_file_path):
        raise FileNotFoundError(f"CSV file not found at: {csv_file_path}")

    df = pd.read_csv(csv_file_path)

    # --- Data Preprocessing ---
    # Drop irrelevant columns (meeting_id is unique identifier, date requires feature engineering not covered here)
    df_processed = df.drop(columns=['meeting_id', 'date'])

    # Handle the 'roles' column: create dummy variables for each role
    df_processed['roles_list'] = df_processed['roles'].apply(lambda x: [role.strip() for role in x.split(';')])
    all_roles = sorted(list(set([role for sublist in df_processed['roles_list'] for role in sublist])))
    for role in all_roles:
        df_processed[f'role_{role}'] = df_processed['roles_list'].apply(lambda x: 1 if role in x else 0)
    df_processed = df_processed.drop(columns=['roles', 'roles_list'])

    # Convert boolean columns to integer (0 or 1)
    df_processed['remote'] = df_processed['remote'].astype(int)
    df_processed['has_action_items'] = df_processed['has_action_items'].astype(int)

    # One-hot encode other categorical features
    df_processed = pd.get_dummies(df_processed, columns=['time_block', 'tool', 'meeting_type'], drop_first=True)

    # Separate features (X) and target (y) for productivity prediction
    X_productivity = df_processed.drop(columns=['outcome', 'estimated_cost'])
    y_productivity = df_processed['outcome']

    # Encode the target variable for productivity prediction
    le = LabelEncoder()
    y_productivity_encoded = le.fit_transform(y_productivity)

    # Separate features (X) and target (y) for cost estimation
    X_cost = df_processed.drop(columns=['outcome', 'estimated_cost'])
    y_cost = df_processed['estimated_cost']

    # Split data for productivity prediction
    X_train_prod, _, y_train_prod, _ = train_test_split(
        X_productivity, y_productivity_encoded, test_size=0.2, random_state=42, stratify=y_productivity_encoded
    )

    # Train Productivity Prediction Model
    productivity_model = RandomForestClassifier(n_estimators=100, random_state=42)
    productivity_model.fit(X_train_prod, y_train_prod)

    # Split data for cost estimation
    X_train_cost, _, y_train_cost, _ = train_test_split(
        X_cost, y_cost, test_size=0.2, random_state=42
    )

    # Train Cost Estimation Model
    cost_model = RandomForestRegressor(n_estimators=100, random_state=42)
    cost_model.fit(X_train_cost, y_train_cost)

    # --- Dump Models to .pkl Files ---
    joblib.dump(productivity_model, 'productivity_model.pkl')
    print("Productivity model dumped to 'productivity_model.pkl'")

    joblib.dump(cost_model, 'estimated_cost_model.pkl')
    print("Estimated cost model dumped to 'estimated_cost_model.pkl'")

    joblib.dump(le, 'label_encoder.pkl')
    print("Label Encoder dumped to 'label_encoder.pkl'")

    # Save the list of columns the model was trained on. This is CRUCIAL for prediction.
    joblib.dump(X_productivity.columns.tolist(), 'model_features.pkl')
    print("Model features dumped to 'model_features.pkl'")

if __name__ == "__main__":
    # Call the training function with the path to your CSV file
    train_and_save_models('synthetic_meetings_with_cost.csv')