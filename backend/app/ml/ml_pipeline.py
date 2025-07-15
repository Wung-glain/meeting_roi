import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib

def load_and_preprocess(filepath):
    df = pd.read_csv(filepath)

    df['date'] = pd.to_datetime(df['date'])
    df['day_of_week'] = df['date'].dt.dayofweek
    df['month'] = df['date'].dt.month
    df = df.drop(columns=['meeting_id', 'date'])

    df['has_action_items'] = df['has_action_items'].astype(int)
    df['agenda_clarity'] = df['agenda_clarity'].astype(float)
    df['outcome'] = df['outcome'].map({'productive': 1, 'unproductive': 0})

    df['cost'] = (df['average_annual_salary'] / 2080) * df['duration'] * df['attendees']

    # Reduce high-cardinality categorical values
    for col in ['roles', 'departments']:
        top = df[col].value_counts().nlargest(10).index
        df[col] = df[col].apply(lambda x: x if x in top else 'Other')

    df = pd.get_dummies(df, columns=['remote', 'tool', 'meeting_type', 'departments', 'roles'])

    return df


def train_models(df):
    X = df.drop(columns=['meeting_id', 'date', 'outcome', 'cost'])
    y_class = df['outcome']
    y_cost = df['cost']

    X_train, X_test, y_train_class, y_test_class = train_test_split(X, y_class, test_size=0.2)
    _, _, y_train_cost, y_test_cost = train_test_split(X, y_cost, test_size=0.2)

    clf = RandomForestClassifier().fit(X_train, y_train_class)
    reg = RandomForestRegressor().fit(X_train, y_train_cost)

    joblib.dump(clf, 'models/productivity_model.pkl')
    joblib.dump(reg, 'models/cost_model.pkl')
    joblib.dump(X.columns.tolist(), 'models/features.pkl')

    return clf, reg

def suggest_improvement(row):
    suggestions = []
    if row['agenda_clarity'] < 0.5:
        suggestions.append("Clarify agenda.")
    if row['has_action_items'] == 0:
        suggestions.append("Add actionable items.")
    if row['duration'] > 60:
        suggestions.append("Reduce meeting duration.")
    if row['attendees'] > 10:
        suggestions.append("Limit attendees to key stakeholders.")
    return suggestions

