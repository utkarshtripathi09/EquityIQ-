import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from datetime import timedelta

def fetch_data(ticker: str, period: str = "2y"):
    df = yf.download(ticker, period=period, progress=False)
    # yfinance sometimes returns a multi-index for columns in newer versions
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    return df

def clean_data(df: pd.DataFrame):
    df.ffill(inplace=True)
    df.bfill(inplace=True)
    return df

def calculate_rsi(data, periods=14):
    close_delta = data['Close'].diff()
    up = close_delta.clip(lower=0)
    down = -1 * close_delta.clip(upper=0)
    ma_up = up.rolling(window=periods).mean()
    ma_down = down.rolling(window=periods).mean()
    rsi = ma_up / ma_down
    rsi = 100 - (100 / (1 + rsi))
    return rsi

def engineer_features(df: pd.DataFrame):
    df['SMA_20'] = df['Close'].rolling(window=20).mean()
    df['SMA_50'] = df['Close'].rolling(window=50).mean()
    df['RSI'] = calculate_rsi(df)
    df['Target'] = df['Close'].shift(-1)  # Predict next day's close
    df.dropna(inplace=True)
    return df

def predict_trend(ticker: str):
    df = fetch_data(ticker)
    if df.empty:
        raise ValueError(f"No data found for ticker {ticker}")
    
    df = clean_data(df)
    df = engineer_features(df)
    
    features = ['Open', 'High', 'Low', 'Close', 'Volume', 'SMA_20', 'SMA_50', 'RSI']
    X = df[features]
    y = df['Target']
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    
    # Use .values to avoid scikit-learn warnings about feature names
    X_vals = X.values
    model.fit(X_vals, y.values)
    
    last_row = df.iloc[-1].copy()
    current_features_vals = last_row[features].values.reshape(1, -1)
    
    predictions = []
    current_date = df.index[-1]
    
    for i in range(7):
        next_date = current_date + timedelta(days=i+1)
        if next_date.weekday() >= 5: # Skip weekends
            next_date += timedelta(days=(7 - next_date.weekday()))
            
        pred = model.predict(current_features_vals)[0]
        
        tree_preds = [tree.predict(current_features_vals)[0] for tree in model.estimators_]
        std_dev = np.std(tree_preds)
        
        predictions.append({
            "date": next_date.strftime('%Y-%m-%d'),
            "predictedPrice": round(float(pred), 2),
            "confidenceIntervalLow": round(float(pred - 1.96 * std_dev), 2),
            "confidenceIntervalHigh": round(float(pred + 1.96 * std_dev), 2)
        })
        
        # Update current_features_vals naively for next step (Index 3 is Close)
        current_features_vals[0][3] = pred
        current_date = next_date
        
    return predictions
